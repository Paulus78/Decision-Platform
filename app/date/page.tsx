import DateFilm from "@/components/explainer/DateFilm";
import type { Story } from "@/lib/story";
import story from "@/stories/erstesdate.json";
import voice from "@/stories/erstesdate.voice.json";

export default function DatePage() {
  return <DateFilm story={story as Story} voice={voice.lines} />;
}
