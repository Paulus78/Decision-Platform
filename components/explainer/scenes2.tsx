"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { C, You, type Mood } from "./art";

export type Mail = { subject: string; paragraphs: string[] };

const AMOUNT = /(\d{1,3}\.\d{3} €|\d{3} €|12 Uhr)/;

// Hebt Beträge und die Frist im Mailtext hervor.
function Marked({ text }: { text: string }) {
  return (
    <>
      {text.split(AMOUNT).map((part, i) =>
        AMOUNT.test(part) ? (
          <strong
            key={i}
            style={{
              background: "#ffe9a8",
              borderRadius: 8,
              padding: "0 8px",
              whiteSpace: "nowrap",
            }}
          >
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Paragraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { opacity: 0, y: 24, duration: 0.45, ease: "power2.out" });
  });
  return (
    <p ref={ref} style={{ margin: "0 0 22px", fontSize: 36, lineHeight: 1.35 }}>
      <Marked text={text} />
    </p>
  );
}

function Reply({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { opacity: 0, y: 60, scale: 0.9, duration: 0.45, ease: "back.out(1.6)" });
  });
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        right: 28,
        bottom: 26,
        maxWidth: 640,
        background: C.teal,
        color: "#fff",
        borderRadius: 28,
        padding: "20px 30px",
        boxShadow: "0 16px 40px rgba(30,41,75,0.3)",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, opacity: 0.8 }}>
        DEINE ANTWORT
      </div>
      <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.2 }}>{text}</div>
    </div>
  );
}

// Du am Schreibtisch, rechts groß der Bildschirm mit der Mail.
export function MailScene({
  night,
  mail,
  reply,
  stamp,
  mood,
}: {
  night: boolean;
  mail: Mail | null;
  reply: string | null;
  stamp: boolean;
  mood: Mood;
}) {
  const ref = useRef<SVGGElement>(null);
  useGSAP(
    () => {
      gsap.from(".monitor", { y: 700, duration: 0.6, ease: "back.out(1.2)" });
      gsap.from(".me", { x: -500, duration: 0.5, ease: "power3.out" });
    },
    { scope: ref },
  );
  return (
    <g ref={ref}>
      <rect width="1600" height="900" fill={night ? "#2c3360" : C.wall} />

      {/* Fenster: Tag oder Nacht */}
      <rect x="60" y="70" width="230" height="250" rx="14" fill={C.white} />
      <rect x="74" y="84" width="202" height="222" rx="6" fill={night ? "#161b3a" : "#bfe3f2"} />
      {night ? (
        <>
          <circle cx="222" cy="142" r="26" fill="#f6efc8" />
          <circle cx="234" cy="134" r="22" fill="#161b3a" />
          <circle cx="120" cy="130" r="3" fill="#fff" />
          <circle cx="150" cy="200" r="3" fill="#fff" />
          <circle cx="220" cy="240" r="3" fill="#fff" />
        </>
      ) : (
        <circle cx="226" cy="140" r="26" fill="#ffd66b" />
      )}

      <g className="me">
        <g transform="translate(300 540) scale(1.2)">
          <You pose="sit" mood={mood} long />
        </g>
      </g>

      {/* Schreibtisch */}
      <rect y="800" width="1600" height="100" fill={C.wood} />
      <rect y="800" width="1600" height="18" fill="#cda070" />

      <g className="monitor">
        <rect x="990" y="720" width="100" height="70" fill="#3d4458" />
        <rect x="880" y="778" width="320" height="26" rx="13" fill="#3d4458" />
        <rect x="560" y="150" width="980" height="590" rx="30" fill={C.navyDark} />
        <rect x="582" y="172" width="936" height="546" rx="12" fill={C.white} />
        <foreignObject x="582" y="172" width="936" height="546">
          <div
            style={{
              position: "relative",
              width: 936,
              height: 546,
              color: C.ink,
              overflow: "hidden",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                height: 54,
                padding: "0 22px",
                background: "#eef1f6",
                fontSize: 22,
                fontWeight: 700,
                color: "#7a8399",
              }}
            >
              <span style={{ width: 14, height: 14, borderRadius: 7, background: C.coral }} />
              <span style={{ width: 14, height: 14, borderRadius: 7, background: C.orange }} />
              <span style={{ width: 14, height: 14, borderRadius: 7, background: "#3fbf7f" }} />
              <span style={{ marginLeft: 14 }}>Posteingang</span>
            </div>
            {mail && (
              <div style={{ padding: "26px 34px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                      background: C.navy,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 34,
                      fontWeight: 900,
                    }}
                  >
                    B
                  </div>
                  <div>
                    <div style={{ fontSize: 30, fontWeight: 800 }}>Frau Brandt · Novara GmbH</div>
                    <div style={{ fontSize: 24, opacity: 0.6 }}>{mail.subject}</div>
                  </div>
                </div>
                <div style={{ height: 3, background: "#eef1f6", marginBottom: 24 }} />
                {mail.paragraphs.map((text) => (
                  <Paragraph key={text} text={text} />
                ))}
              </div>
            )}
            {reply && <Reply key={reply} text={reply} />}
          </div>
        </foreignObject>
      </g>

      {stamp && <Deadline />}
    </g>
  );
}

