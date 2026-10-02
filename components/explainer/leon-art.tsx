"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { C, Face, You, type Mood } from "./art";
import { Brain } from "./date-art";

// Zeichnungen für die Situation "500 € für Leon". Bühne: 1600 x 900.

export type LeonMessage = { from: "leon" | "du"; text: string };
export type StoryKind = "ask" | "festival" | "sorry";

// Leon: Locken, breites Grinsen, auf dem Festival mit Sonnenbrille.
function Leon({ mood, shades }: { mood: Mood; shades?: boolean }) {
  const skin = "#d9a47a";
  const hair = "#2f2430";
  return (
    <g>
      <path d="M-136 300 Q-138 124 -46 100 L46 100 Q138 124 136 300 Z" fill="#f2c14e" />
      <path d="M-36 100 Q0 138 36 100 Z" fill={skin} />
      <rect x="-20" y="58" width="40" height="54" rx="14" fill="#c48e66" />
      <circle cx="-78" cy="6" r="14" fill={skin} />
      <circle cx="78" cy="6" r="14" fill={skin} />
      <ellipse cx="0" cy="0" rx="78" ry="84" fill={skin} />
      {[
        [-70, -50], [-44, -84], [-8, -98], [30, -92], [62, -66], [80, -34], [-84, -22], [-22, -66], [22, -64], [54, -40], [-54, -34],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="30" fill={hair} />
      ))}
      <Face mood={mood} talking={false} />
      {shades && (
        <g>
          <rect x="-58" y="-22" width="50" height="34" rx="14" fill={C.navyDark} />
          <rect x="8" y="-22" width="50" height="34" rx="14" fill={C.navyDark} />
          <rect x="-10" y="-12" width="20" height="7" fill={C.navyDark} />
        </g>
      )}
    </g>
  );
}

export function LeonFace() {
  return (
    <svg viewBox="-130 -140 260 260" className="h-full w-full">
      <circle cx="0" cy="-10" r="128" fill="#fde2b5" />
      <g transform="translate(0 12) scale(0.9)">
        <Leon mood="happy" />
      </g>
    </svg>
  );
}

function Bubble({ message }: { message: LeonMessage }) {
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
        fontSize: 28,
        lineHeight: 1.25,
        fontWeight: 600,
        boxShadow: "0 3px 8px rgba(30,41,75,0.08)",
      }}
    >
      {message.text}
    </div>
  );
}

// Leons Story: zeigt, was er gerade treibt.
function StoryCard({ kind }: { kind: StoryKind }) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { x: 500, rotation: 20, duration: 0.6, ease: "back.out(1.3)" });
  });
  const festival = kind === "festival";
  return (
    <g ref={ref}>
      <g transform="translate(1392 380) rotate(4)">
        <rect x="-158" y="-234" width="316" height="470" rx="30" fill="#00000022" transform="translate(8 10)" />
        <rect x="-158" y="-234" width="316" height="470" rx="30" fill={C.navyDark} />
        <clipPath id="leon-story">
          <rect x="-146" y="-222" width="292" height="446" rx="22" />
        </clipPath>
        <g clipPath="url(#leon-story)">
          <rect x="-146" y="-222" width="292" height="446" fill={festival ? "#3b2a6b" : kind === "sorry" ? "#c9d3e6" : "#fde2b5"} />
          {festival && (
            <g>
              <path d="M-146 -222 L-40 -40 L-146 -40 Z" fill="#f2c14e" opacity="0.35" />
              <path d="M146 -222 L40 -40 L146 -40 Z" fill="#ef6f5e" opacity="0.35" />
              <path d="M0 -222 L-50 -40 L50 -40 Z" fill="#7fd6c8" opacity="0.3" />
              {[[-110, -150], [-60, -190], [40, -170], [100, -130], [-20, -120], [80, -200], [-120, -80], [120, -60]].map(
                ([x, y], i) => (
                  <rect key={i} x={x} y={y} width="12" height="12" rx="3" fill={["#f2c14e", "#ef6f5e", "#7fd6c8", "#ffffff"][i % 4]} transform={`rotate(${i * 25} ${x} ${y})`} />
                ),
              )}
              <path d="M-112 150 L-150 60" stroke="#d9a47a" strokeWidth="34" strokeLinecap="round" />
              <path d="M112 150 L150 60" stroke="#d9a47a" strokeWidth="34" strokeLinecap="round" />
            </g>
          )}
          <g transform="translate(0 40) scale(0.9)">
            <Leon mood={festival ? "happy" : "worried"} shades={festival} />
          </g>
        </g>
        <circle cx="-108" cy="-188" r="22" fill={C.orange} />
        <text x="-108" y="-178" textAnchor="middle" fontSize="26" fontWeight="900" fill={C.navyDark}>
          L
        </text>
        <text x="-76" y="-180" fontSize="22" fontWeight="800" fill={festival ? C.white : C.navyDark}>
          Leon · Story
        </text>
        <rect x="-126" y="150" width="252" height="54" rx="14" fill={C.white} opacity="0.95" />
        <text x="0" y="186" textAnchor="middle" fontSize={festival ? 17 : 24} fontWeight="900" fill={C.navyDark}>
          {festival ? "BESTES WOCHENENDE EVER" : kind === "sorry" ? "Monatsende …" : "Miete. Schon wieder."}
        </text>
      </g>
    </g>
  );
}

