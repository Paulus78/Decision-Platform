"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { C, Face, HomeScene, You, type Mood } from "./art";

// Zeichnungen für die Situation "Die Traumwohnung". Bühne: 1600 x 900.

export type ChatMessage = { from: "markus" | "du"; text: string; visual?: string };

// Das Zimmer aus dem Inserat (480 x 360).
function RoomArt() {
  return (
    <g>
      <rect width="480" height="360" fill="#fbe6c4" />
      <rect y="250" width="480" height="110" fill="#c9976a" />
      {[60, 150, 240, 330, 420].map((x) => (
        <line key={x} x1={x} y1="250" x2={x - 30} y2="360" stroke="#b58258" strokeWidth="3" />
      ))}
      {/* Lichterkette */}
      <path d="M10 26 Q120 56 240 28 Q360 2 470 30" stroke="#8a6a4a" strokeWidth="2" fill="none" />
      {[40, 100, 160, 220, 280, 340, 400, 450].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? 36 : 40} r="6" fill="#ffd66b" />
      ))}
      {/* Fenster */}
      <rect x="36" y="70" width="140" height="150" rx="8" fill={C.white} />
      <rect x="46" y="80" width="120" height="130" rx="4" fill="#bfe3f2" />
      <rect x="103" y="80" width="6" height="130" fill={C.white} />
      {/* Balkontür */}
      <rect x="214" y="56" width="120" height="196" rx="8" fill={C.white} />
      <rect x="224" y="66" width="100" height="176" rx="4" fill="#bfe3f2" />
      <circle cx="296" cy="100" r="16" fill="#ffd66b" />
      {[236, 256, 276, 296, 316].map((x) => (
        <rect key={x} x={x} y="180" width="5" height="62" fill="#7a8399" />
      ))}
      <rect x="224" y="176" width="100" height="6" fill="#7a8399" />
      {/* Bett */}
      <rect x="330" y="236" width="150" height="70" rx="12" fill={C.coral} />
      <rect x="420" y="222" width="56" height="34" rx="10" fill={C.white} />
      <rect x="330" y="296" width="150" height="16" fill={C.woodDark} />
      {/* Pflanze */}
      <path d="M40 300 Q20 250 34 214 Q48 256 40 300 Z" fill={C.teal} />
      <path d="M40 300 Q64 250 58 206 Q36 250 40 300 Z" fill={C.tealDark} />
      <path d="M22 298 L58 298 L52 336 L28 336 Z" fill={C.orange} />
    </g>
  );
}

// Markus, der Vermieter: Dreitagebart, Sonnenbrille im Haar, sehr freundlich.
function Markus({ talking }: { talking: boolean }) {
  const skin = "#eac09a";
  return (
    <g>
      <path d="M-136 300 Q-138 124 -46 100 L46 100 Q138 124 136 300 Z" fill={C.orange} />
      <path d="M-40 100 L0 150 L40 100 Z" fill={C.white} />
      <rect x="-20" y="58" width="40" height="54" rx="14" fill="#d6a67e" />
      <circle cx="-78" cy="6" r="14" fill={skin} />
      <circle cx="78" cy="6" r="14" fill={skin} />
      <ellipse cx="0" cy="0" rx="78" ry="84" fill={skin} />
      {/* Bart */}
      <path d="M-70 24 Q-60 84 0 86 Q60 84 70 24 Q40 62 0 62 Q-40 62 -70 24 Z" fill="#3b2a22" opacity="0.5" />
      <path d="M-86 -8 Q-96 -100 0 -104 Q96 -100 86 -8 Q70 -54 20 -62 Q-30 -66 -86 -8 Z" fill="#3b2a22" />
      {/* Sonnenbrille im Haar */}
      <rect x="-56" y="-92" width="48" height="26" rx="12" fill={C.navyDark} />
      <rect x="8" y="-92" width="48" height="26" rx="12" fill={C.navyDark} />
      <rect x="-10" y="-84" width="20" height="6" fill={C.navyDark} />
      <Face mood="happy" talking={talking} />
    </g>
  );
}

export function MarkusFace() {
  return (
    <svg viewBox="-110 -120 220 220" className="h-full w-full">
      <circle cx="0" cy="-10" r="108" fill="#dcebf2" />
      <g transform="translate(0 6) scale(0.92)">
        <Markus talking={false} />
      </g>
    </svg>
  );
}

function Box({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="#c9976a" />
      <rect x={x} y={y} width={w} height={h * 0.2} rx="6" fill="#dab183" />
      <rect x={x + w / 2 - 12} y={y} width="24" height={h} fill="#e8cfa4" opacity="0.8" />
    </g>
  );
}

