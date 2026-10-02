"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { C, Face, You, type Mood } from "./art";
import { Brain } from "./date-art";

// Zeichnungen für die Situation "Das Jahresgespräch". Bühne: 1600 x 900.

const WALL = "#e6ecf3";

// Herr Krüger: graue Haare, Schnurrbart, Brille, Anzug mit Krawatte.
function Krueger({ mood, talking }: { mood: Mood; talking: boolean }) {
  const skin = "#edc3a2";
  const hair = "#a9aeb8";
  return (
    <g>
      <g className="breathe">
        <path d="M-140 440 Q-142 124 -46 100 L46 100 Q142 124 140 440 Z" fill={C.navy} />
        <path d="M-34 100 L34 100 L0 176 Z" fill={C.white} />
        <path d="M-10 118 L10 118 L16 200 L0 222 L-16 200 Z" fill={C.coral} />
        <path d="M-46 100 L0 176 L-24 214 L-72 118 Z" fill={C.navyDark} />
        <path d="M46 100 L0 176 L24 214 L72 118 Z" fill={C.navyDark} />
      </g>
      <rect x="-20" y="58" width="40" height="54" rx="14" fill="#d9a988" />
      <circle cx="-78" cy="6" r="14" fill={skin} />
      <circle cx="78" cy="6" r="14" fill={skin} />
      <ellipse cx="0" cy="0" rx="78" ry="84" fill={skin} />
      {/* Haarkranz */}
      <path d="M-84 6 Q-98 -60 -52 -74 Q-70 -30 -66 10 Z" fill={hair} />
      <path d="M84 6 Q98 -60 52 -74 Q70 -30 66 10 Z" fill={hair} />
      <Face mood={mood} talking={talking} glasses />
      {/* Schnurrbart */}
      <path d="M-30 30 Q-14 18 0 28 Q14 18 30 30 Q14 36 0 32 Q-14 36 -30 30 Z" fill={hair} />
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
    if (last !== undefined && (last + " " + word).length <= 24) lines[lines.length - 1] = last + " " + word;
    else lines.push(word);
  }
  const height = 46 + lines.length * 44;
  return (
    <g ref={ref}>
      <rect x="250" y={218 - height} width="540" height={height} rx="34" fill={C.teal} />
      <path d="M440 214 L470 262 L500 214 Z" fill={C.teal} />
      {lines.map((line, i) => (
        <text
          key={i}
          x="520"
          y={218 - height + 58 + i * 44}
          textAnchor="middle"
          fontSize="36"
          fontWeight="800"
          fill={C.white}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Stat({ x, value, label, color }: { x: number; value: string; label: string; color: string }) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      scale: 0,
      opacity: 0,
      svgOrigin: `${x + 170} 250`,
      duration: 0.45,
      ease: "back.out(1.8)",
    });
  });
  return (
    <g ref={ref}>
      <rect x={x} y="170" width="340" height="160" rx="30" fill={C.white} />
      <text x={x + 170} y="262" textAnchor="middle" fontSize="84" fontWeight="900" fill={color}>
        {value}
      </text>
      <text x={x + 170} y="304" textAnchor="middle" fontSize="28" fontWeight="700" fill={C.navy} opacity="0.7">
        {label}
      </text>
    </g>
  );
}

// Der Flur vor Krügers Büro: letzte Sekunden vor dem Gespräch.
function Hall({ stats }: { stats: number }) {
  return (
    <g>
      <rect width="1600" height="900" fill={WALL} />
      <rect y="760" width="1600" height="140" fill="#c9c4bb" />
      {/* Tür */}
      <rect x="1040" y="170" width="340" height="590" rx="10" fill={C.wood} />
      <rect x="1060" y="190" width="300" height="550" rx="6" fill="#cda070" />
      <circle cx="1090" cy="480" r="16" fill={C.navyDark} />
      <rect x="1110" y="250" width="200" height="70" rx="10" fill={C.white} />
      <text x="1210" y="282" textAnchor="middle" fontSize="26" fontWeight="900" fill={C.navyDark}>
        H. Krüger
      </text>
      <text x="1210" y="308" textAnchor="middle" fontSize="18" fontWeight="700" fill={C.navy} opacity="0.6">
        Bereichsleitung
      </text>
      {/* Uhr */}
      <circle cx="880" cy="160" r="60" fill={C.white} stroke={C.navyDark} strokeWidth="8" />
      <path d="M880 160 L880 118" stroke={C.navyDark} strokeWidth="7" strokeLinecap="round" />
      <path d="M880 160 L856 172" stroke={C.navyDark} strokeWidth="7" strokeLinecap="round" />
      {stats >= 1 && <Stat x={60} value="2 Jahre" label="im selben Job" color={C.navy} />}
      {stats >= 2 && <Stat x={420} value="0 €" label="Gehaltserhöhung" color={C.coral} />}
    </g>
  );
}

