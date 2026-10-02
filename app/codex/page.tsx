import type { Metadata } from "next";
import CarFilm, { type AudioCueMap } from "@/components/codex/CarFilm";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export const metadata: Metadata = {
  title: "Der Käufer ist schon da · Decision Platform",
  description: "Ein interaktives Erklärvideo über deinen privaten Autoverkauf.",
};

export default function Page() {
  const directory = path.join(process.cwd(), "public/audio/codex");
  const audioFiles = existsSync(directory)
    ? readdirSync(directory)
        .filter((f) => f.endsWith(".mp3"))
        .map((f) => f.slice(0, -4))
    : [];
  const manifestPath = path.join(directory, "manifest.json");
  const audioCues: AudioCueMap = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8")).files
    : {};
  return <CarFilm audioFiles={audioFiles} audioCues={audioCues} />;
}
