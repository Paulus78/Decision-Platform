// Erzeugt die Sprecher-Audiodateien einmalig und legt sie in public/audio/.
// Das Video spielt danach nur noch fertige Dateien ab.
//
// Aufruf: node scripts/tts.mjs                -> erzeugt nur fehlende Dateien
//         node scripts/tts.mjs --force        -> erzeugt alle neu
//         node scripts/tts.mjs --only n5,m2   -> nur diese Zeilen
//         node scripts/tts.mjs --list         -> zeigt nur, was fehlt (kostet nichts)
//
// Anbieter: ElevenLabs, wenn ELEVENLABS_API_KEY in .env.local steht und die Stimme
// in der voice.json eine "elevenlabs"-ID hat. Sonst Gemini TTS.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

// Gemini Free Tier: 10 Anfragen pro Tag und Modell.
// Ausweichmodell: TTS_MODEL=gemini-3.8-flash-lite-tts
const GEMINI_MODEL = process.env.TTS_MODEL ?? "gemini-3.8-flash-tts";
const ELEVEN_MODEL = "eleven_multilingual_v2";
const OUT = "public/audio";
const VOICE_FILE = "stories/gehaltsangebot.voice.json";
const MANIFEST = "stories/gehaltsangebot.audio.json";

const args = process.argv.slice(2);
const force = args.includes("--force");
const listOnly = args.includes("--list");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;

const { voices, lines } = JSON.parse(readFileSync(VOICE_FILE, "utf8"));
mkdirSync(OUT, { recursive: true });

async function gemini(text, voice) {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: { "x-goog-api-key": env.GEMINI_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      input: [
        {
          type: "user_input",
          content: [
            { type: "text", text, annotations: [{ type: "speech_metadata", style: voice.style }] },
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
    for (const part of step.content ?? []) {
      if (part.data) return Buffer.from(part.data, "base64");
    }
  }
  throw new Error("Keine Audiodaten in der Antwort: " + JSON.stringify(json).slice(0, 400));
}

async function elevenlabs(text, voice) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice.elevenlabs}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": env.ELEVENLABS_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ text, model_id: ELEVEN_MODEL }),
    },
  );
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

function existing(id) {
  return ["mp3", "wav"].map((ext) => `${id}.${ext}`).find((f) => existsSync(`${OUT}/${f}`));
}

// Die Liste sagt dem Video, welche Sätze schon eine Audiodatei haben.
function writeManifest() {
  const manifest = {};
  for (const line of lines) {
    const file = existing(line.id);
    if (file) manifest[line.id] = file;
  }
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

const todo = lines.filter((l) => (only ? only.includes(l.id) : force || !existing(l.id)));
const chars = todo.reduce((sum, l) => sum + (l.say ?? l.text).length, 0);
console.log(`${todo.length} Sätze zu erzeugen, ${chars} Zeichen.`);

if (!listOnly) {
  for (const line of todo) {
    const voice = voices[line.voice];
    const useEleven = Boolean(env.ELEVENLABS_API_KEY && voice.elevenlabs);
    process.stdout.write(`${line.id} (${useEleven ? "ElevenLabs" : "Gemini"}) … `);
    try {
      const text = line.say ?? line.text;
      const data = useEleven ? await elevenlabs(text, voice) : await gemini(text, voice);
      writeFileSync(`${OUT}/${line.id}.${useEleven ? "mp3" : "wav"}`, data);
      console.log("ok");
    } catch (error) {
      console.log("FEHLER\n" + error.message);
      break;
    }
    // Lieber langsam als ins Limit laufen.
    await new Promise((r) => setTimeout(r, useEleven ? 500 : 7000));
  }
}

const manifest = writeManifest();
console.log(`${Object.keys(manifest).length} von ${lines.length} Sätzen haben eine Audiodatei.`);