// Wecker, der bei der Frist aufploppt.
function Deadline() {
  const ref = useRef<SVGGElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      scale: 0,
      svgOrigin: "1490 190",
      duration: 0.5,
      delay: 1.2,
      ease: "back.out(2.2)",
    });
  });
  return (
    <g ref={ref}>
      <g transform="translate(1490 190)">
        <g className="ring">
          <circle cx="-52" cy="-58" r="24" fill={C.coralDark} />
          <circle cx="52" cy="-58" r="24" fill={C.coralDark} />
          <circle r="78" fill={C.coral} />
          <circle r="60" fill={C.white} />
          <path d="M0 0 L0 -40" stroke={C.ink} strokeWidth="8" strokeLinecap="round" />
          <path d="M0 0 L24 14" stroke={C.ink} strokeWidth="8" strokeLinecap="round" />
          <circle r="7" fill={C.ink} />
        </g>
      </g>
    </g>
  );
}

// Jonas: nur als kleines Chat-Gesicht.
export function JonasFace() {
  return (
    <svg viewBox="-100 -100 200 200" className="h-full w-full">
      <circle r="100" fill="#3fbf7f" />
      <ellipse cx="0" cy="8" rx="62" ry="68" fill="#f3cda8" />
      <path d="M-66 -6 Q-74 -80 0 -82 Q74 -80 66 -6 Q40 -46 0 -40 Q-40 -46 -66 -6 Z" fill="#d9a441" />
      <circle cx="-24" cy="2" r="8" fill={C.ink} />
      <circle cx="24" cy="2" r="8" fill={C.ink} />
      <path d="M-26 34 Q0 62 26 34 Z" fill={C.mouth} />
    </svg>
  );
}

// Kleine Bilder für die drei Erklär-Karten.
export function RevealIcon({ kind }: { kind: number }) {
  if (kind === 0) {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#dcebf2" />
        <g fill="none" stroke={C.navy} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="100" cy="46" r="15" />
          <path d="M100 62 L100 156" />
          <path d="M70 86 L130 86" />
          <path d="M44 114 Q48 158 100 158 Q152 158 156 114" />
          <path d="M34 128 L44 112 L60 124" />
          <path d="M166 128 L156 112 L140 124" />
        </g>
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="96" fill="#fde2b5" />
        <rect x="34" y="96" width="132" height="14" rx="7" fill={C.navy} opacity="0.35" />
        <circle cx="40" cy="103" r="20" fill={C.coral} />
        <circle cx="160" cy="103" r="13" fill={C.navy} opacity="0.5" />
        <text x="40" y="66" textAnchor="middle" fontSize="34" fontWeight="900" fill={C.coral}>
          50
        </text>
        <text x="160" y="70" textAnchor="middle" fontSize="26" fontWeight="800" fill={C.navy} opacity="0.5">
          56
        </text>
        <path d="M40 160 L40 134 M28 146 L40 132 L52 146" stroke={C.coral} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
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
