import AutoFilm from "@/components/explainer/AutoFilm";
import type { Story } from "@/lib/story";
import story from "@/stories/autoverkauf.json";
import voice from "@/stories/autoverkauf.voice.json";

export default function AutoPage() {
  return <AutoFilm story={story as Story} voice={voice.lines} />;
}