// Du links mit deinem Gehirn, in der Mitte der Chat, rechts Leons Story.
export function LeonScene({
  night,
  mood,
  messages,
  story,
  brain,
  brainTalking,
}: {
  night: boolean;
  mood: Mood;
  messages: LeonMessage[];
  story: StoryKind;
  brain: boolean;
  brainTalking: boolean;
}) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(
    () => {
      gsap.from(".chat", { y: 800, duration: 0.6, ease: "back.out(1.1)" });
    },
    { scope: ref },
  );
  return (
    <g ref={ref}>
      <rect width="1600" height="900" fill={night ? "#2c3360" : C.wall} />
      <rect x="-40" y="640" width="600" height="320" rx="60" fill={C.coral} />
      <g transform="translate(330 580) scale(1.15)">
        <You pose="sit" mood={mood} long />
      </g>

      <g className="chat">
        <rect x="610" y="150" width="580" height="570" rx="36" fill={C.navyDark} />
        <rect x="626" y="166" width="548" height="538" rx="22" fill="#f3f5f9" />
        <foreignObject x="626" y="166" width="548" height="538">
          <div
            style={{
              width: 548,
              height: 538,
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
                <LeonFace />
              </div>
              <div>
                <div style={{ fontSize: 30, fontWeight: 800, color: C.ink }}>Leon</div>
                <div style={{ fontSize: 20, color: "#3fa76f", fontWeight: 700 }}>● online</div>
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

      <StoryCard key={story} kind={story} />
      {brain && <Brain talking={brainTalking} />}
    </g>
  );
}

// Kleine Bilder für die drei Erklär-Karten.
export function LeonIcon({ kind }: { kind: number }) {
  if (kind === 0) {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#dcebf2" />
        <rect x="46" y="54" width="108" height="100" rx="12" fill={C.white} stroke={C.navy} strokeWidth="8" />
        <rect x="46" y="54" width="108" height="30" rx="12" fill={C.coral} />
        <rect x="66" y="42" width="10" height="26" rx="5" fill={C.navy} />
        <rect x="124" y="42" width="10" height="26" rx="5" fill={C.navy} />
        <text x="100" y="134" textAnchor="middle" fontSize="44" fontWeight="900" fill={C.navy}>
          16.
        </text>
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#cfeee8" />
        <path d="M44 56 H156 Q170 56 170 70 V122 Q170 136 156 136 H104 L76 162 V136 H44 Q30 136 30 122 V70 Q30 56 44 56 Z" fill={C.teal} />
        <text x="100" y="122" textAnchor="middle" fontSize="70" fontWeight="900" fill={C.white}>
          €?
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <circle cx="100" cy="100" r="96" fill="#fde2b5" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={46 + i * 28} y={130 - i * 22} width="22" height={30 + i * 22} rx="5" fill={i === 0 ? C.teal : C.navy} opacity={i === 0 ? 1 : 0.35 + i * 0.15} />
      ))}
      <path d="M44 84 L84 60 L112 76 L156 44" stroke={C.coral} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
