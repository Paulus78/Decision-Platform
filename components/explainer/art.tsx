"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Alle Zeichnungen sind handgeschriebenes SVG auf einer Bühne von 1600 x 900.

export type Mood = "neutral" | "happy" | "surprised" | "worried";

export const C = {
  navy: "#2b3a67",
  navyDark: "#1e294b",
  teal: "#2f9e8f",
  tealDark: "#237a6e",
  coral: "#ef6f5e",
  coralDark: "#d95a4a",
  orange: "#f2a33a",
  cream: "#fbf3e4",
  wall: "#f6e7cf",
  floor: "#e6cfa8",
  wood: "#b98a5e",
  woodDark: "#9c7049",
  white: "#ffffff",
  ink: "#33273b",
  mouth: "#5b2333",
};

export function Face({
  mood,
  talking,
  glasses,
}: {
  mood: Mood;
  talking: boolean;
  glasses?: boolean;
}) {
  const wide = mood === "surprised";
  const eyeR = wide ? 19 : 16;
  const browY = wide ? -44 : -34;
  return (
    <g>
      {/* Augenbrauen */}
      {mood === "worried" ? (
        <>
          <path d="M-46 -30 L-16 -38" stroke={C.ink} strokeWidth="6" strokeLinecap="round" />
          <path d="M46 -30 L16 -38" stroke={C.ink} strokeWidth="6" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d={`M-46 ${browY} Q-30 ${browY - 8} -14 ${browY}`} stroke={C.ink} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d={`M46 ${browY} Q30 ${browY - 8} 14 ${browY}`} stroke={C.ink} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {/* Augen */}
      <g className="blink">
        <circle cx="-30" cy="-5" r={eyeR} fill={C.white} />
        <circle cx="30" cy="-5" r={eyeR} fill={C.white} />
        <circle cx="-28" cy="-3" r={wide ? 6 : 8} fill={C.ink} />
        <circle cx="32" cy="-3" r={wide ? 6 : 8} fill={C.ink} />
        <circle cx="-25" cy="-6" r="2.5" fill={C.white} />
        <circle cx="35" cy="-6" r="2.5" fill={C.white} />
      </g>
      {glasses && (
        <g fill="none" stroke={C.navyDark} strokeWidth="5">
          <circle cx="-30" cy="-5" r="25" fill={C.white} fillOpacity="0.18" />
          <circle cx="30" cy="-5" r="25" fill={C.white} fillOpacity="0.18" />
          <path d="M-5 -8 Q0 -13 5 -8" />
          <path d="M-55 -10 L-76 -16" />
          <path d="M55 -10 L76 -16" />
        </g>
      )}
      {/* Wangen */}
      <circle cx="-50" cy="28" r="12" fill={C.coral} opacity="0.35" />
      <circle cx="50" cy="28" r="12" fill={C.coral} opacity="0.35" />
      {/* Mund */}
      {talking ? (
        <ellipse className="talk" cx="0" cy="44" rx="13" ry="11" fill={C.mouth} />
      ) : mood === "happy" ? (
        <path d="M-20 36 Q0 60 20 36 Z" fill={C.mouth} />
      ) : mood === "surprised" ? (
        <ellipse cx="0" cy="46" rx="8" ry="10" fill={C.mouth} />
      ) : mood === "worried" ? (
        <path d="M-14 48 Q0 40 14 48" stroke={C.mouth} strokeWidth="5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M-14 42 Q0 50 14 42" stroke={C.mouth} strokeWidth="5" strokeLinecap="round" fill="none" />
      )}
      {mood === "worried" && (
        <path d="M70 -60 Q62 -44 70 -38 Q78 -44 70 -60 Z" fill="#7fc8e8" />
      )}
    </g>
  );
}

// Die Spielfigur: Kapuzenpulli, zerzauste Haare.
export function You({
  pose,
  mood,
  long,
}: {
  pose: "sit" | "call";
  mood: Mood;
  long?: boolean;
}) {
  const skin = "#f1c6a0";
  const skinShade = "#e0ad84";
  const hair = "#4a3328";
  const bottom = long ? 440 : 260;
  return (
    <g>
      <path d="M-98 110 Q-104 36 0 28 Q104 36 98 110 Z" fill={C.tealDark} />
      <g className="breathe">
        <path
          d={`M-132 ${bottom} Q-134 124 -46 100 L46 100 Q134 124 132 ${bottom} Z`}
          fill={C.teal}
        />
        <path d="M-16 112 L-20 170" stroke={C.white} strokeWidth="5" strokeLinecap="round" />
        <path d="M16 112 L20 170" stroke={C.white} strokeWidth="5" strokeLinecap="round" />
      </g>
      <rect x="-20" y="58" width="40" height="54" rx="14" fill={skinShade} />
      {/* Kopf */}
      <circle cx="-78" cy="6" r="14" fill={skin} />
      <circle cx="78" cy="6" r="14" fill={skin} />
      <ellipse cx="0" cy="0" rx="78" ry="84" fill={skin} />
      <path
        d="M-86 -4 Q-100 -96 -24 -100 Q8 -122 40 -98 Q104 -88 86 0 Q74 -46 34 -56 Q-6 -36 -48 -58 Q-78 -44 -86 -4 Z"
        fill={hair}
      />
      <Face mood={mood} talking={false} />
      {/* Arme */}
      {pose === "sit" ? (
        <g className="breathe">
          <path d="M-112 150 Q-124 236 -26 238" stroke={C.tealDark} strokeWidth="40" strokeLinecap="round" fill="none" />
          <path d="M112 150 Q124 236 26 238" stroke={C.tealDark} strokeWidth="40" strokeLinecap="round" fill="none" />
          <rect x="-15" y="196" width="30" height="52" rx="6" fill={C.navyDark} />
          <circle cx="-20" cy="238" r="18" fill={skin} />
          <circle cx="20" cy="238" r="18" fill={skin} />
        </g>
      ) : (
        <g>
          <path d="M-112 150 Q-124 236 -30 240" stroke={C.tealDark} strokeWidth="40" strokeLinecap="round" fill="none" />
          <circle cx="-26" cy="240" r="18" fill={skin} />
          <path d="M112 150 L142 214 L104 34" stroke={C.tealDark} strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="82" y="-44" width="28" height="76" rx="7" fill={C.navyDark} transform="rotate(-6 96 -6)" />
          <circle cx="102" cy="24" r="20" fill={skin} />
        </g>
      )}
    </g>
  );
}

// Frau Brandt: Dutt, Brille, Blazer, Headset.
export function Brandt({ mood, talking }: { mood: Mood; talking: boolean }) {
  const skin = "#e3ad85";
  const skinShade = "#cf9670";
  const hair = "#6b2f2a";
  return (
    <g>
      <circle cx="0" cy="-112" r="36" fill={hair} />
      <g className="breathe">
        <path d="M-136 440 Q-138 124 -46 100 L46 100 Q138 124 136 440 Z" fill={C.navy} />
        <path d="M-34 100 L34 100 L0 176 Z" fill={C.white} />
        <path d="M-46 100 L0 176 L-22 210 L-70 118 Z" fill={C.navyDark} />
        <path d="M46 100 L0 176 L22 210 L70 118 Z" fill={C.navyDark} />
      </g>
      <rect x="-20" y="58" width="40" height="54" rx="14" fill={skinShade} />
      <circle cx="-78" cy="6" r="14" fill={skin} />
      <circle cx="78" cy="6" r="14" fill={skin} />
      <ellipse cx="0" cy="0" rx="78" ry="84" fill={skin} />
      <path
        d="M-88 20 Q-100 -96 0 -100 Q100 -96 88 20 Q84 -40 42 -60 Q0 -76 -42 -60 Q-84 -40 -88 20 Z"
        fill={hair}
      />
      <Face mood={mood} talking={talking} glasses />
      {/* Headset */}
      <path d="M-86 -6 Q-94 -112 0 -116 Q94 -112 86 -6" stroke="#3d4458" strokeWidth="7" fill="none" />
      <rect x="-100" y="-18" width="24" height="48" rx="10" fill="#3d4458" />
      <path d="M-90 28 Q-84 66 -40 62" stroke="#3d4458" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="-38" cy="62" r="7" fill="#3d4458" />
    </g>
  );
}

function Plant() {
  return (
    <g>
      <path d="M0 0 Q-50 -60 -30 -130 Q-4 -80 0 0 Z" fill={C.teal} />
      <path d="M0 0 Q50 -70 44 -150 Q10 -90 0 0 Z" fill={C.tealDark} />
      <path d="M0 0 Q-10 -100 8 -180 Q24 -100 0 0 Z" fill="#3fb5a3" />
      <path d="M-36 0 L36 0 L28 62 L-28 62 Z" fill={C.coral} />
      <rect x="-40" y="-6" width="80" height="14" rx="5" fill={C.coralDark} />
    </g>
  );
}

function useScenePop() {
  const ref = useRef<SVGGElement>(null);
  useGSAP(
    () => {
      gsap.from(".pop", {
        scale: 0,
        opacity: 0,
        transformOrigin: "50% 100%",
        duration: 0.55,
        stagger: 0.08,
        ease: "back.out(1.7)",
      });
    },
    { scope: ref },
  );
  return ref;
}

export function HomeScene({
  mood,
  thought,
  ringing,
}: {
  mood: Mood;
  thought: "goal" | "bank" | null;
  ringing: boolean;
}) {
  const ref = useScenePop();
  return (
    <g ref={ref}>
      <rect width="1600" height="900" fill={C.wall} />
      <rect y="700" width="1600" height="200" fill={C.floor} />
      <ellipse cx="800" cy="815" rx="520" ry="56" fill="#f1dfc0" />

      {/* Fenster */}
      <g className="pop">
        <rect x="150" y="110" width="290" height="270" rx="14" fill={C.white} />
        <rect x="166" y="126" width="258" height="238" rx="6" fill="#bfe3f2" />
        <circle cx="366" cy="184" r="30" fill="#ffd66b" />
        <ellipse cx="250" cy="300" rx="62" ry="22" fill={C.white} />
        <ellipse cx="290" cy="286" rx="44" ry="22" fill={C.white} />
        <rect x="290" y="126" width="10" height="238" fill={C.white} />
      </g>

      {/* Bild an der Wand */}
      <g className="pop">
        <rect x="1150" y="150" width="170" height="130" rx="8" fill={C.white} />
        <rect x="1164" y="164" width="142" height="102" rx="4" fill="#fde2b5" />
        <path d="M1164 266 L1210 206 L1250 244 L1276 220 L1306 266 Z" fill={C.orange} />
      </g>

      {/* Stehlampe */}
      <g className="pop">
        <rect x="1404" y="330" width="10" height="390" fill={C.navyDark} />
        <ellipse cx="1409" cy="722" rx="52" ry="12" fill={C.navyDark} />
        <path d="M1352 330 L1466 330 L1440 240 L1378 240 Z" fill={C.orange} />
      </g>

      {/* Pflanze */}
      <g transform="translate(300 668)">
        <g className="pop">
          <Plant />
        </g>
      </g>

      {/* Sofa */}
      <g className="pop">
        <rect x="490" y="430" width="620" height="260" rx="46" fill={C.coral} />
        <rect x="432" y="520" width="100" height="220" rx="40" fill={C.coralDark} />
        <rect x="1068" y="520" width="100" height="220" rx="40" fill={C.coralDark} />
        <rect x="470" y="610" width="660" height="120" rx="34" fill={C.coralDark} />
        <rect x="520" y="730" width="24" height="34" fill={C.woodDark} />
        <rect x="1056" y="730" width="24" height="34" fill={C.woodDark} />
      </g>

      {/* Du */}
      <g className="pop">
        <g transform="translate(800 396)">
          <You pose="sit" mood={mood} />
        </g>
        <rect x="662" y="650" width="276" height="84" rx="38" fill={C.navy} />
        <rect x="690" y="690" width="76" height="120" rx="30" fill={C.navy} />
        <rect x="834" y="690" width="76" height="120" rx="30" fill={C.navy} />
        <ellipse cx="722" cy="812" rx="52" ry="20" fill={C.white} />
        <ellipse cx="878" cy="812" rx="52" ry="20" fill={C.white} />
      </g>

      {thought && <Thought key={thought} kind={thought} />}
      {ringing && <RingingPhone />}
    </g>
  );
}

function Thought({ kind }: { kind: "goal" | "bank" }) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      scale: 0,
      opacity: 0,
      svgOrigin: "930 340",
      duration: 0.45,
      ease: "back.out(1.8)",
    });
  });
  return (
    <g ref={ref}>
      <circle cx="930" cy="330" r="12" fill={C.white} />
      <circle cx="968" cy="300" r="18" fill={C.white} />
      <rect x="990" y="110" width="400" height="190" rx="95" fill={C.white} />
      {kind === "goal" ? (
        <>
          <text x="1190" y="182" textAnchor="middle" fontSize="30" fontWeight="700" fill={C.navy} opacity="0.6">
            MEIN ZIEL
          </text>
          <text x="1190" y="256" textAnchor="middle" fontSize="68" fontWeight="900" fill={C.teal}>
            55.000 €
          </text>
        </>
      ) : (
        <>
          <text x="1190" y="182" textAnchor="middle" fontSize="30" fontWeight="700" fill={C.navy} opacity="0.6">
            KONTOSTAND
          </text>
          <text x="1190" y="256" textAnchor="middle" fontSize="68" fontWeight="900" fill={C.coral}>
            213,47 €
          </text>
        </>
      )}
    </g>
  );
}

