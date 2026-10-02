import type { Metadata } from "next";
import SeriesHub from "@/components/series/SeriesHub";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { SITE } from "@/lib/site";
import type { Story } from "@/lib/story";
import story from "@/stories/gehaltsangebot.json";
import voice from "@/stories/gehaltsangebot.voice.json";

export const metadata: Metadata = {
  title: `Die Serie: Das Angebot · ${SITE.name}`,
  description: "Jeden Tag eine Folge, eine Entscheidung, ein Cliffhanger. Deine Antwort bestimmt, wie es weitergeht.",
};

export default function SeriePage() {
  return (
    <>
      <Header />
      <SeriesHub story={story as Story} voice={voice.lines} />
      <Footer />
    </>
  );
}
