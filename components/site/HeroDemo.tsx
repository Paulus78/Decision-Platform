"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CallScene, type Mood } from "@/components/explainer/art";
import { Brain } from "@/components/explainer/date-art";

// Spielbare Mini-Entscheidung im ersten Bildschirm: die erste Entscheidung
// aus „Das Angebot“ (Texte aus stories/gehaltsangebot.json), ohne Ton.

type Answer = {
  id: string;
  text: string;
  reply: string;
  table: string;
  you: Mood;
  brandt: Mood;
  brain: string;
};

const QUESTION = "Bevor ich das Angebot fertig mache: Was hatten Sie sich gehaltlich vorgestellt?";

const ANSWERS: Answer[] = [
  {
    id: "A",
    text: "57.500 €.",
    reply: "Oh. Okay. Das liegt über dem, was wir eingeplant hatten. Ich spreche mit dem Fachbereich.",
    table: "57.500 € · deine Zahl",
    you: "happy",
    brandt: "surprised",
    brain: "Wir haben eine Zahl gesagt. Laut. Und wir leben noch.",
  },
  {
    id: "B",
    text: "Zwischen 50.000 und 56.000 €.",
    reply: "50.000, das nehme ich mal so mit.",
    table: "50.000 € · sie hört nur das untere Ende",
    you: "worried",
    brandt: "happy",
    brain: "Sie hat nur „50.000“ gehört. Den Rest hätten wir uns sparen können.",
  },
  {
    id: "C",
    text: "Was zahlen Sie denn?",
    reply: "Wir liegen bei 46.000 bis 50.000 €, je nach Erfahrung.",
    table: "46.000–50.000 € · ihre Zahl",
    you: "surprised",
    brandt: "neutral",
    brain: "Jetzt steht ihre Zahl im Raum. Nicht unsere.",
  },
];

function BrainIcon() {
  return (
    <svg viewBox="30 130 240 240" className="h-full w-full" aria-hidden="true">
      <Brain talking={false} />
    </svg>
  );
}

export default function HeroDemo() {
  const [picked, setPicked] = useState<Answer | null>(null);
  const [talking, setTalking] = useState(false);

  // Frau Brandt bewegt kurz den Mund, wenn sie antwortet.
  useEffect(() => {
    if (!picked) return;
    const start = setTimeout(() => setTalking(true), 500);
    const stop = setTimeout(() => setTalking(false), 2600);
    return () => {
      clearTimeout(start);
      clearTimeout(stop);
    };
  }, [picked]);

  return (
    <div className="w-full">
      <div className="relative overflow-clip rounded-[20px] bg-creme shadow-lift">
        <svg viewBox="0 0 1600 900" className="block aspect-video w-full" aria-hidden="true">
          <CallScene
            youMood={picked ? picked.you : "worried"}
            brandtMood={picked ? picked.brandt : "happy"}
            brandtTalking={talking}
            bubble={picked ? picked.text : null}
          />
        </svg>
        {picked && (
          <p
            key={picked.id}
            className="pop-in absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-navy px-4 py-1.5 text-sm font-bold text-white [animation-delay:0.9s]"
          >
            {picked.table}
          </p>
        )}
      </div>

      <div className="mt-4 rounded-[20px] bg-white p-5 shadow-card">
        <p className="text-sm font-bold text-tealdark">Frau Brandt, HR</p>
        <p key={picked?.id ?? "q"} className="pop-in mt-1 text-lg font-semibold leading-snug text-navy">
          „{picked ? picked.reply : QUESTION}“
        </p>

        {!picked && (
          <>
            <p className="mt-4 font-display text-xl font-extrabold text-navy">Was sagst du?</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              {ANSWERS.map((answer) => (
                <button
                  key={answer.id}
                  onClick={() => setPicked(answer)}
                  className="press flex items-start gap-3 rounded-[14px] bg-page p-3.5 text-left hover:bg-sun sm:flex-col sm:gap-2"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-black text-white">
                    {answer.id}
                  </span>
                  <span className="font-bold leading-snug text-navy">„{answer.text}“</span>
                </button>
              ))}
            </div>
          </>
        )}

        {picked && (
          <>
            <div key={picked.id} className="pop-in mt-4 flex items-center gap-3 [animation-delay:1.4s]">
              <span className="h-14 w-14 shrink-0">
                <BrainIcon />
              </span>
              <p className="rounded-[14px] rounded-bl-[4px] bg-[#fde6ec] px-4 py-2.5 font-semibold leading-snug text-navy">
                <span className="block text-xs font-bold text-[#b8506c]">Dein Gehirn</span>
                {picked.brain}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/s/gehaltsangebot"
                className="press rounded-[14px] bg-teal px-5 py-3 font-bold text-white hover:bg-tealdark"
              >
                Ganze Situation spielen
              </Link>
              <button
                onClick={() => setPicked(null)}
                className="font-bold text-tealdark underline decoration-2 underline-offset-4 hover:text-navy"
              >
                Andere Antwort probieren
              </button>
            </div>
            <p className="mt-3 text-sm text-mute">
              Ob das klug war, zeigt der Rückblick am Ende der Situation, mit Quellen.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