function RingingPhone() {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { x: 500, rotation: 20, duration: 0.5, ease: "back.out(1.4)" });
  });
  return (
    <g ref={ref}>
      <g transform="translate(1270 440)">
        <g className="ring">
          <path d="M-178 -80 Q-214 0 -178 80" stroke={C.coral} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M-212 -120 Q-266 0 -212 120" stroke={C.coral} strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.5" />
          <path d="M178 -80 Q214 0 178 80" stroke={C.coral} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M212 -120 Q266 0 212 120" stroke={C.coral} strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.5" />
          <rect x="-140" y="-270" width="280" height="540" rx="40" fill={C.navyDark} />
          <rect x="-124" y="-254" width="248" height="508" rx="28" fill={C.navy} />
          <circle cx="0" cy="-120" r="56" fill={C.orange} />
          <text x="0" y="-98" textAnchor="middle" fontSize="64" fontWeight="900" fill={C.navyDark}>
            N
          </text>
          <text x="0" y="-12" textAnchor="middle" fontSize="36" fontWeight="800" fill={C.white}>
            Novara GmbH
          </text>
          <text x="0" y="32" textAnchor="middle" fontSize="24" fill={C.white} opacity="0.7">
            Eingehender Anruf …
          </text>
          <circle cx="-62" cy="170" r="40" fill={C.coral} />
          <circle cx="62" cy="170" r="40" fill="#3fbf7f" />
          <path d="M-80 170 L-44 170" stroke={C.white} strokeWidth="9" strokeLinecap="round" />
          <path d="M46 172 L58 184 L80 156" stroke={C.white} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </g>
    </g>
  );
}

