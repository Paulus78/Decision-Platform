"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { C, Face, You, type Mood } from "./art";

// Zeichnungen für die Situation "Der Käufer ist da" (Autoverkauf). Bühne: 1600 x 900.

const SKY = "#dcebf2";
const ASPHALT = "#c9c4bb";

// Alex: kurze Haare, Dreitagebart, rote Jacke.
function Alex({ mood, talking }: { mood: Mood; talking: boolean }) {
  const skin = "#c98f6b";
  const hair = "#2b2230";
  return (
    <g>
      <g className="breathe">
        <path
          d="M-136 440 Q-138 124 -46 100 L46 100 Q138 124 136 440 Z"
          fill={C.coral}
        />
        <path d="M-34 100 L0 150 L34 100 Z" fill={C.white} />
        <path
          d="M-46 100 L0 170 L-18 440 L-60 440 Z"
          fill={C.coralDark}
          opacity="0.5"
        />
        <path
          d="M46 100 L0 170 L18 440 L60 440 Z"
          fill={C.coralDark}
          opacity="0.5"
        />
      </g>
      <rect x="-20" y="58" width="40" height="54" rx="14" fill="#b57b59" />
      <circle cx="-78" cy="6" r="14" fill={skin} />
      <circle cx="78" cy="6" r="14" fill={skin} />
      <ellipse cx="0" cy="0" rx="78" ry="84" fill={skin} />
      <path
        d="M-72 22 Q-62 86 0 88 Q62 86 72 22 Q42 64 0 64 Q-42 64 -72 22 Z"
        fill={hair}
        opacity="0.35"
      />
      <path
        d="M-84 -14 Q-92 -96 0 -98 Q92 -96 84 -14 Q70 -62 0 -64 Q-70 -62 -84 -14 Z"
        fill={hair}
      />
      <Face mood={mood} talking={talking} />
    </g>
  );
}

function Wheel({ x, spin }: { x: number; spin: boolean }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <g className={spin ? "spin" : undefined}>
        <circle r="46" fill={C.navyDark} />
        <circle r="24" fill="#c5cbd8" />
        {[0, 60, 120].map((angle) => (
          <rect
            key={angle}
            x="-3"
            y="-24"
            width="6"
            height="48"
            fill={C.navyDark}
            transform={`rotate(${angle})`}
          />
        ))}
        <circle r="7" fill={C.navyDark} />
      </g>
    </g>
  );
}

// Dein Auto von der Seite. Mitte unten = (0, 0) auf Höhe der Radachsen.
function Car({ spin, people }: { spin: boolean; people?: boolean }) {
  return (
    <g>
      <ellipse cx="0" cy="48" rx="250" ry="16" fill="#00000022" />
      <g className={spin ? "bounce" : undefined}>
        <path
          d="M-250 -10 Q-254 -74 -196 -84 L-130 -92 Q-90 -168 -20 -172 L70 -172 Q130 -168 170 -98 L226 -84 Q256 -76 254 -30 L254 0 L-250 0 Z"
          fill={C.teal}
        />
        <path
          d="M-112 -96 Q-80 -150 -22 -152 L16 -152 L16 -96 Z"
          fill="#bfe3f2"
        />
        <path
          d="M34 -152 L66 -152 Q112 -148 144 -96 L34 -96 Z"
          fill="#bfe3f2"
        />
        {people && (
          <g>
            <circle cx="-34" cy="-118" r="22" fill="#f1c6a0" />
            <path
              d="M-56 -122 Q-54 -146 -34 -144 Q-14 -146 -12 -122 Q-30 -134 -56 -122 Z"
              fill="#4a3328"
            />
            <circle cx="78" cy="-118" r="22" fill="#c98f6b" />
            <path
              d="M56 -124 Q58 -144 78 -142 Q98 -144 100 -124 Q80 -134 56 -124 Z"
              fill="#2b2230"
            />
          </g>
        )}
        <rect x="-250" y="-22" width="504" height="14" fill={C.tealDark} />
        <rect x="226" y="-70" width="26" height="20" rx="6" fill="#ffe9a8" />
        <rect x="-252" y="-66" width="18" height="20" rx="6" fill={C.coral} />
        <rect x="-10" y="-64" width="30" height="8" rx="4" fill={C.tealDark} />
      </g>
      <Wheel x={-150} spin={spin} />
      <Wheel x={150} spin={spin} />
    </g>
  );
}

function Skyline() {
  return (
    <g fill="#c3d6de">
      <rect x="120" y="330" width="130" height="230" />
      <rect x="260" y="270" width="90" height="290" />
      <rect x="1040" y="300" width="150" height="260" />
      <rect x="1200" y="360" width="110" height="200" />
      <rect x="1320" y="250" width="100" height="310" />
    </g>
  );
}

