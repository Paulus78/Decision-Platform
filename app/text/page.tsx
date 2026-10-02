import TextPlayer from "@/components/TextPlayer";
import type { Story } from "@/lib/story";
import story from "@/stories/gehaltsangebot.json";

// Textversion ohne Design, zum schnellen Testen von Story und Engine.
export default function TextPage() {
  return <TextPlayer story={story as Story} />;
}
