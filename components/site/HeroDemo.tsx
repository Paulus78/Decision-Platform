"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CallScene, type Mood } from "@/components/explainer/art";
import { ParkingScene } from "@/components/explainer/auto-art";
import { Brain } from "@/components/explainer/date-art";
import { OfficeScene } from "@/components/explainer/office-art";

// Der erste Bildschirm ist eine spielbare Entscheidung, ohne Ton.
// Drei Situationen wechseln sich ab, bis jemand selbst klickt.
// Ablauf: Frage → deine Antwort → Reaktion → Kommentar vom Gehirn.
// Die Auflösung gibt es bewusst erst im Film.
// Fragen, Antworten und Reaktionen stammen aus der ersten Entscheidung der jeweiligen Story-Datei.

type Answer = {
  id: string;
  text: string;
  reply: string;
  you: Mood;
  other: Mood;
  brain: string;
};

type Demo = {
  slug: string;
  tab: string;
  who: string;
  question: string;
  // Ab welcher Höhe der Zeichnung der Ausschnitt beginnt (knapp über den Köpfen).
  top: number;
  answers: Answer[];
};

const DEMOS: Demo[] = [
  {
    slug: "gehaltsangebot",
    tab: "Jobangebot",
    who: "Frau Brandt, HR",
    question:
      "Bevor ich das Angebot fertig mache: Was hatten Sie sich gehaltlich vorgestellt?",
    top: 230,
    answers: [
      {
        id: "A",
        text: "57.500 €.",
        reply:
          "Oh. Okay. Das liegt über dem, was wir eingeplant hatten. Ich spreche mit dem Fachbereich.",
        you: "happy",
        other: "surprised",
        brain: "Wir haben eine Zahl gesagt. Laut. Und wir leben noch.",
      },
      {
        id: "B",
        text: "Zwischen 50.000 und 56.000 €.",
        reply: "50.000, das nehme ich mal so mit.",
        you: "worried",
        other: "happy",
        brain:
          "Sie hat nur „50.000“ gehört. Den Rest hätten wir uns sparen können.",
      },
      {
        id: "C",
        text: "Was zahlen Sie denn?",
        reply: "Wir liegen bei 46.000 bis 50.000 €, je nach Erfahrung.",
        you: "surprised",
        other: "neutral",
        brain: "Jetzt steht ihre Zahl im Raum. Nicht unsere.",
      },
    ],
  },
  {
    slug: "jahresgespraech",
    tab: "Gehaltserhöhung",
    who: "Herr Krüger, dein Chef",
    question:
      "Phoenix lief ja ganz ordentlich. So. Gibt es von Ihrer Seite noch etwas?",
    top: 240,
    answers: [
      {
        id: "A",
        text: "Ich bräuchte mehr Geld. Meine Miete ist gestiegen.",
        reply: "Das tut mir leid. Aber die Miete zahlt leider nicht die Firma.",
        you: "worried",
        other: "neutral",
        brain: "Er hat recht. Das ist das Schlimmste daran.",
      },
      {
        id: "B",
        text: "Ja: mein Gehalt. Phoenix war drei Wochen früher fertig. Wegen mir.",
        reply: "Hm. Das stimmt allerdings.",
        you: "happy",
        other: "surprised",
        brain: "Er hat genickt. Das war ein Nicken!",
      },
      {
        id: "C",
        text: "Nein, alles gut.",
        reply: "Schön. Dann wären wir ja durch.",
        you: "worried",
        other: "happy",
        brain: "Alles gut?! Nichts ist gut! Sag es. Jetzt!",
      },
    ],
  },
  {
    slug: "autoverkauf",
    tab: "Autoverkauf",
    who: "Alex, der Käufer",
    question:
      "Fährt sich gut. Aber die Reifen sind bald fällig. Ich gebe dir 5.800.",
    top: 270,
    answers: [
      {
        id: "A",
        text: "Ich dachte eher an 6.500.",
        reply: "Puh. Da liegen wir weit auseinander. Na gut: 6.200.",
        you: "happy",
        other: "worried",
        brain: "Von 5.800 auf 6.200. Mit einem einzigen Satz.",
      },
      {
        id: "B",
        text: "Wie kommst du auf 5.800?",
        reply:
          "Reifen, Ummelden, Versicherung. Das kostet alles. Sagen wir 6.000.",
        you: "neutral",
        other: "neutral",
        brain:
          "Er hat sich gerade selbst hochgehandelt. Wir haben nur gefragt.",
      },
      {
        id: "C",
        text: "Die Inspektion ist frisch gemacht.",
        reply: "Stimmt, das spart mir die Werkstatt. Dann 6.100.",
        you: "happy",
        other: "neutral",
        brain: "Ein Argument, 300 Euro. Das merken wir uns.",
      },
    ],
  },
];

