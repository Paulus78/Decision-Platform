import VideoPlayer from "@/components/video/VideoPlayer";
import type { Story } from "@/lib/story";
import story from "@/stories/gehaltsangebot.json";

export default function Home() {
  return <VideoPlayer story={story as Story} />;
}