function Office() {
  return (
    <g>
      <rect width="1600" height="900" fill={WALL} />
      {/* Fenster mit Stadt */}
      <rect x="590" y="110" width="420" height="300" rx="14" fill={C.white} />
      <rect x="606" y="126" width="388" height="268" rx="6" fill="#bfe3f2" />
      <g fill="#9fc4d6">
        <rect x="630" y="250" width="70" height="144" />
        <rect x="710" y="200" width="60" height="194" />
        <rect x="790" y="280" width="90" height="114" />
        <rect x="900" y="230" width="70" height="164" />
      </g>
      <rect x="796" y="126" width="8" height="268" fill={C.white} />
      {/* Urkunde: Krüger hat sich selbst ausgezeichnet */}
      <rect x="1340" y="200" width="180" height="130" rx="8" fill={C.white} stroke={C.orange} strokeWidth="8" />
      <text x="1430" y="254" textAnchor="middle" fontSize="20" fontWeight="900" fill={C.navyDark}>
        CHEF
      </text>
      <text x="1430" y="282" textAnchor="middle" fontSize="20" fontWeight="900" fill={C.navyDark}>
        DES JAHRES
      </text>
      <text x="1430" y="310" textAnchor="middle" fontSize="15" fill={C.navy} opacity="0.7">
        (selbst verliehen)
      </text>
    </g>
  );
}

function Desk({ phoneBuzz }: { phoneBuzz: boolean }) {
  return (
    <g>
      <rect y="730" width="1600" height="170" fill={C.wood} />
      <rect y="730" width="1600" height="20" fill="#cda070" />
      {/* Tasse */}
      <rect x="930" y="664" width="70" height="70" rx="12" fill={C.white} />
      <path d="M1000 680 Q1030 698 1000 716" stroke={C.white} strokeWidth="10" fill="none" />
      <text x="965" y="708" textAnchor="middle" fontSize="20" fontWeight="900" fill={C.coral}>
        CHEF
      </text>
      {/* Unterlagen */}
      <rect x="1250" y="700" width="170" height="36" rx="4" fill={C.white} transform="rotate(-3 1335 718)" />
      <rect x="1262" y="690" width="170" height="36" rx="4" fill="#f3f5f9" transform="rotate(2 1347 708)" />
      {/* Dein Handy */}
      <g transform="translate(640 742)">
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

function KruegerSits({ mood, talking }: { mood: Mood; talking: boolean }) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { y: 600, duration: 0.6, ease: "back.out(1.1)" });
  });
  return (
    <g ref={ref}>
      <g transform="translate(1130 430) scale(1.3)">
        <Krueger mood={mood} talking={talking} />
      </g>
    </g>
  );
}

// Flur (vor dem Gespräch) oder Krügers Büro.
export function OfficeScene({
  place,
  stats,
  youMood,
  kruegerMood,
  kruegerTalking,
  brain,
  brainTalking,
  bubble,
  phoneBuzz,
}: {
  place: "hall" | "office";
  stats: number;
  youMood: Mood;
  kruegerMood: Mood;
  kruegerTalking: boolean;
  brain: boolean;
  brainTalking: boolean;
  bubble: string | null;
  phoneBuzz: boolean;
}) {
  return (
    <g>
      {place === "hall" ? <Hall stats={stats} /> : <Office />}
      <g transform={place === "hall" ? "translate(640 470) scale(1.2)" : "translate(470 430) scale(1.3)"}>
        <You pose="sit" mood={youMood} long />
      </g>
      {place === "office" && <KruegerSits mood={kruegerMood} talking={kruegerTalking} />}
      {place === "office" && <Desk phoneBuzz={phoneBuzz} />}
      {brain && place === "office" && <Brain talking={brainTalking} />}
      {brain && place === "hall" && (
        <g transform="translate(170 30)">
          <Brain talking={brainTalking} />
        </g>
      )}
      {bubble && <Bubble key={bubble} text={bubble} />}
    </g>
  );
}

// Kleine Bilder für die drei Erklär-Karten.
export function OfficeIcon({ kind }: { kind: number }) {
  if (kind === 0) {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#fde2b5" />
        <path d="M70 60 H130 V96 Q130 126 100 130 Q70 126 70 96 Z" fill={C.orange} />
        <path d="M70 70 H46 Q46 100 72 104 M130 70 H154 Q154 100 128 104" stroke={C.orange} strokeWidth="9" fill="none" />
        <rect x="92" y="128" width="16" height="22" fill={C.orange} />
        <rect x="70" y="148" width="60" height="14" rx="5" fill={C.navy} />
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#cfeee8" />
        <rect x="34" y="62" width="132" height="76" rx="18" fill={C.teal} />
        <text x="100" y="116" textAnchor="middle" fontSize="46" fontWeight="900" fill={C.white}>
          450 €
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <circle cx="100" cy="100" r="96" fill="#dcebf2" />
      <rect x="46" y="54" width="108" height="100" rx="12" fill={C.white} stroke={C.navy} strokeWidth="8" />
      <rect x="46" y="54" width="108" height="30" rx="12" fill={C.coral} />
      <rect x="66" y="42" width="10" height="26" rx="5" fill={C.navy} />
      <rect x="124" y="42" width="10" height="26" rx="5" fill={C.navy} />
      <path d="M74 118 L92 136 L128 100" stroke={C.teal} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
