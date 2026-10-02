"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { C, Face, You, type Mood } from "./art";

// Zeichnungen für die Situation "Das erste Date". Bühne: 1600 x 900.

const VIOLET = "#8b6fc0";
const VIOLET_DARK = "#6f55a3";

// Lena: lange kupferfarbene Haare, Ohrringe, violettes Oberteil.
function Lena({ mood, talking }: { mood: Mood; talking: boolean }) {
  const skin = "#f3c9a6";
  const hair = "#a8672e";
  return (
    <g>
      <path d="M-98 -10 Q-112 -112 0 -114 Q112 -112 98 -10 L108 130 Q60 160 0 126 Q-60 160 -108 130 Z" fill={hair} />
      <g className="breathe">
        <path d="M-134 440 Q-136 124 -46 100 L46 100 Q136 124 134 440 Z" fill={VIOLET} />
        <path d="M-46 100 Q0 150 46 100 Z" fill={skin} />
        <path d="M-46 100 Q0 150 46 100" stroke={VIOLET_DARK} strokeWidth="6" fill="none" />
      </g>
      <rect x="-20" y="58" width="40" height="54" rx="14" fill="#e2b48e" />
      <circle cx="-78" cy="6" r="14" fill={skin} />
      <circle cx="78" cy="6" r="14" fill={skin} />
      <circle cx="-80" cy="30" r="8" fill="#f2c14e" />
      <circle cx="80" cy="30" r="8" fill="#f2c14e" />
      <ellipse cx="0" cy="0" rx="78" ry="84" fill={skin} />
      <path d="M-86 -4 Q-94 -98 0 -100 Q94 -98 86 -4 Q64 -60 12 -62 Q-44 -58 -86 -4 Z" fill={hair} />
      <Face mood={mood} talking={talking} />
    </g>
  );
}

