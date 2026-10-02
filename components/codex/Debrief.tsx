"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import story from "@/stories/codex-autoverkauf.json";
import { Car } from "./Art";
import type { Choice } from "./game";
import styles from "./film.module.css";

const lessons = [
  {
    title: "Eine Zahl bleibt hängen.",
    label: "DEN EIGENEN RAHMEN BEHALTEN",
    example: "Ich dachte eher an 6.500.",
    tip: "Lege deinen Wunschpreis und deine Grenze vor dem Gespräch fest.",
    source: "Studie · Galinsky & Mussweiler, 2001",
  },
  {
    title: "Ähnlich ist nicht gleich.",
    label: "DAS GANZE AUTO VERGLEICHEN",
    example: "Lass uns die Autos genauer vergleichen.",
    tip: "Kilometer, Service und Reifen zusammen betrachten. Ein Inserat ist kein Verkaufspreis.",
    source: "Buchwissen · Getting to Yes",
  },
  {
    title: "Vielleicht ist kein Käufer.",
    label: "DEN PLAN B EHRLICH PRÜFEN",
    example: "Ich kläre erst, ob der andere Termin steht.",
    tip: "Ein schneller Verkauf hat einen Wert. Warten bietet eine Chance – und kostet Zeit.",
    source: "Buchwissen · Getting to Yes",
  },
];

function LessonPicture({ step }: { step: number }) {
  return (
    <svg
      viewBox="0 0 640 290"
      role="img"
      aria-label={
        step === 0
          ? "Dein Wunschpreis 6.500 Euro gegenüber Alex’ Angebot 5.800 Euro"
          : step === 1
            ? "Vergleich: 115.000 gegen 155.000 Kilometer; Service und Reifen beachten"
            : "Alex ist hier. Die andere Interessentin hat noch keinen Termin bestätigt."
      }
    >
      {step === 0 ? (
        <>
          <path
            d="M75 212 H565"
            stroke="#45616c"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <g data-lesson-item="">
            <circle cx="175" cy="212" r="9" fill="#ef9877" />
            <rect
              x="59"
              y="63"
              width="232"
              height="111"
              rx="20"
              fill="#f3a88c"
            />
            <path d="M162 174 L175 194 L188 174" fill="#f3a88c" />
            <text
              x="175"
              y="93"
              textAnchor="middle"
              fontSize="14"
              fill="#663d37"
            >
              ALEX’ ANGEBOT
            </text>
            <text
              x="175"
              y="143"
              textAnchor="middle"
              fontSize="40"
              fontWeight="800"
              fill="#273c4c"
            >
              5.800 €
            </text>
          </g>
          <g data-lesson-item="">
            <circle cx="468" cy="212" r="9" fill="#eac96c" />
            <rect
              x="352"
              y="34"
              width="232"
              height="111"
              rx="20"
              fill="#f6d782"
            />
            <path d="M455 145 L468 165 L481 145" fill="#f6d782" />
            <text
              x="468"
              y="64"
              textAnchor="middle"
              fontSize="14"
              fill="#6b5931"
            >
              DEIN WUNSCH
            </text>
            <text
              x="468"
              y="114"
              textAnchor="middle"
              fontSize="40"
              fontWeight="800"
              fill="#273c4c"
            >
              6.500 €
            </text>
          </g>
          <text
            x="320"
            y="265"
            textAnchor="middle"
            fontSize="19"
            fill="#d4e3dc"
          >
            Deine Anzeige hatte schon 6.800 € gesetzt.
          </text>
        </>
      ) : step === 1 ? (
        <>
          {[0, 1].map((i) => (
            <g
              key={i}
              data-lesson-item=""
              transform={`translate(${i * 328 + 12} 12)`}
            >
              <rect
                width="292"
                height="258"
                rx="20"
                fill={i ? "#e1e6dd" : "#f6d782"}
              />
              <text
                x="146"
                y="34"
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                fill="#273c4c"
              >
                {i ? "DIE ANDERE ANZEIGE" : "DEIN AUTO"}
              </text>
              <g stroke="#28394b" strokeWidth="3">
                <Car x={34} y={85} scale={0.44} />
              </g>
              <text
                x="146"
                y="187"
                textAnchor="middle"
                fontSize="29"
                fontWeight="800"
                fill="#273c4c"
              >
                {i ? "155.000 km" : "115.000 km"}
              </text>
              <text
                x="146"
                y="219"
                textAnchor="middle"
                fontSize="17"
                fill="#3c5760"
              >
                {i ? "Service unklar" : "Service neu · Reifen fällig"}
              </text>
            </g>
          ))}
        </>
      ) : (
        <>
          <g data-lesson-item="">
            <rect
              x="25"
              y="28"
              width="271"
              height="221"
              rx="22"
              fill="#f6d782"
            />
            <circle cx="160" cy="90" r="31" fill="#273c4c" />
            <path
              d="M145 90 L156 102 L178 78"
              stroke="#f6d782"
              strokeWidth="6"
              fill="none"
            />
            <text
              x="160"
              y="155"
              textAnchor="middle"
              fontSize="25"
              fontWeight="800"
              fill="#273c4c"
            >
              Alex ist hier.
            </text>
            <text
              x="160"
              y="193"
              textAnchor="middle"
              fontSize="18"
              fill="#3c5760"
            >
              Ein konkretes Angebot
            </text>
          </g>
          <g data-lesson-item="">
            <rect
              x="345"
              y="28"
              width="271"
              height="221"
              rx="22"
              fill="#e1e6dd"
            />
            <text
              x="480"
              y="113"
              textAnchor="middle"
              fontSize="62"
              fill="#78918d"
            >
              ?
            </text>
            <text
              x="480"
              y="155"
              textAnchor="middle"
              fontSize="25"
              fontWeight="800"
              fill="#273c4c"
            >
              „Vielleicht morgen“
            </text>
            <text
              x="480"
              y="193"
              textAnchor="middle"
              fontSize="18"
              fill="#3c5760"
            >
              Noch kein Termin
            </text>
          </g>
        </>
      )}
    </svg>
  );
}

