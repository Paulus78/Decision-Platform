// One-time assets. No browser API calls, no automatic retry or regeneration.
import {
  readFile,
  writeFile,
  mkdir,
  access,
  open,
  unlink,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "public/audio/codex");
const story = JSON.parse(
  await readFile(path.join(root, "stories/codex-autoverkauf.json"), "utf8"),
);
const clips = Object.entries(story.clips);
const count = clips.reduce((sum, [, clip]) => sum + clip.text.length, 0);
if (count > 3000)
  throw new Error(`Budget überschritten: ${count}/3000 Zeichen.`);
console.log(
  `Gesamter Sprechtext inklusive aller Zweige: ${count}/3000 Zeichen.`,
);
if (
  !process.argv.includes("--voices") &&
  !process.argv.includes("--voices-all") &&
  !process.argv.includes("--generate")
)
  process.exit(0);
const env = await readFile(path.join(root, ".env.local"), "utf8").catch(
  () => "",
);
const key =
  env.match(/^\s*ELEVENLABS_API_KEY\s*=\s*["']?([^\s"']+)/m)?.[1] ||
  process.env.ELEVENLABS_API_KEY;
if (!key)
  throw new Error("ELEVENLABS_API_KEY fehlt in der lokalen .env.local.");
async function request(url, options = {}) {
  const response = await fetch(`https://api.elevenlabs.io${url}`, {
    ...options,
    headers: { ...options.headers, "xi-api-key": key },
    signal: AbortSignal.timeout(90000),
  });
  // Do not print response bodies or headers: avoid accidental secret exposure.
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const known = [
      "invalid_api_key",
      "missing_permissions",
      "quota_exceeded",
      "voice_not_found",
      "payment_required",
    ];
    const reason = known.includes(data.detail?.status)
      ? ` (${data.detail.status})`
      : "";
    if (response.status === 402 && /library/i.test(data.detail?.message ?? ""))
      console.log(
        "Bibliotheksstimme über API im Free-Tier gesperrt. Kostenlose Standardstimme erforderlich.",
      );
    const error = new Error(
      `ElevenLabs HTTP ${response.status}${reason}. Keine automatische Wiederholung.`,
    );
    error.status = response.status;
    throw error;
  }
  return response;
}
const voices = [];
let token;
do {
  const query = new URLSearchParams({
    page_size: "100",
    include_custom_rates: "false",
    include_total_count: "false",
  });
  if (process.argv.includes("--voices")) query.set("language", "de");
  if (token) query.set("next_page_token", token);
  const data = await (await request(`/v2/voices?${query}`)).json();
  voices.push(...data.voices);
  token = data.has_more ? data.next_page_token : null;
} while (token);
if (
  process.argv.includes("--voices") ||
  process.argv.includes("--voices-all")
) {
  console.log(
    JSON.stringify(
      voices.map((v) => ({
        id: v.voice_id,
        name: v.name,
        category: v.category,
        labels: v.labels,
        languages: v.verified_languages?.map((l) => l.language),
        tiers: v.available_for_tiers,
        free: v.sharing?.free_users_allowed,
      })),
      null,
      2,
    ),
  );
  process.exit(0);
}
const configPath = path.join(root, "stories/codex-autoverkauf.voices.json");
const config = JSON.parse(await readFile(configPath, "utf8"));
await mkdir(output, { recursive: true });
const lockPath = path.join(output, ".generation.lock");
const lock = await open(lockPath, "wx").catch(() => {
  throw new Error(
    "TTS-Lauf bereits aktiv oder ungeklärt. Keine zweite Generierung.",
  );
});
try {
  const ledgerPath = path.join(output, "manifest.json");
  const ledger = JSON.parse(
    await readFile(ledgerPath, "utf8").catch(
      () =>
        '{"model":"eleven_multilingual_v2","attemptedCharacters":0,"files":{}}',
    ),
  );
  const pending = [];
  for (const [id, clip] of clips) {
    const hash = createHash("sha256")
      .update(clip.text + JSON.stringify(config[clip.speaker]) + ledger.model)
      .digest("hex");
    const exists = await access(path.join(output, `${id}.mp3`)).then(
      () => true,
      () => false,
    );
    if (exists) {
      if (ledger.files[id]?.hash !== hash)
        throw new Error(
          `Vorhandenes Audio ${id} passt nicht zum Text. Keine automatische Neugenerierung.`,
        );
      continue;
    }
    if (
      ledger.files[id] &&
      !(
        ledger.files[id].status === "rejected" && ledger.files[id].hash !== hash
      )
    )
      throw new Error(
        `Früherer Versuch für ${id} ist ungeklärt oder identisch. Nicht erneut erzeugt.`,
      );
    pending.push({ id, clip, hash });
  }
  const needed = pending.reduce((sum, { clip }) => sum + clip.text.length, 0);
  if (ledger.attemptedCharacters + needed > 3000)
    throw new Error("Kumulatives 3000-Zeichen-Limit überschritten.");
  if (!needed) {
    console.log("Alle Audiodateien vorhanden. 0 neue Zeichen.");
    process.exitCode = 0;
  } else {
    // German support is not a native German voice. Apply this stricter check
    // only to new assets; existing audio remains usable without regeneration.
    for (const role of new Set(pending.map(({ clip }) => clip.speaker))) {
      const voice = voices.find((v) => v.voice_id === config[role]?.id);
      if (voice?.labels?.language !== "de")
        throw new Error(
          `Neue Tonspur für ${role}: deutsche Ausgangsstimme erforderlich (Sprachlabel de). Keine Credits verbraucht.`,
        );
      if (
        voice.category === "professional" ||
        voice.sharing?.free_users_allowed === false
      )
        throw new Error(
          "Diese deutsche Bibliotheksstimme ist über die Free-API nicht verfügbar. Keine Credits verbraucht.",
        );
    }
    // User confirmed Free tier. Subscription read is optional; no billing,
    // upgrade, overage or payment endpoint is ever called by this script.
    let sub;
    try {
      sub = await (await request("/v1/user/subscription")).json();
    } catch (error) {
      if (!error.message.includes("401 (missing_permissions)")) throw error;
      console.log(
        "Kontostand nicht lesbar. Festes Zeichenlimit; Free-Tier beendet Anfragen bei ausgeschöpfter Quote.",
      );
    }
    if (sub && sub.character_limit - sub.character_count < needed)
      throw new Error(
        "Zu wenig kostenlose Credits. Keine kostenpflichtige Generierung.",
      );
    for (const { id, clip, hash } of pending) {
      // Reserve BEFORE sending; a lost connection must never cause a paid duplicate.
      if (ledger.files[id]?.status === "rejected") {
        (ledger.rejectedRequests ??= []).push({ id, ...ledger.files[id] });
      }
      ledger.attemptedCharacters += clip.text.length;
      ledger.files[id] = {
        hash,
        characters: clip.text.length,
        voice: config[clip.speaker].name,
        status: "attempted",
      };
      await writeFile(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
      let response;
      try {
        response = await request(
          `/v1/text-to-speech/${config[clip.speaker].id}/with-timestamps?output_format=mp3_44100_128`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: clip.text,
              model_id: ledger.model,
              voice_settings: config[clip.speaker].settings,
            }),
          },
        );
      } catch (error) {
        if ([400, 401, 402, 403, 422].includes(error.status)) {
          ledger.files[id].status = "rejected";
          ledger.files[id].httpStatus = error.status;
          await writeFile(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
        }
        throw error;
      }
      const speech = await response.json();
      await writeFile(
        path.join(output, `${id}.mp3`),
        Buffer.from(speech.audio_base64, "base64"),
        { flag: "wx" },
      );
      const alignment = speech.alignment;
      const alignedText = alignment?.characters?.join("") ?? "";
      let cursor = 0;
      const sentences = clip.text.split(/(?<=[.!?])\s+/);
      ledger.files[id].duration =
        alignment?.character_end_times_seconds?.at(-1) ?? clip.seconds;
      ledger.files[id].cues = sentences.map((text, i) => {
        const start = alignedText.indexOf(text, cursor);
        const endIndex = start + text.length - 1;
        cursor = endIndex + 1;
        return {
          text,
          end:
            start >= 0
              ? alignment.character_end_times_seconds[endIndex]
              : (ledger.files[id].duration * (i + 1)) / sentences.length,
        };
      });
      ledger.files[id].status = "complete";
      await writeFile(ledgerPath, JSON.stringify(ledger, null, 2) + "\n");
      console.log(`${id}: ${clip.text.length} Zeichen, gespeichert.`);
    }
    const generated = Object.values(ledger.files)
      .filter((f) => f.status === "complete")
      .reduce((sum, f) => sum + f.characters, 0);
    console.log(
      `Fertig. ${needed} neue Zeichen, insgesamt ${generated} erzeugt (${ledger.attemptedCharacters} inkl. abgewiesener Versuche).`,
    );
  }
} finally {
  await lock.close();
  await unlink(lockPath);
}