export function CallScene({
  youMood,
  brandtMood,
  brandtTalking,
  bubble,
}: {
  youMood: Mood;
  brandtMood: Mood;
  brandtTalking: boolean;
  bubble: string | null;
}) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(
    () => {
      gsap.from(".left", { x: -840, duration: 0.6, ease: "power3.out" });
      gsap.from(".right", { x: 840, duration: 0.6, ease: "power3.out" });
      gsap.from(".tag", { opacity: 0, y: 30, duration: 0.4, delay: 0.5, stagger: 0.1 });
    },
    { scope: ref },
  );
  return (
    <g ref={ref}>
      <defs>
        <clipPath id="clip-left">
          <polygon points="0,0 846,0 754,900 0,900" />
        </clipPath>
        <clipPath id="clip-right">
          <polygon points="846,0 1600,0 1600,900 754,900" />
        </clipPath>
      </defs>
      <rect width="1600" height="900" fill={C.white} />

      {/* Links: du zu Hause */}
      <g clipPath="url(#clip-left)">
        <g className="left">
          <rect width="860" height="900" fill={C.wall} />
          <rect x="60" y="80" width="230" height="250" rx="14" fill={C.white} />
          <rect x="74" y="94" width="202" height="222" rx="6" fill="#bfe3f2" />
          <circle cx="226" cy="150" r="26" fill="#ffd66b" />
          <rect x="-40" y="560" width="900" height="400" rx="60" fill={C.coral} />
          <g transform="translate(400 430) scale(1.45)">
            <You pose="call" mood={youMood} long />
          </g>
        </g>
      </g>

      {/* Rechts: Frau Brandt im Büro */}
      <g clipPath="url(#clip-right)">
        <g className="right">
          <rect x="740" width="860" height="900" fill="#dcebf2" />
          <rect x="1300" y="70" width="240" height="250" rx="12" fill={C.white} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x="1314" y={86 + i * 37} width="212" height="24" rx="4" fill="#c5dbe6" />
          ))}
          <rect x="868" y="204" width="196" height="64" rx="14" fill={C.navy} />
          <circle cx="900" cy="236" r="14" fill={C.orange} />
          <text x="984" y="246" textAnchor="middle" fontSize="27" fontWeight="900" fill={C.white} letterSpacing="2">
            NOVARA
          </text>
          <g transform="translate(1190 400) scale(1.45)">
            <Brandt mood={brandtMood} talking={brandtTalking} />
          </g>
          {/* Schreibtisch */}
          <rect x="740" y="730" width="860" height="170" fill={C.wood} />
          <rect x="740" y="730" width="860" height="22" fill="#cda070" />
          <rect x="1380" y="596" width="190" height="136" rx="12" fill="#55607a" />
          <circle cx="1475" cy="664" r="14" fill="#7f8aa6" />
          <rect x="1350" y="728" width="250" height="12" rx="6" fill="#3d4458" />
          <rect x="930" y="676" width="56" height="58" rx="10" fill={C.white} />
          <path d="M986 690 Q1012 704 986 720" stroke={C.white} strokeWidth="9" fill="none" />
          <g transform="translate(860 672) scale(0.7)">
            <Plant />
          </g>
        </g>
      </g>

      <line x1="846" y1="0" x2="754" y2="900" stroke={C.white} strokeWidth="16" />

      {/* Namensschilder */}
      <g className="tag">
        <rect x="60" y="40" width="120" height="56" rx="28" fill={C.teal} />
        <text x="120" y="78" textAnchor="middle" fontSize="30" fontWeight="800" fill={C.white}>
          Du
        </text>
      </g>
      <g className="tag">
        <rect x="1240" y="40" width="300" height="56" rx="28" fill={C.navy} />
        <text x="1390" y="78" textAnchor="middle" fontSize="28" fontWeight="800" fill={C.white}>
          Frau Brandt · HR
        </text>
      </g>

      {bubble && <SpeechBubble key={bubble} text={bubble} />}
    </g>
  );
}

// Deine Antwort als Sprechblase (du hast keine eigene Stimme – du bist ja du).
function SpeechBubble({ text }: { text: string }) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      scale: 0,
      opacity: 0,
      svgOrigin: "470 258",
      duration: 0.4,
      ease: "back.out(2)",
    });
  });
  // Lange Antworten auf zwei Zeilen verteilen.
  const words = text.split(" ");
  const lines: string[] = [];
  for (const word of words) {
    const last = lines[lines.length - 1];
    if (last !== undefined && (last + " " + word).length <= 18) lines[lines.length - 1] = last + " " + word;
    else lines.push(word);
  }
  const height = 70 + lines.length * 52;
  return (
    <g ref={ref}>
      <rect x="300" y={215 - height} width="430" height={height} rx="36" fill={C.teal} />
      <path d="M440 211 L470 258 L500 211 Z" fill={C.teal} />
      {lines.map((line, i) => (
        <text
          key={i}
          x="515"
          y={215 - height + 76 + i * 52}
          textAnchor="middle"
          fontSize="44"
          fontWeight="800"
          fill={C.white}
        >
          {line}
        </text>
      ))}
    </g>
  );
}
