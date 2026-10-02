import VideoPlayer from "@/components/video/VideoPlayer";
import type { Story } from "@/lib/story";
import story from "@/stories/gehaltsangebot.json";

// Erste Version (Text-Video im Hochformat), nur noch zum Vergleich.
export default function V1Page() {
  return <VideoPlayer story={story as Story} />;
}