// Deine Antwort als Sprechblase über deinem Kopf.
function Bubble({ text }: { text: string }) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      scale: 0,
      opacity: 0,
      svgOrigin: "330 272",
      duration: 0.4,
      ease: "back.out(2)",
    });
  });
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines[lines.length - 1];
    if (last !== undefined && (last + " " + word).length <= 22)
      lines[lines.length - 1] = last + " " + word;
    else lines.push(word);
  }
  const height = 50 + lines.length * 46;
  return (
    <g ref={ref}>
      <rect
        x="110"
        y={228 - height}
        width="500"
        height={height}
        rx="34"
        fill={C.navy}
      />
      <path d="M300 224 L330 272 L360 224 Z" fill={C.navy} />
      {lines.map((line, i) => (
        <text
          key={i}
          x="360"
          y={228 - height + 62 + i * 46}
          textAnchor="middle"
          fontSize="38"
          fontWeight="800"
          fill={C.white}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Row({
  y,
  title,
  km,
  price,
  mine,
}: {
  y: number;
  title: string;
  km: string;
  price: string;
  mine: boolean;
}) {
  return (
    <g>
      <rect
        x="560"
        y={y}
        width="480"
        height="120"
        rx="20"
        fill={mine ? "#cfeee8" : "#f3f5f9"}
      />
      <g transform={`translate(650 ${y + 88}) scale(0.26)`}>
        <Car spin={false} />
      </g>
      <text x="740" y={y + 42} fontSize="26" fontWeight="800" fill={C.navyDark}>
        {title}
      </text>
      <text
        x="740"
        y={y + 78}
        fontSize="30"
        fontWeight="900"
        fill={mine ? C.teal : C.coral}
      >
        {km}
      </text>
      <text
        x="1020"
        y={y + 44}
        textAnchor="end"
        fontSize="30"
        fontWeight="900"
        fill={C.navyDark}
      >
        {price}
      </text>
    </g>
  );
}

// Alex hält sein Handy hoch: das Vergleichsinserat.
function Compare() {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      scale: 0,
      svgOrigin: "800 330",
      duration: 0.5,
      ease: "back.out(1.7)",
    });
  });
  return (
    <g ref={ref}>
      <rect x="548" y="166" width="520" height="340" rx="36" fill="#00000030" />
      <rect
        x="536"
        y="154"
        width="520"
        height="340"
        rx="36"
        fill={C.navyDark}
      />
      <rect x="548" y="166" width="496" height="316" rx="26" fill={C.white} />
      <text
        x="800"
        y="208"
        textAnchor="middle"
        fontSize="24"
        fontWeight="800"
        fill={C.navy}
        opacity="0.6"
      >
        GLEICHES BAUJAHR
      </text>
      <Row y={224} title="Dein Auto" km="115.000 km" price="6.800 €" mine />
      <Row
        y={352}
        title="Das andere"
        km="155.000 km"
        price="6.200 €"
        mine={false}
      />
    </g>
  );
}

// Der Parkplatz: du links, Alex rechts, dazwischen dein Auto.
export function ParkingScene({
  youMood,
  alexMood,
  alexTalking,
  alex,
  car,
  bubble,
  compare,
}: {
  youMood: Mood;
  alexMood: Mood;
  alexTalking: boolean;
  alex: boolean;
  car: boolean;
  bubble: string | null;
  compare: boolean;
}) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(
    () => {
      gsap.from(".car", { x: -1100, duration: 0.9, ease: "power3.out" });
    },
    { scope: ref },
  );
  return (
    <g ref={ref}>
      <rect width="1600" height="900" fill={SKY} />
      <circle cx="1380" cy="150" r="70" fill="#ffd66b" />
      <Skyline />
      <rect y="560" width="1600" height="340" fill={ASPHALT} />
      {[300, 620, 980, 1300].map((x) => (
        <path
          key={x}
          d={`M${x} 560 L${x - 90} 900`}
          stroke={C.white}
          strokeWidth="8"
          opacity="0.7"
        />
      ))}

      {car && (
        <g className="car">
          <g transform="translate(800 720) scale(1.05)">
            <Car spin={false} />
          </g>
          <g transform="translate(800 470) rotate(-4)">
            <rect
              x="-120"
              y="-44"
              width="240"
              height="88"
              rx="14"
              fill={C.white}
              stroke={C.navy}
              strokeWidth="5"
            />
            <text
              x="0"
              y="-8"
              textAnchor="middle"
              fontSize="20"
              fontWeight="800"
              fill={C.navy}
              opacity="0.6"
            >
              ZU VERKAUFEN
            </text>
            <text
              x="0"
              y="28"
              textAnchor="middle"
              fontSize="36"
              fontWeight="900"
              fill={C.navyDark}
            >
              6.800 € VB
            </text>
          </g>
        </g>
      )}

      <g transform="translate(330 470) scale(1.2)">
        <You pose="sit" mood={youMood} long />
      </g>
      {alex && <AlexArrives mood={alexMood} talking={alexTalking} />}

      {compare && <Compare />}
      {bubble && <Bubble key={bubble} text={bubble} />}
    </g>
  );
}

