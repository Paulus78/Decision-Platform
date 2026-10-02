import AutoFilm from "@/components/explainer/AutoFilm";
import DateFilm from "@/components/explainer/DateFilm";
import Explainer from "@/components/explainer/Explainer";
import LeonFilm from "@/components/explainer/LeonFilm";
import OfficeFilm from "@/components/explainer/OfficeFilm";
import Wohnung from "@/components/explainer/Wohnung";
import type { VoiceLine } from "@/components/explainer/ui";
import type { Story } from "@/lib/story";
import autoStory from "@/stories/autoverkauf.json";
import autoVoice from "@/stories/autoverkauf.voice.json";
import erhoehungStory from "@/stories/erhoehung.json";
import erhoehungVoice from "@/stories/erhoehung.voice.json";
import dateStory from "@/stories/erstesdate.json";
import dateVoice from "@/stories/erstesdate.voice.json";
import gehaltStory from "@/stories/gehaltsangebot.json";
import gehaltVoice from "@/stories/gehaltsangebot.voice.json";
import leonStory from "@/stories/leon.json";
import leonVoice from "@/stories/leon.voice.json";
import wohnungStory from "@/stories/traumwohnung.json";
import wohnungVoice from "@/stories/traumwohnung.voice.json";

type FilmProps = { story: Story; voice: VoiceLine[] };

// Welcher Film gehört zu welcher Situation aus stories/index.ts.
const FILMS: Record<string, { Film: React.ComponentType<FilmProps>; story: unknown; voice: unknown }> = {
  gehaltsangebot: { Film: Explainer, story: gehaltStory, voice: gehaltVoice.lines },
  jahresgespraech: { Film: OfficeFilm, story: erhoehungStory, voice: erhoehungVoice.lines },
  autoverkauf: { Film: AutoFilm, story: autoStory, voice: autoVoice.lines },
  traumwohnung: { Film: Wohnung, story: wohnungStory, voice: wohnungVoice.lines },
  "erstes-date": { Film: DateFilm, story: dateStory, voice: dateVoice.lines },
  leon: { Film: LeonFilm, story: leonStory, voice: leonVoice.lines },
};

export function hasFilm(slug: string) {
  return slug in FILMS;
}

export default function Film({ slug }: { slug: string }) {
  const entry = FILMS[slug];
  if (!entry) return null;
  const { Film: Component, story, voice } = entry;
  return <Component story={story as Story} voice={voice as VoiceLine[]} />;
}
