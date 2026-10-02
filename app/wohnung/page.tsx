import Wohnung from "@/components/explainer/Wohnung";
import type { Story } from "@/lib/story";
import story from "@/stories/traumwohnung.json";
import voice from "@/stories/traumwohnung.voice.json";

export default function WohnungPage() {
  return <Wohnung story={story as Story} voice={voice.lines} />;
}