function Stat({
  y,
  value,
  label,
  color,
}: {
  y: number;
  value: string;
  label: string;
  color: string;
}) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      scale: 0,
      opacity: 0,
      svgOrigin: `1290 ${y + 80}`,
      duration: 0.45,
      ease: "back.out(1.8)",
    });
  });
  return (
    <g ref={ref}>
      <rect x="1110" y={y} width="360" height="160" rx="30" fill={C.white} />
      <text x="1290" y={y + 96} textAnchor="middle" fontSize="96" fontWeight="900" fill={color}>
        {value}
      </text>
      <text x="1290" y={y + 138} textAnchor="middle" fontSize="30" fontWeight="700" fill={C.navy} opacity="0.7">
        {label}
      </text>
    </g>
  );
}

// Du auf dem Sofa von Jonas, zwischen Umzugskartons.
export function SofaScene({ mood, stats }: { mood: Mood; stats: number }) {
  return (
    <g>
      <HomeScene mood={mood} thought={null} ringing={false} />
      <Box x={70} y={560} w={150} h={130} />
      <Box x={50} y={690} w={200} h={130} />
      <Box x={1180} y={700} w={170} h={120} />
      {stats >= 1 && <Stat y={130} value="34" label="Bewerbungen" color={C.navy} />}
      {stats >= 2 && <Stat y={320} value="0" label="Zusagen" color={C.coral} />}
    </g>
  );
}

// Das Inserat: zu schön, um wahr zu sein.
export function ListingScene({ mood }: { mood: Mood }) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(
    () => {
      gsap.from(".ad", { y: 800, rotation: 4, duration: 0.6, ease: "back.out(1.1)" });
      gsap.from(".pill", {
        scale: 0,
        transformOrigin: "50% 50%",
        duration: 0.35,
        stagger: 0.12,
        delay: 0.7,
        ease: "back.out(2)",
      });
      gsap.from(".price", {
        scale: 0,
        transformOrigin: "0% 100%",
        duration: 0.5,
        delay: 1.2,
        ease: "back.out(2)",
      });
    },
    { scope: ref },
  );
  return (
    <g ref={ref}>
      <rect width="1600" height="900" fill={C.wall} />
      <rect x="-40" y="620" width="560" height="320" rx="60" fill={C.coral} />
      <g transform="translate(230 560) scale(1.1)">
        <You pose="sit" mood={mood} long />
      </g>

      <g className="ad">
        <rect x="492" y="122" width="1040" height="600" rx="32" fill="#e3cfa6" />
        <rect x="480" y="110" width="1040" height="600" rx="32" fill={C.white} />
        <clipPath id="ad-photo">
          <rect x="510" y="140" width="500" height="375" rx="20" />
        </clipPath>
        <g clipPath="url(#ad-photo)">
          <g transform="translate(510 140) scale(1.0417)">
            <RoomArt />
          </g>
        </g>
        <rect x="510" y="160" width="110" height="44" fill={C.coral} />
        <text x="565" y="192" textAnchor="middle" fontSize="28" fontWeight="900" fill={C.white}>
          NEU
        </text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={510 + i * 172} y="540" width="156" height="110" rx="14" fill={["#fbe6c4", "#bfe3f2", "#c9976a"][i]} />
        ))}

        <text x="1050" y="190" fontSize="44" fontWeight="900" fill={C.navyDark}>
          Helles WG-Zimmer
        </text>
        <text x="1050" y="242" fontSize="44" fontWeight="900" fill={C.navyDark}>
          mit Balkon
        </text>
        {["18 m²", "Altbau", "Balkon"].map((label, i) => (
          <g key={label} className="pill">
            <rect x={1050 + i * 150} y="276" width="136" height="52" rx="26" fill="#dcebf2" />
            <text x={1118 + i * 150} y="312" textAnchor="middle" fontSize="26" fontWeight="800" fill={C.navy}>
              {label}
            </text>
          </g>
        ))}
        <g className="price">
          <text x="1050" y="470" fontSize="124" fontWeight="900" fill={C.teal}>
            420 €
          </text>
          <text x="1056" y="516" fontSize="34" fontWeight="700" fill={C.navy} opacity="0.6">
            warm, pro Monat
          </text>
        </g>
        <circle cx="1084" cy="610" r="34" fill="#dcebf2" />
        <text x="1084" y="622" textAnchor="middle" fontSize="34" fontWeight="900" fill={C.navy}>
          M
        </text>
        <text x="1134" y="604" fontSize="28" fontWeight="800" fill={C.navyDark}>
          Markus · Vermieter
        </text>
        <text x="1134" y="640" fontSize="24" fill={C.navy} opacity="0.6">
          antwortet meist sofort
        </text>
      </g>
    </g>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { opacity: 0, y: 30, scale: 0.9, duration: 0.35, ease: "back.out(1.6)" });
  });
  const mine = message.from === "du";
  return (
    <div
      ref={ref}
      style={{
        alignSelf: mine ? "flex-end" : "flex-start",
        maxWidth: "82%",
        background: mine ? C.teal : "#fff",
        color: mine ? "#fff" : C.ink,
        borderRadius: 24,
        padding: "14px 20px",
        fontSize: 27,
        lineHeight: 1.25,
        fontWeight: 600,
        boxShadow: "0 3px 8px rgba(30,41,75,0.08)",
      }}
    >
      {message.text}
      {message.visual === "id" && (
        <div
          style={{
            marginTop: 12,
            display: "flex",
            gap: 14,
            padding: 14,
            borderRadius: 14,
            background: "#e9f1e4",
            border: "3px solid #b9cfae",
          }}
        >
          <div style={{ width: 84, height: 100, borderRadius: 8, background: "#c7d8bd", overflow: "hidden" }}>
            <MarkusFace />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, paddingTop: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 2, color: "#5f7a52" }}>
              PERSONALAUSWEIS
            </div>
            <div style={{ height: 12, width: "80%", borderRadius: 6, background: "#b9cfae" }} />
            <div style={{ height: 12, width: "60%", borderRadius: 6, background: "#b9cfae" }} />
            <div style={{ height: 12, width: "70%", borderRadius: 6, background: "#b9cfae" }} />
          </div>
        </div>
      )}
    </div>
  );
}