function AlexArrives({ mood, talking }: { mood: Mood; talking: boolean }) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { x: 600, duration: 0.7, ease: "back.out(1.1)" });
  });
  return (
    <g ref={ref}>
      <g transform="translate(1270 470) scale(1.2)">
        <Alex mood={mood} talking={talking} />
      </g>
    </g>
  );
}

// Die Probefahrt: Auto steht mittig, die Landschaft zieht vorbei.
export function DriveScene() {
  return (
    <g>
      <rect width="1600" height="900" fill={SKY} />
      <circle cx="1300" cy="160" r="70" fill="#ffd66b" />
      <g className="scroll-slow">
        {[0, 1600].map((offset) => (
          <g key={offset} transform={`translate(${offset} 0)`}>
            <path
              d="M0 620 Q300 420 600 620 Q900 460 1200 620 Q1400 520 1600 620 L1600 700 L0 700 Z"
              fill="#b9d8c6"
            />
            <ellipse cx="300" cy="200" rx="110" ry="36" fill={C.white} />
            <ellipse cx="980" cy="130" rx="90" ry="30" fill={C.white} />
          </g>
        ))}
      </g>
      <g className="scroll-fast">
        {[0, 1600].map((offset) => (
          <g key={offset} transform={`translate(${offset} 0)`}>
            {[200, 700, 1250].map((x) => (
              <g key={x}>
                <rect
                  x={x - 8}
                  y="540"
                  width="16"
                  height="110"
                  fill={C.woodDark}
                />
                <path
                  d={`M${x - 70} 560 L${x} 400 L${x + 70} 560 Z`}
                  fill={C.tealDark}
                />
              </g>
            ))}
          </g>
        ))}
      </g>
      <rect y="650" width="1600" height="250" fill="#5b6377" />
      <g className="scroll-fast">
        {[0, 1600].map((offset) => (
          <g key={offset} transform={`translate(${offset} 0)`}>
            {[0, 400, 800, 1200].map((x) => (
              <rect
                key={x}
                x={x + 60}
                y="800"
                width="200"
                height="14"
                rx="7"
                fill={C.white}
                opacity="0.8"
              />
            ))}
          </g>
        ))}
      </g>
      <g transform="translate(800 720) scale(1.45)">
        <Car spin people />
      </g>
      {/* Das Radio läuft */}
      <g className="breathe" fill={C.navy}>
        <path
          d="M900 380 L900 300 L960 286 L960 366"
          stroke={C.navy}
          strokeWidth="8"
          fill="none"
        />
        <ellipse cx="884" cy="382" rx="20" ry="14" />
        <ellipse cx="944" cy="368" rx="20" ry="14" />
      </g>
    </g>
  );
}

export function LisaFace() {
  return (
    <svg viewBox="-100 -100 200 200" className="h-full w-full">
      <circle r="100" fill="#8b6fc0" />
      <path d="M-70 60 Q-80 -70 0 -74 Q80 -70 70 60 Z" fill="#3b2a22" />
      <ellipse cx="0" cy="8" rx="56" ry="62" fill="#e3ad85" />
      <path
        d="M-58 -6 Q-50 -62 0 -62 Q50 -62 58 -6 Q30 -38 -58 -6 Z"
        fill="#3b2a22"
      />
      <circle cx="-22" cy="6" r="7" fill={C.ink} />
      <circle cx="22" cy="6" r="7" fill={C.ink} />
      <path
        d="M-16 36 Q0 46 16 36"
        stroke={C.mouth}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Kleine Bilder für die drei Erklär-Karten.
export function AutoIcon({ kind }: { kind: number }) {
  if (kind === 0) {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#dcebf2" />
        <g
          fill="none"
          stroke={C.navy}
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="100" cy="46" r="15" />
          <path d="M100 62 L100 156" />
          <path d="M70 86 L130 86" />
          <path d="M44 114 Q48 158 100 158 Q152 158 156 114" />
        </g>
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#cfeee8" />
        <path
          d="M100 44 L100 150 M60 150 L140 150"
          stroke={C.navy}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d="M44 70 L156 58"
          stroke={C.navy}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path d="M24 108 L44 70 L64 108 Z" fill={C.teal} />
        <path d="M136 96 L156 58 L176 96 Z" fill={C.coral} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <circle cx="100" cy="100" r="96" fill="#fde2b5" />
      <rect x="94" y="48" width="12" height="112" rx="6" fill={C.navy} />
      <path d="M106 56 H160 L176 74 L160 92 H106 Z" fill={C.teal} />
      <path d="M94 98 H40 L24 116 L40 134 H94 Z" fill={C.coral} />
      <text
        x="134"
        y="82"
        textAnchor="middle"
        fontSize="20"
        fontWeight="900"
        fill={C.white}
      >
        JETZT
      </text>
      <text
        x="62"
        y="124"
        textAnchor="middle"
        fontSize="18"
        fontWeight="900"
        fill={C.white}
      >
        MORGEN?
      </text>
    </svg>
  );
}