// Wie lange eine Situation stehen bleibt, bevor die nächste kommt.
const ROTATE_SECONDS = 12;
// Der Wechsel selbst: ein oranger Streifen wischt über das Bild, in der Mitte wird getauscht.
const WIPE_MS = 700;

function Scene({
  slug,
  you,
  other,
  talking,
}: {
  slug: string;
  you: Mood;
  other: Mood;
  talking: boolean;
}) {
  if (slug === "jahresgespraech") {
    return (
      <OfficeScene
        place="office"
        stats={0}
        youMood={you}
        kruegerMood={other}
        kruegerTalking={talking}
        brain={false}
        brainTalking={false}
        bubble={null}
        phoneBuzz={false}
      />
    );
  }
  if (slug === "autoverkauf") {
    return (
      <ParkingScene
        youMood={you}
        alexMood={other}
        alexTalking={talking}
        alex
        car
        bubble={null}
        compare={false}
      />
    );
  }
  return (
    <CallScene
      youMood={you}
      brandtMood={other}
      brandtTalking={talking}
      bubble={null}
    />
  );
}

// 0 Frage, 1 deine Antwort, 2 Reaktion, 3 Gehirn und Knopf
type Step = 0 | 1 | 2 | 3;

export default function HeroDemo() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Answer | null>(null);
  const [step, setStep] = useState<Step>(0);
  // Sobald jemand selbst klickt, wechselt die Situation nicht mehr von allein.
  const [touched, setTouched] = useState(false);
  // Zählt die Wechsel (startet den Wisch-Streifen neu) und merkt, ob gerade gewechselt wird.
  const [wipe, setWipe] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const swap = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (swap.current) clearTimeout(swap.current);
    },
    [],
  );

  const demo = DEMOS[index];

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
    setTouched(true);
    setPicked(answer);
    setStep(1);
  }

  function reset() {
    setPicked(null);
    setStep(0);
  }

  function show(next: number, byUser: boolean) {
    if (byUser) setTouched(true);
    if (next === index || leaving) return;
    setLeaving(true);
    setWipe((n) => n + 1);
    swap.current = setTimeout(() => {
      setIndex(next);
      reset();
      setLeaving(false);
    }, WIPE_MS / 2);
  }

  const reacted = picked && step >= 2;
  const mine = step === 1 && picked;
  const bubble = mine ? picked.text : reacted ? picked.reply : demo.question;

  return (
    <section className="hero bg-navy text-white">
      {/* Die Szene über die ganze Breite */}
      <div className="relative overflow-clip bg-creme">
        <svg
          key={demo.slug}
          viewBox={`0 ${demo.top} 1600 ${900 - demo.top}`}
          preserveAspectRatio="xMidYMin slice"
          className="block aspect-video w-full md:aspect-auto md:h-[46vh] md:max-h-[520px] md:min-h-[340px]"
          aria-hidden="true"
        >
          <Scene
            slug={demo.slug}
            you={reacted ? picked.you : "worried"}
            other={reacted ? picked.other : "happy"}
            talking={step === 2}
          />
        </svg>
        <div className="absolute left-1/2 top-[9%] hidden w-[30%] min-w-[17rem] max-w-[26rem] -translate-x-1/2 md:block">
          <div
            key={`${demo.slug}-${picked?.id}-${step === 1}-${reacted}`}
            style={step === 0 ? { animationDelay: "0.45s" } : undefined}
            className={`pop-in px-5 py-4 shadow-paper ${
              mine
                ? "rounded-[20px] rounded-bl-[4px] bg-teal text-white"
                : "rounded-[20px] rounded-br-[4px] bg-white text-navy"
            }`}
          >
            <p
              className={`text-sm font-bold ${mine ? "text-white/80" : "text-tealdark"}`}
            >
              {mine ? "Du" : demo.who}
            </p>
            <p className="font-display text-xl font-bold leading-snug">
              „{bubble}“
            </p>
          </div>
        </div>
        {wipe > 0 && (
          <div
            key={wipe}
            className="hero-wipe"
            style={{ animationDuration: `${WIPE_MS}ms` }}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="mx-auto w-full max-w-[1120px] px-5 pb-14 pt-6">
        {/* Umschalter zwischen den drei Situationen. Der Balken zeigt, wann die nächste kommt. */}
        <div
          className="mb-6 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Situation wählen"
        >
          {DEMOS.map((item, i) => {
            const on = i === index;
            return (
              <button
                key={item.slug}
                onClick={() => show(i, true)}
                aria-pressed={on}
                className={`press relative overflow-clip rounded-full px-4 py-1.5 text-sm font-bold ${
                  on
                    ? "bg-white/20 text-white"
                    : "bg-white/[0.07] text-white/70 hover:bg-white/15 hover:text-white"
                }`}
              >
                {item.tab}
                {on && !touched && step === 0 && (
                  <span
                    onAnimationEnd={() => show((i + 1) % DEMOS.length, false)}
                    className="hero-timer absolute inset-x-0 bottom-0 h-[3px] origin-left bg-sun"
                    style={{ animationDuration: `${ROTATE_SECONDS}s` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div
          className={`transition-opacity duration-200 ${leaving ? "opacity-0" : "opacity-100"}`}
        >
          {/* Auf dem Handy steht die Sprechblase unter dem Bild */}
          <div className="mb-6 rounded-[20px] rounded-tl-[4px] bg-white px-5 py-4 text-navy md:hidden">
            <p className="text-sm font-bold text-tealdark">
              {mine ? "Du" : demo.who}
            </p>
            <p className="font-display text-lg font-bold leading-snug">
              „{bubble}“
            </p>
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
              <div key={demo.slug} className="mt-6 grid gap-3 md:grid-cols-3">
                {demo.answers.map((answer, i) => {
                  const chosen = picked?.id === answer.id;
                  return (
                    <button
                      key={answer.id}
                      onClick={() => pick(answer)}
                      disabled={!!picked}
                      style={{ animationDelay: `${0.15 + i * 0.09}s` }}
                      className={`rise-in press flex items-center gap-4 rounded-[18px] p-4 text-left md:flex-col md:items-start md:p-5 ${
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
                Das ist Generalprobe: kurze gezeichnete Situationen, die dreimal
                anhalten und auf deine Antwort warten. Üb den schwierigen
                Moment, bevor er echt ist.
              </p>
            </>
          )}

          {step === 3 && picked && (
            <div className="max-w-[46rem]">
              <div className="pop-in flex items-center gap-4">
                <span className="h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                  <svg
                    viewBox="30 130 240 240"
                    className="h-full w-full"
                    aria-hidden="true"
                  >
                    <Brain talking={false} />
                  </svg>
                </span>
                <div className="rounded-[20px] rounded-bl-[4px] bg-[#fde6ec] px-5 py-4 text-navy">
                  <p className="text-sm font-bold text-[#a8405c]">
                    Dein Gehirn
                  </p>
                  <p className="font-display text-[clamp(22px,2.6vw,31px)] font-bold leading-tight">
                    {picked.brain}
                  </p>
                </div>
              </div>
              <div className="pop-in mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 [animation-delay:0.3s]">
                <Link
                  href={`/s/${demo.slug}`}
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
      </div>
    </section>
  );
}
