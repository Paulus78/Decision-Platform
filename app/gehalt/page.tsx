import Explainer from "@/components/explainer/Explainer";
import type { Story } from "@/lib/story";
import story from "@/stories/gehaltsangebot.json";
import voice from "@/stories/gehaltsangebot.voice.json";

export default function GehaltPage() {
  return <Explainer story={story as Story} voice={voice.lines} />;
}
