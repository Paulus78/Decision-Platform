import LeonFilm from "@/components/explainer/LeonFilm";
import type { Story } from "@/lib/story";
import story from "@/stories/leon.json";
import voice from "@/stories/leon.voice.json";

export default function LeonPage() {
  return <LeonFilm story={story as Story} voice={voice.lines} />;
}
