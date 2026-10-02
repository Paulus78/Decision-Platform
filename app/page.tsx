import Explainer from "@/components/explainer/Explainer";
import type { Story } from "@/lib/story";
import story from "@/stories/gehaltsangebot.json";
import voice from "@/stories/gehaltsangebot.voice.json";

export default function Home() {
  return <Explainer story={story as Story} voice={voice.lines} />;
}
