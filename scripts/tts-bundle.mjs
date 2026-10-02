// Gemini TTS, sparsam: mehrere Sätze derselben Stimme in EINER Anfrage erzeugen
// und die Aufnahme danach an den Pausen auseinanderschneiden (ffmpeg nötig).
// So reichen die 10 kostenlosen Anfragen pro Tag für eine ganze Situation.
//
// Aufruf: node scripts/tts-bundle.mjs --story leon [--size 6] [--model gemini-3.8-flash-lite-tts]
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const key = readFileSync(".env.local", "utf8").match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
const args = process.argv.slice(2);
const arg = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const story = arg("--story", "gehaltsangebot");
const size = Number(arg("--size", "6"));
const model = arg("--model", "gemini-3.8-flash-tts");
const maxRequests = Number(arg("--max", "99"));

const SUB = story === "gehaltsangebot" ? "" : `${story}/`;
const OUT = `public/audio/${SUB}`.replace(/\/$/, "");
const TMP = `${OUT}/_bundle.wav`;
const { voices, lines } = JSON.parse(readFileSync(`stories/${story}.voice.json`, "utf8"));
mkdirSync(OUT, { recursive: true });

const has = (id) => ["mp3", "wav"].some((ext) => existsSync(`${OUT}/${id}.${ext}`));
const PAUSE = "Sprich jeden Absatz für sich. Mache zwischen zwei Absätzen eine deutliche, stille Pause von etwa zwei Sekunden. ";

async function speak(text, voice) {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      input: [
        {
          type: "user_input",
          content: [
            { type: "text", text, annotations: [{ type: "speech_metadata", style: PAUSE + voice.style }] },
          ],
        },
      ],
      response_format: { type: "audio" },
      generation_config: { speech_config: [{ voice: voice.name }] },
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const json = await res.json();
  for (const step of json.steps ?? []) {
    for (const part of step.content ?? []) if (part.data) return Buffer.from(part.data, "base64");
  }
  throw new Error("Keine Audiodaten: " + JSON.stringify(json).slice(0, 300));
}

// Schneidet die Aufnahme an den (count - 1) längsten stillen Pausen.
// Das ist robuster als ein fester Schwellwert: Pausen zwischen Absätzen sind
// länger als Pausen zwischen zwei Sätzen im selben Absatz.
function findCuts(file, count) {
  // ffmpeg schreibt die Analyse nach stderr; deshalb über die Shell umleiten.
  const text = execFileSync(
    "bash",
    ["-c", `ffmpeg -hide_banner -nostats -i "${file}" -af silencedetect=noise=-38dB:d=0.3 -f null - 2>&1`],
    { encoding: "utf8" },
  );
  const starts = [...text.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...text.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  const d = text.match(/Duration: (\d+):(\d+):([\d.]+)/);
  const duration = Number(d[1]) * 3600 + Number(d[2]) * 60 + Number(d[3]);
  // Stille ganz am Anfang oder Ende ist keine Grenze zwischen zwei Sätzen.
  const gaps = starts
    .map((start, i) => ({ start, end: ends[i] ?? duration }))
    .filter((g) => g.start > 0.3 && g.end < duration - 0.3);
  if (gaps.length < count - 1) return [];
  const cuts = [...gaps]
    .sort((x, y) => y.end - y.start - (x.end - x.start))
    .slice(0, count - 1)
    .sort((x, y) => x.start - y.start);
  const parts = [];
  let from = 0;
  for (const cut of cuts) {
    parts.push([from, cut.start]);
    from = cut.end;
  }
  parts.push([from, duration]);
  return parts;
}

const todo = lines.filter((l) => !has(l.id));
const groups = [];
for (const voiceId of Object.keys(voices)) {
  const mine = todo.filter((l) => l.voice === voiceId);
  for (let i = 0; i < mine.length; i += size) groups.push(mine.slice(i, i + size));
}
console.log(`${todo.length} Sätze fehlen, ${groups.length} Anfragen nötig.`);

let requests = 0;
for (const group of groups) {
  if (requests >= maxRequests) break;
  requests++;
  const ids = group.map((l) => l.id).join(", ");
  process.stdout.write(`[${ids}] … `);
  try {
    const text = group.map((l) => l.say ?? l.text).join("\n\n\n");
    writeFileSync(TMP, await speak(text, voices[group[0].voice]));
    const parts = findCuts(TMP, group.length);
    if (parts.length !== group.length) {
      console.log(`FEHLER: ${parts.length} Abschnitte statt ${group.length} gefunden. Nichts gespeichert.`);
      continue;
    }
    group.forEach((line, i) => {
      const [from, to] = parts[i];
      execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", TMP, "-ss", String(Math.max(0, from - 0.08)), "-to", String(to + 0.15), "-b:a", "128k", `${OUT}/${line.id}.mp3`]);
    });
    console.log("ok");
  } catch (error) {
    console.log("FEHLER\n" + String(error.message).slice(0, 300));
    break;
  }
  // Free Tier: höchstens 3 Anfragen pro Minute.
  await new Promise((r) => setTimeout(r, 22000));
}
console.log("Danach bitte: node scripts/tts.mjs --story " + story + " --list  (schreibt die Liste der Audiodateien neu)");