// Dein Gehirn: klein, rosa, dauerhaft in Panik.
function Brain({ talking }: { talking: boolean }) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      scale: 0,
      svgOrigin: "300 320",
      duration: 0.5,
      ease: "back.out(2)",
    });
  });
  const pink = "#f4a6b8";
  const dark = "#de7f97";
  return (
    <g ref={ref}>
      <circle cx="318" cy="336" r="9" fill={C.white} />
      <circle cx="284" cy="312" r="14" fill={C.white} />
      <g transform="translate(150 250)">
        <circle r="120" fill={C.white} />
        <g className={talking ? "ring" : "breathe"}>
          <path d="M-74 10 L-104 -32" stroke={dark} strokeWidth="9" strokeLinecap="round" />
          <path d="M74 10 L104 -32" stroke={dark} strokeWidth="9" strokeLinecap="round" />
          <circle cx="-106" cy="-36" r="9" fill={pink} />
          <circle cx="106" cy="-36" r="9" fill={pink} />
          <ellipse cx="0" cy="4" rx="78" ry="56" fill={pink} />
          <ellipse cx="-40" cy="-22" rx="40" ry="34" fill={pink} />
          <ellipse cx="38" cy="-26" rx="44" ry="34" fill={pink} />
          <ellipse cx="-52" cy="22" rx="34" ry="30" fill={pink} />
          <ellipse cx="54" cy="20" rx="34" ry="30" fill={pink} />
          <g fill="none" stroke={dark} strokeWidth="6" strokeLinecap="round">
            <path d="M0 -54 Q-10 -34 2 -26" />
            <path d="M-56 -34 Q-40 -22 -58 -6" />
            <path d="M52 -40 Q40 -24 60 -10" />
            <path d="M-30 46 Q-14 38 -4 52" />
          </g>
          <path d="M-38 -16 L-14 -24" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
          <path d="M38 -16 L14 -24" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
          <circle cx="-24" cy="0" r="15" fill={C.white} />
          <circle cx="24" cy="0" r="15" fill={C.white} />
          <circle cx="-22" cy="2" r="6" fill={C.ink} />
          <circle cx="26" cy="2" r="6" fill={C.ink} />
          {talking ? (
            <ellipse className="talk" cx="0" cy="30" rx="12" ry="10" fill={C.mouth} />
          ) : (
            <path d="M-14 30 Q-7 24 0 30 Q7 36 14 30" stroke={C.mouth} strokeWidth="5" fill="none" strokeLinecap="round" />
          )}
          <path d="M66 -62 Q58 -46 66 -40 Q74 -46 66 -62 Z" fill="#7fc8e8" />
        </g>
      </g>
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
      svgOrigin: "470 262",
      duration: 0.4,
      ease: "back.out(2)",
    });
  });
  // Lange Antworten auf mehrere Zeilen verteilen.
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines[lines.length - 1];
    if (last !== undefined && (last + " " + word).length <= 22) lines[lines.length - 1] = last + " " + word;
    else lines.push(word);
  }
  const height = 50 + lines.length * 46;
  return (
    <g ref={ref}>
      <rect x="270" y={218 - height} width="500" height={height} rx="34" fill={C.teal} />
      <path d="M440 214 L470 262 L500 214 Z" fill={C.teal} />
      {lines.map((line, i) => (
        <text
          key={i}
          x="520"
          y={218 - height + 62 + i * 46}
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

function Lamp({ x }: { x: number }) {
  return (
    <g>
      <circle cx={x} cy="150" r="170" fill={C.orange} opacity="0.13" />
      <rect x={x - 3} y="0" width="6" height="96" fill="#1c1838" />
      <path d={`M${x - 56} 150 L${x + 56} 150 L${x + 30} 92 L${x - 30} 92 Z`} fill={C.orange} />
    </g>
  );
}

function BarBackground() {
  const bottles = ["#ef6f5e", "#2f9e8f", "#f2c14e", "#8b6fc0", "#3fbf7f", "#ef6f5e", "#f2a33a", "#2f9e8f"];
  return (
    <g>
      <rect width="1600" height="900" fill="#3b3560" />
      <rect x="590" y="170" width="420" height="16" rx="6" fill="#231f42" />
      <rect x="590" y="300" width="420" height="16" rx="6" fill="#231f42" />
      {bottles.map((color, i) => (
        <g key={i}>
          <rect x={612 + i * 48} y={i % 2 ? 226 : 214} width="26" height={i % 2 ? 74 : 86} rx="8" fill={color} />
          <rect x={620 + i * 48} y={i % 2 ? 206 : 194} width="10" height="24" rx="4" fill={color} />
        </g>
      ))}
      <Lamp x={250} />
      <Lamp x={800} />
      <Lamp x={1350} />
    </g>
  );
}

function StreetBackground() {
  return (
    <g>
      <rect width="1600" height="900" fill="#4a4168" />
      {[120, 340, 1100, 1320].map((x) => (
        <rect key={x} x={x} y="150" width="150" height="190" rx="10" fill="#f2c14e" opacity="0.55" />
      ))}
      <rect x="640" y="250" width="320" height="520" rx="14" fill="#2a2548" />
      <rect x="676" y="300" width="248" height="230" rx="10" fill="#f2c14e" opacity="0.8" />
      <path d="M600 250 L1000 250 L960 190 L640 190 Z" fill={C.coral} />
      <rect x="1010" y="40" width="200" height="76" rx="16" fill="#2a2548" stroke={C.coral} strokeWidth="6" />
      <text x="1110" y="96" textAnchor="middle" fontSize="54" fontWeight="900" fill={C.coral} letterSpacing="6">
        BAR
      </text>
      <rect y="770" width="1600" height="130" fill="#2c2a45" />
    </g>
  );
}

function Table({ phoneBuzz, menu }: { phoneBuzz: boolean; menu: boolean }) {
  return (
    <g>
      <rect y="730" width="1600" height="170" fill={C.wood} />
      <rect y="730" width="1600" height="20" fill="#cda070" />
      {/* Gläser */}
      <path d="M610 640 L690 640 L676 738 L624 738 Z" fill="#ffffff" opacity="0.35" />
      <path d="M616 676 L684 676 L676 738 L624 738 Z" fill={C.orange} opacity="0.85" />
      <path d="M950 640 L1030 640 L1016 738 L964 738 Z" fill="#ffffff" opacity="0.35" />
      <path d="M956 664 L1024 664 L1016 738 L964 738 Z" fill={C.coral} opacity="0.85" />
      {/* Kerze */}
      <rect x="786" y="690" width="28" height="48" rx="6" fill={C.white} />
      <path d="M800 652 Q786 676 800 690 Q814 676 800 652 Z" fill="#f2c14e" />
      {menu && (
        <g>
          <path d="M300 738 L340 612 L420 612 L380 738 Z" fill={C.white} />
          <text x="360" y="672" textAnchor="middle" fontSize="20" fontWeight="800" fill={C.navy} transform="rotate(-17 360 672)">
            KARTE
          </text>
        </g>
      )}
      {/* Handy auf dem Tisch */}
      <g transform="translate(540 742)">
        <g className={phoneBuzz ? "ring" : undefined}>
          {phoneBuzz && (
            <g fill="none" stroke={C.coral} strokeWidth="7" strokeLinecap="round">
              <path d="M-66 -22 Q-80 0 -66 22" />
              <path d="M66 -22 Q80 0 66 22" />
            </g>
          )}
          <rect x="-50" y="-16" width="100" height="32" rx="8" fill={C.navyDark} />
          {phoneBuzz && <rect x="-42" y="-10" width="84" height="20" rx="4" fill="#bfe3f2" />}
        </g>
      </g>
    </g>
  );
}

function LenaEnters({ mood, talking }: { mood: Mood; talking: boolean }) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { x: 700, duration: 0.7, ease: "back.out(1.1)" });
  });
  return (
    <g ref={ref}>
      <g transform="translate(1130 430) scale(1.3)">
        <Lena mood={mood} talking={talking} />
      </g>
    </g>
  );
}