// Du links, in der Mitte der Chat, rechts Markus auf seiner "Postkarte".
export function ChatScene({
  night,
  mood,
  messages,
  markusTalking,
  search,
}: {
  night: boolean;
  mood: Mood;
  messages: ChatMessage[];
  markusTalking: boolean;
  search: boolean;
}) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(
    () => {
      gsap.from(".chat", { y: 800, duration: 0.6, ease: "back.out(1.1)" });
      gsap.from(".postcard", { x: 500, rotation: 25, duration: 0.6, delay: 0.25, ease: "back.out(1.3)" });
    },
    { scope: ref },
  );
  return (
    <g ref={ref}>
      <rect width="1600" height="900" fill={night ? "#2c3360" : C.wall} />
      <rect x="-40" y="620" width="600" height="320" rx="60" fill={C.coral} />
      <g transform="translate(260 560) scale(1.15)">
        <You pose="sit" mood={mood} long />
      </g>

      <g className="chat">
        <rect x="590" y="116" width="600" height="596" rx="36" fill={C.navyDark} />
        <rect x="606" y="132" width="568" height="564" rx="22" fill="#f3f5f9" />
        <foreignObject x="606" y="132" width="568" height="564">
          <div
            style={{
              width: 568,
              height: 564,
              display: "flex",
              flexDirection: "column",
              borderRadius: 22,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                height: 88,
                padding: "0 20px",
                background: "#fff",
                borderBottom: "3px solid #e6e9f0",
              }}
            >
              <div style={{ width: 60, height: 60, borderRadius: 30, overflow: "hidden" }}>
                <MarkusFace />
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 800, color: C.ink }}>Markus</div>
                <div style={{ fontSize: 20, color: "#3fa76f", fontWeight: 700 }}>
                  ● Vermieter · online
                </div>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: 12,
                padding: 18,
                overflow: "hidden",
              }}
            >
              {messages.slice(-3).map((message) => (
                <Bubble key={message.text} message={message} />
              ))}
            </div>
          </div>
        </foreignObject>
      </g>

      {/* Postkarte aus "Dänemark" */}
      <g className="postcard">
        <g transform="translate(1392 370) rotate(5)">
          <rect x="-158" y="-204" width="316" height="430" rx="16" fill="#00000022" transform="translate(8 10)" />
          <rect x="-158" y="-204" width="316" height="430" rx="16" fill={C.white} />
          <clipPath id="postcard">
            <rect x="-142" y="-188" width="284" height="300" rx="10" />
          </clipPath>
          <g clipPath="url(#postcard)">
            <rect x="-142" y="-188" width="284" height="300" fill="#bfe3f2" />
            <rect x="-142" y="40" width="284" height="80" fill="#6fb6d9" />
            <rect x="-130" y="-20" width="50" height="60" fill={C.coral} />
            <path d="M-136 -20 L-105 -50 L-74 -20 Z" fill={C.coralDark} />
            <rect x="80" y="-10" width="46" height="50" fill="#f2c14e" />
            <path d="M74 -10 L103 -38 L132 -10 Z" fill="#d9a441" />
            <g transform="translate(0 0) scale(0.86)">
              <Markus talking={markusTalking} />
            </g>
          </g>
          {/* Flagge */}
          <rect x="84" y="-180" width="50" height="36" fill="#d43f3f" />
          <rect x="98" y="-180" width="8" height="36" fill={C.white} />
          <rect x="84" y="-166" width="50" height="8" fill={C.white} />
          <text x="0" y="158" textAnchor="middle" fontSize="34" fontWeight="900" fill={C.navyDark}>
            Markus
          </text>
          <text x="0" y="194" textAnchor="middle" fontSize="22" fontWeight="700" fill={C.navy} opacity="0.6">
            „beruflich in Dänemark“
          </text>
        </g>
      </g>

      {search && <SearchResult />}
    </g>
  );
}