export default function Debrief({
  step,
  answers,
  caption,
  playing,
}: {
  step: number;
  answers: Choice[];
  caption: string;
  playing: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const lesson = lessons[step];
  const own = story.decisions[step].options[answers[step]];
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ paused: !playing });
      animation.current = tl;
      tl.from("[data-lesson-item]", {
        opacity: 0,
        y: 22,
        duration: 0.55,
        stagger: 0.22,
        ease: "power2.out",
      })
        .from("[data-own-answer]", { opacity: 0, x: -18, duration: 0.45 }, 0.35)
        .from("[data-next-time]", { opacity: 0, x: 18, duration: 0.45 }, 1.15);
    },
    { scope: root, dependencies: [step], revertOnUpdate: true },
  );
  useEffect(() => {
    if (playing) animation.current?.resume();
    else animation.current?.pause();
  }, [playing]);
  return (
    <div className={styles.debrief} ref={root}>
      <div className={styles.lessonTop}>
        <span>DEIN VERLAUF IM RÜCKSPIEGEL</span>
        <div aria-label={`Tipp ${step + 1} von 3`}>
          {lessons.map((_, i) => (
            <b key={i} data-active={i === step}>
              {i + 1}
            </b>
          ))}
        </div>
      </div>
      <div className={styles.lessonBody}>
        <div className={styles.lessonVisual}>
          <span>{lesson.label}</span>
          <h2>{lesson.title}</h2>
          <LessonPicture step={step} />
          <small>{lesson.source}</small>
        </div>
        <div className={styles.lessonFeedback}>
          <div data-own-answer="">
            <span>DU HAST GESAGT</span>
            <blockquote>„{own.label}“</blockquote>
            <p>{own.note}</p>
          </div>
          <div data-next-time="">
            <span>
              {own.label === lesson.example
                ? "ZUM MITNEHMEN"
                : "DAS KÖNNTEST DU PROBIEREN"}
            </span>
            <blockquote>
              {own.label === lesson.example
                ? lesson.tip
                : `„${lesson.example}“`}
            </blockquote>
            {own.label !== lesson.example && <p>{lesson.tip}</p>}
          </div>
        </div>
      </div>
      <p className={styles.lessonCaption} aria-live="off">
        {caption}
      </p>
    </div>
  );
}
