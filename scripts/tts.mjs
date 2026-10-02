// Erzeugt die Sprecher-Audiodateien einmalig mit Gemini TTS (Free Tier).
// Aufruf: node scripts/tts.mjs            -> erzeugt nur fehlende Dateien
//         node scripts/tts.mjs --force    -> erzeugt alle neu
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const key = readFileSync(".env.local", "utf8").match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
if (!key) throw new Error("GEMINI_API_KEY fehlt in .env.local");

// Free Tier: 10 Anfragen pro Tag und Modell. Ausweichmodell: TTS_MODEL=gemini-3.8-flash-lite-tts
const MODEL = process.env.TTS_MODEL ?? "gemini-3.8-flash-tts";
const OUT = "public/audio";
const force = process.argv.includes("--force");
const { voices, lines } = JSON.parse(readFileSync("stories/gehaltsangebot.voice.json", "utf8"));

mkdirSync(OUT, { recursive: true });

async function speak(text, voice) {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
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

for (const line of lines) {
  const file = `${OUT}/${line.id}.wav`;
  if (existsSync(file) && !force) continue;
  process.stdout.write(`${line.id} … `);
  try {
    writeFileSync(file, await speak(line.say ?? line.text, voices[line.voice]));
    console.log("ok");
  } catch (error) {
    console.log("FEHLER\n" + error.message);
    process.exit(1);
  }
  // Free Tier: lieber langsam als ins Limit laufen.
  await new Promise((r) => setTimeout(r, 7000));
}
console.log("fertig");