// Die Bildersuche findet dasselbe Zimmer in Wien.
function SearchResult() {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      scale: 0,
      svgOrigin: "890 430",
      duration: 0.5,
      ease: "back.out(1.7)",
    });
  });
  return (
    <g ref={ref}>
      <rect x="622" y="262" width="560" height="350" rx="30" fill="#00000030" />
      <rect x="610" y="250" width="560" height="350" rx="30" fill={C.white} stroke={C.coral} strokeWidth="8" />
      <circle cx="668" cy="308" r="20" fill="none" stroke={C.navy} strokeWidth="8" />
      <path d="M683 323 L700 340" stroke={C.navy} strokeWidth="8" strokeLinecap="round" />
      <text x="720" y="320" fontSize="32" fontWeight="900" fill={C.navyDark}>
        Bildersuche · 1 Treffer
      </text>
      <clipPath id="search-photo">
        <rect x="640" y="360" width="240" height="200" rx="14" />
      </clipPath>
      <g clipPath="url(#search-photo)">
        <g transform="translate(640 360) scale(0.56)">
          <RoomArt />
        </g>
      </g>
      <text x="906" y="410" fontSize="30" fontWeight="900" fill={C.navyDark}>
        Helles Zimmer
      </text>
      <text x="906" y="450" fontSize="30" fontWeight="900" fill={C.coral}>
        in Wien
      </text>
      <text x="906" y="500" fontSize="24" fill={C.navy} opacity="0.7">
        Inserat von 2023
      </text>
      <text x="906" y="534" fontSize="24" fill={C.navy} opacity="0.7">
        Anbieter: „Sophie“
      </text>
    </g>
  );
}

// Kleine Bilder für die drei Erklär-Karten.
export function WohnungIcon({ kind }: { kind: number }) {
  if (kind === 0) {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#dcebf2" />
        <g fill="none" stroke={C.navy} strokeWidth="13" strokeLinecap="round">
          <circle cx="66" cy="100" r="26" />
          <path d="M92 100 L164 100 M140 100 L140 124 M160 100 L160 118" />
        </g>
        <circle cx="140" cy="54" r="30" fill={C.orange} />
        <text x="140" y="68" textAnchor="middle" fontSize="38" fontWeight="900" fill={C.navyDark}>
          €
        </text>
        <path d="M112 30 L168 80" stroke={C.coral} strokeWidth="12" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#fde2b5" />
        <path d="M62 44 H138 M62 156 H138" stroke={C.navy} strokeWidth="12" strokeLinecap="round" />
        <path d="M70 50 Q70 90 100 100 Q130 90 130 50 Z" fill={C.white} stroke={C.navy} strokeWidth="8" />
        <path d="M70 150 Q70 110 100 100 Q130 110 130 150 Z" fill={C.coral} stroke={C.navy} strokeWidth="8" />
        <path d="M84 64 Q100 84 116 64 Z" fill={C.coral} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <circle cx="100" cy="100" r="96" fill="#cfeee8" />
      <rect x="34" y="62" width="132" height="84" rx="12" fill={C.white} stroke={C.teal} strokeWidth="8" />
      <circle cx="68" cy="96" r="14" fill={C.teal} />
      <path d="M48 130 Q68 106 88 130 Z" fill={C.teal} />
      <rect x="100" y="84" width="50" height="9" rx="4" fill={C.teal} opacity="0.5" />
      <rect x="100" y="102" width="38" height="9" rx="4" fill={C.teal} opacity="0.5" />
      <rect x="100" y="120" width="44" height="9" rx="4" fill={C.teal} opacity="0.5" />
      <path d="M130 36 L172 78 M172 36 L130 78" stroke={C.coral} strokeWidth="13" strokeLinecap="round" />
    </svg>
  );
}
