import TextPlayer from "@/components/TextPlayer";
import type { Story } from "@/lib/story";
import story from "@/stories/gehaltsangebot.json";

export default function Home() {
  return <TextPlayer story={story as Story} />;
}
