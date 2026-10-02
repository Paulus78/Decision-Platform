// Spielt für jede Situation alle Wege automatisch durch (3 Entscheidungen = 27 Wege)
// und prüft: Jeder Weg kommt an, jedes Ende ist erreichbar, und zu jedem
// gesprochenen Satz gibt es einen Sprechertext und (falls erzeugt) eine Audiodatei.
//
// Aufruf: node --experimental-strip-types scripts/test-stories.mjs
import { existsSync, readFileSync } from "node:fs";
import { advance, choose, initialState, pickEnding } from "../lib/engine.ts";

const STORIES = ["gehaltsangebot", "traumwohnung", "erstesdate", "leon", "autoverkauf"];
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
let failed = false;

for (const name of STORIES) {
  const story = json(`stories/${name}.json`);
  const voice = json(`stories/${name}.voice.json`);
  const manifestFile = `stories/${name}.audio.json`;
  const manifest = existsSync(manifestFile) ? json(manifestFile) : {};
  const known = new Set(voice.lines.map((l) => l.id));
  const problems = new Set();
  const endings = {};
  const used = new Set();
  const need = (id, where) => {
    if (!id) return;
    used.add(id);
    if (!known.has(id)) problems.add(`Sprechertext fehlt: "${id}" (${where})`);
  };

  const decisions = story.beats.filter((b) => b.type === "decision");
  const walk = (index, state, path) => {
    const next = advance(story.beats, index, state);
    for (const entry of next.entries) {
      if (entry.kind === "scene") need(entry.voice, "Szene");
      if (entry.kind === "line") {
        need(entry.line.voice?.replace(/\{(\w+)\}/g, (_, k) => next.state.choices[k] ?? ""), path);
        if (/\{/.test(entry.line.text)) problems.add(`Platzhalter nicht ersetzt: ${entry.line.text}`);
      }
    }
    const beat = story.beats[next.index];
    if (!beat) {
      const ending = pickEnding(story, next.state);
      endings[ending.id] = (endings[ending.id] ?? 0) + 1;
      need(`e_${ending.id}`, "Ende");
      return;
    }
    need(beat.prompt, "Frage vor der Pause");
    for (const option of beat.options) {
      const chosen = choose(next.state, beat, option);
      for (const entry of chosen.entries) {
        if (entry.kind === "line") {
          need(entry.line.voice?.replace(/\{(\w+)\}/g, (_, k) => chosen.state.choices[k] ?? ""), path + option.id);
        }
      }
      walk(next.index + 1, chosen.state, path + option.id);
    }
  };
  walk(0, { ...initialState, offer: story.start ?? 0, second: story.start2 ?? 0 }, "");

  ["r0", "s1", "out", ...story.reveal.map((_, i) => `r${i + 1}`)].forEach((id) => need(id, "Erklärung"));
  for (const ending of story.endings) {
    if (!endings[ending.id]) problems.add(`Ende nie erreichbar: ${ending.id}`);
  }
  for (const card of story.reveal) {
    if (card.decision && !decisions.some((d) => d.id === card.decision)) {
      problems.add(`Erklär-Karte verweist auf unbekannte Entscheidung: ${card.decision}`);
    }
  }
  const paths = Object.values(endings).reduce((a, b) => a + b, 0);
  const noAudio = [...used].filter((id) => known.has(id) && !manifest[id]);
  const noFile = Object.values(manifest).filter((f) => !existsSync(`public/audio/${f}`));
  if (noFile.length) problems.add(`Audiodatei fehlt auf der Platte: ${noFile.join(", ")}`);

  const ok = problems.size === 0;
  failed ||= !ok;
  console.log(`${ok ? "OK    " : "FEHLER"} ${name}: ${paths} Wege, Enden ${JSON.stringify(endings)}`);
  for (const p of problems) console.log("        - " + p);
  if (noAudio.length) console.log(`        Hinweis: ${noAudio.length} Sätze noch ohne Stimme (${noAudio.slice(0, 6).join(", ")}${noAudio.length > 6 ? ", …" : ""})`);
}
process.exit(failed ? 1 : 0);
