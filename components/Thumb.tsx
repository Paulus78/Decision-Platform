"use client";

import { CallScene } from "@/components/explainer/art";
import { ParkingScene } from "@/components/explainer/auto-art";
import { DateScene } from "@/components/explainer/date-art";
import { LeonScene } from "@/components/explainer/leon-art";
import { OfficeScene } from "@/components/explainer/office-art";
import { ChatScene } from "@/components/explainer/wohnung-art";

// Vorschaubild einer Situation: die echte Szene aus dem Film, im entscheidenden Moment.
function scene(slug: string) {
  switch (slug) {
    case "gehaltsangebot":
      return <CallScene youMood="worried" brandtMood="happy" brandtTalking={false} bubble={null} />;
    case "jahresgespraech":
      return (
        <OfficeScene
          place="office"
          stats={0}
          youMood="worried"
          kruegerMood="neutral"
          kruegerTalking={false}
          brain={false}
          brainTalking={false}
          bubble={null}
          phoneBuzz={false}
        />
      );
    case "autoverkauf":
      return (
        <ParkingScene
          youMood="surprised"
          alexMood="happy"
          alexTalking={false}
          alex
          car
          bubble={null}
          compare={false}
        />
      );
    case "traumwohnung":
      return (
        <ChatScene
          night={false}
          mood="surprised"
          messages={[{ from: "markus", text: "Den Schlüssel schicke ich dir per Post." }]}
          markusTalking={false}
          search={false}
        />
      );
    case "erstes-date":
      return (
        <DateScene
          place="bar"
          lena
          youMood="worried"
          lenaMood="happy"
          lenaTalking={false}
          brain
          brainTalking={false}
          bubble={null}
          phoneBuzz={false}
        />
      );
    case "leon":
      return (
        <LeonScene
          night={false}
          mood="worried"
          messages={[{ from: "leon", text: "Kriegst du nächste Woche zurück, safe." }]}
          story="festival"
          brain={false}
          brainTalking={false}
        />
      );
    default:
      return null;
  }
}

export default function Thumb({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      className={className}
      style={{ background: "#f6e7cf" }}
      aria-hidden="true"
    >
      {scene(slug)}
    </svg>
  );
}
