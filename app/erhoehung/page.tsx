import OfficeFilm from "@/components/explainer/OfficeFilm";
import type { Story } from "@/lib/story";
import story from "@/stories/erhoehung.json";
import voice from "@/stories/erhoehung.voice.json";

export default function ErhoehungPage() {
  return <OfficeFilm story={story as Story} voice={voice.lines} />;
}
