"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CallScene, type Mood } from "@/components/explainer/art";
import { Brain } from "@/components/explainer/date-art";

// Der erste Bildschirm ist eine spielbare Entscheidung: die erste aus
// „Das Angebot“ (Texte aus stories/gehaltsangebot.json), ohne Ton.
// Ablauf: Frage → deine Antwort → ihre Reaktion → Kommentar vom Gehirn.
// Die Auflösung gibt es bewusst erst im Film.

type Answer = {
  id: string;
  text: string;
  reply: string;
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
    you: "happy",
    brandt: "surprised",
    brain: "Wir haben eine Zahl gesagt. Laut. Und wir leben noch.",
  },
  {
    id: "B",
    text: "Zwischen 50.000 und 56.000 €.",
    reply: "50.000, das nehme ich mal so mit.",
    you: "worried",
    brandt: "happy",
    brain: "Sie hat nur „50.000“ gehört. Den Rest hätten wir uns sparen können.",
  },
  {
    id: "C",
    text: "Was zahlen Sie denn?",
    reply: "Wir liegen bei 46.000 bis 50.000 €, je nach Erfahrung.",
    you: "surprised",
    brandt: "neutral",
    brain: "Jetzt steht ihre Zahl im Raum. Nicht unsere.",
  },
];

// 0 Frage, 1 deine Antwort, 2 ihre Reaktion, 3 Gehirn und Knopf
type Step = 0 | 1 | 2 | 3;

export default function HeroDemo() {
  const [picked, setPicked] = useState<Answer | null>(null);
  const [step, setStep] = useState<Step>(0);

  useEffect(() => {
    if (!picked) return;
    const reply = setTimeout(() => setStep(2), 1500);
    const verdict = setTimeout(() => setStep(3), 3600);
    return () => {
      clearTimeout(reply);
      clearTimeout(verdict);
    };
  }, [picked]);

  function pick(answer: Answer) {
    if (picked) return;
    setPicked(answer);
    setStep(1);
  }

  function reset() {
    setPicked(null);
    setStep(0);
  }

  const reacted = picked && step >= 2;
  const mine = step === 1 && picked;
  const bubble = mine ? picked.text : reacted ? picked.reply : QUESTION;

  return (
    <section className="bg-navy text-white">
      {/* Die Szene über die ganze Breite */}
      <div className="relative overflow-clip bg-creme">
        <svg
          // Ausschnitt beginnt knapp über den Köpfen, damit sie auf breiten Bildschirmen nicht abgeschnitten werden.
          viewBox="0 230 1600 670"
          preserveAspectRatio="xMidYMin slice"
          className="block aspect-video w-full md:aspect-auto md:h-[46vh] md:max-h-[520px] md:min-h-[340px]"
          aria-hidden="true"
        >
          <CallScene
            youMood={reacted ? picked.you : "worried"}
            brandtMood={reacted ? picked.brandt : "happy"}
            brandtTalking={step === 2}
            bubble={null}
          />
        </svg>
        <div className="absolute left-1/2 top-[9%] hidden w-[30%] min-w-[17rem] max-w-[26rem] -translate-x-1/2 md:block">
          <div
            key={`${picked?.id}-${step === 1}-${reacted}`}
            className={`pop-in px-5 py-4 shadow-paper ${
              mine
                ? "rounded-[20px] rounded-bl-[4px] bg-teal text-white"
                : "rounded-[20px] rounded-br-[4px] bg-white text-navy"
            }`}
          >
            <p className={`text-sm font-bold ${mine ? "text-white/80" : "text-tealdark"}`}>
              {mine ? "Du" : "Frau Brandt, HR"}
            </p>
            <p className="font-display text-xl font-bold leading-snug">„{bubble}“</p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1120px] px-5 pb-14 pt-8">
        {/* Auf dem Handy steht die Sprechblase unter dem Bild */}
        <div className="mb-6 rounded-[20px] rounded-tl-[4px] bg-white px-5 py-4 text-navy md:hidden">
          <p className="text-sm font-bold text-tealdark">{mine ? "Du" : "Frau Brandt, HR"}</p>
          <p className="font-display text-lg font-bold leading-snug">„{bubble}“</p>
        </div>

        {step < 3 && (
          <>
            <p className="flex items-center gap-2.5 font-bold text-sun">
              <span className="flex gap-1" aria-hidden="true">
                <span className="h-4 w-1.5 rounded-sm bg-sun" />
                <span className="h-4 w-1.5 rounded-sm bg-sun" />
              </span>
              Der Film hält an. Du bist dran.
            </p>
            <h1 className="mt-1 font-display text-[clamp(48px,8vw,96px)] font-extrabold leading-[0.95] tracking-tighter">
              Was sagst du?
            </h1>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {ANSWERS.map((answer) => {
                const chosen = picked?.id === answer.id;
                return (
                  <button
                    key={answer.id}
                    onClick={() => pick(answer)}
                    disabled={!!picked}
                    className={`press flex items-center gap-4 rounded-[18px] p-4 text-left md:flex-col md:items-start md:p-5 ${
                      chosen
                        ? "bg-sun text-navy"
                        : picked
                          ? "bg-white/30 text-navy"
                          : "bg-white text-navy hover:bg-sun"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-display text-lg font-extrabold text-white">
                      {answer.id}
                    </span>
                    <span className="font-display text-xl font-bold leading-tight md:text-2xl">
                      „{answer.text}“
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-6 max-w-[44rem] text-lg text-white/75">
              Das ist Generalprobe: kurze gezeichnete Situationen, die dreimal anhalten und auf deine Antwort
              warten. Üb den schwierigen Moment, bevor er echt ist.
            </p>
          </>
        )}

        {step === 3 && picked && (
          <div className="max-w-[46rem]">
            <div className="pop-in flex items-center gap-4">
              <span className="h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                <svg viewBox="30 130 240 240" className="h-full w-full" aria-hidden="true">
                  <Brain talking={false} />
                </svg>
              </span>
              <div className="rounded-[20px] rounded-bl-[4px] bg-[#fde6ec] px-5 py-4 text-navy">
                <p className="text-sm font-bold text-[#a8405c]">Dein Gehirn</p>
                <p className="font-display text-[clamp(22px,2.6vw,31px)] font-bold leading-tight">
                  {picked.brain}
                </p>
              </div>
            </div>
            <div className="pop-in mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 [animation-delay:0.3s]">
              <Link
                href="/s/gehaltsangebot"
                className="press rounded-[14px] bg-sun px-6 py-3.5 text-lg font-bold text-navy hover:bg-white"
              >
                Ganze Situation spielen
              </Link>
              <button
                onClick={reset}
                className="font-bold text-white underline decoration-2 underline-offset-4 hover:text-sun"
              >
                Andere Antwort probieren
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