// Die Bar (mit Tisch) oder die Straße davor.
export function DateScene({
  place,
  lena,
  youMood,
  lenaMood,
  lenaTalking,
  brain,
  brainTalking,
  bubble,
  phoneBuzz,
}: {
  place: "bar" | "street";
  lena: boolean;
  youMood: Mood;
  lenaMood: Mood;
  lenaTalking: boolean;
  brain: boolean;
  brainTalking: boolean;
  bubble: string | null;
  phoneBuzz: boolean;
}) {
  return (
    <g>
      {place === "bar" ? <BarBackground /> : <StreetBackground />}
      <g transform="translate(470 430) scale(1.3)">
        <You pose="sit" mood={youMood} long />
      </g>
      {lena && <LenaEnters key={place} mood={lenaMood} talking={lenaTalking} />}
      {place === "bar" && <Table phoneBuzz={phoneBuzz} menu={!lena} />}
      {brain && <Brain talking={brainTalking} />}
      {bubble && <Bubble key={bubble} text={bubble} />}
    </g>
  );
}

// Kleine Bilder für die drei Erklär-Karten.
export function DateIcon({ kind }: { kind: number }) {
  if (kind === 0) {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#cfeee8" />
        <path d="M44 56 H156 Q170 56 170 70 V122 Q170 136 156 136 H104 L76 162 V136 H44 Q30 136 30 122 V70 Q30 56 44 56 Z" fill={C.teal} />
        <text x="100" y="122" textAnchor="middle" fontSize="76" fontWeight="900" fill={C.white}>
          ?
        </text>
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#fde2b5" />
        <rect x="68" y="40" width="64" height="120" rx="14" fill={C.navyDark} />
        <rect x="76" y="52" width="48" height="88" rx="6" fill="#7a8399" />
        <path d="M44 44 L156 156" stroke={C.coral} strokeWidth="14" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <circle cx="100" cy="100" r="96" fill="#fbd5dc" />
      <path d="M100 158 Q36 112 40 74 Q44 44 72 46 Q90 48 100 66 Q110 48 128 46 Q156 44 160 74 Q164 112 100 158 Z" fill={C.coral} />
      <path d="M78 96 L94 112 L124 78" stroke={C.white} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
