"use client";

import { Brandt, C, Face, type Mood } from "@/components/explainer/art";
import { Krueger } from "@/components/explainer/office-art";
import type { Who } from "@/lib/aufstieg";

// Zeichnungen für „Der Aufstieg“. Bühne 1600 x 900, Figuren als Brustbild wie in den Filmen.

const SKIN = "#f1c6a0";
const SKIN_SHADE = "#e0ad84";
const HAIR = "#4a3328";

// Kleidung der Spielfigur je Stufe: 0 Praktikant … 4 CEO.
function Outfit({ rank }: { rank: number }) {
  if (rank === 0) {
    return (
      <>
        <path d="M-98 110 Q-104 36 0 28 Q104 36 98 110 Z" fill={C.tealDark} />
        <path d="M-132 440 Q-134 124 -46 100 L46 100 Q134 124 132 440 Z" fill={C.teal} />
        {/* Schlüsselband mit Ausweis */}
        <path d="M-30 104 L0 196 L30 104" stroke={C.orange} strokeWidth="9" fill="none" strokeLinejoin="round" />
        <rect x="-44" y="190" width="88" height="62" rx="8" fill={C.white} />
        <rect x="-44" y="190" width="88" height="18" rx="8" fill={C.coral} />
        <text x="0" y="234" textAnchor="middle" fontSize="15" fontWeight="900" fill={C.navyDark}>
          PRAKTIKANT
        </text>
      </>
    );
  }
  if (rank === 1) {
    return (
      <>
        <path d="M-132 440 Q-134 124 -46 100 L46 100 Q134 124 132 440 Z" fill="#bfe3f2" />
        <path d="M-46 100 L0 150 L-28 176 Z" fill={C.white} />
        <path d="M46 100 L0 150 L28 176 Z" fill={C.white} />
        <path d="M-8 150 L10 148 L26 250 L8 272 L-10 252 Z" fill={C.coral} transform="rotate(7 0 200)" />
      </>
    );
  }
  const suit = rank === 2 ? C.navy : rank === 3 ? "#3d4458" : "#141a30";
  const lapel = rank === 2 ? C.navyDark : rank === 3 ? "#2a3040" : "#000814";
  return (
    <>
      <path d="M-140 440 Q-142 124 -46 100 L46 100 Q142 124 140 440 Z" fill={suit} />
      <path d="M-34 100 L34 100 L0 176 Z" fill={C.white} />
      {rank >= 3 && <path d="M-10 118 L10 118 L16 200 L0 222 L-16 200 Z" fill={rank === 4 ? C.orange : C.coral} />}
      <path d="M-46 100 L0 176 L-24 214 L-72 118 Z" fill={lapel} />
      <path d="M46 100 L0 176 L24 214 L72 118 Z" fill={lapel} />
      {rank === 4 && <path d="M70 196 L104 190 L100 212 L74 216 Z" fill={C.orange} />}
    </>
  );
}

export function Worker({ rank, mood }: { rank: number; mood: Mood }) {
  return (
    <g>
      <g className="breathe">
        <Outfit rank={rank} />
      </g>
      <rect x="-20" y="58" width="40" height="54" rx="14" fill={SKIN_SHADE} />
      <circle cx="-78" cy="6" r="14" fill={SKIN} />
      <circle cx="78" cy="6" r="14" fill={SKIN} />
      <ellipse cx="0" cy="0" rx="78" ry="84" fill={SKIN} />
      <path
        d="M-86 -4 Q-100 -96 -24 -100 Q8 -122 40 -98 Q104 -88 86 0 Q74 -46 34 -56 Q-6 -36 -48 -58 Q-78 -44 -86 -4 Z"
        fill={HAIR}
      />
      <Face mood={mood} talking={false} />
    </g>
  );
}

// Richard von Thalberg, CEO: Kinn oben, Lider halb zu, Gold an allem, was sich vergolden lässt.
export function Ceo({ mood, talking }: { mood: Mood; talking: boolean }) {
  const skin = "#f0c9a8";
  const hair = "#e2c27a";
  return (
    <g transform="rotate(-6)">
      <g className="breathe">
        <path d="M-150 440 Q-152 124 -48 100 L48 100 Q152 124 150 440 Z" fill="#141a30" />
        <path d="M-34 100 L34 100 L0 176 Z" fill={C.white} />
        <path d="M-10 118 L10 118 L16 204 L0 226 L-16 204 Z" fill={C.orange} />
        <path d="M-48 100 L0 176 L-26 216 L-76 118 Z" fill="#000814" />
        <path d="M48 100 L0 176 L26 216 L76 118 Z" fill="#000814" />
        <path d="M74 196 L110 188 L106 214 L78 218 Z" fill={C.orange} />
      </g>
      <rect x="-20" y="58" width="40" height="54" rx="14" fill="#dcae8a" />
      <circle cx="-78" cy="6" r="14" fill={skin} />
      <circle cx="78" cy="6" r="14" fill={skin} />
      <ellipse cx="0" cy="0" rx="78" ry="84" fill={skin} />
      {/* Nach hinten gegelte Haare */}
      <path d="M-84 -10 Q-96 -104 -6 -108 Q96 -112 86 -8 Q70 -70 0 -72 Q-66 -70 -84 -10 Z" fill={hair} />
      <path d="M-58 -78 Q0 -100 62 -74" stroke="#c9a654" strokeWidth="5" fill="none" strokeLinecap="round" />
      <Face mood={mood} talking={talking} />
      {/* Gelangweilte Lider */}
      {mood !== "surprised" && (
        <g fill={skin}>
          <path d="M-48 -8 Q-30 -30 -12 -8 Z" />
          <path d="M12 -8 Q30 -30 48 -8 Z" />
        </g>
      )}
    </g>
  );
}

// Jonas aus der Buchhaltung.
export function Jonas({ mood, talking }: { mood: Mood; talking: boolean }) {
  const skin = "#f3cda8";
  return (
    <g>
      <g className="breathe">
        <path d="M-98 110 Q-104 36 0 28 Q104 36 98 110 Z" fill="#2f9c66" />
        <path d="M-132 440 Q-134 124 -46 100 L46 100 Q134 124 132 440 Z" fill="#3fbf7f" />
      </g>
      <rect x="-20" y="58" width="40" height="54" rx="14" fill="#e2b78d" />
      <circle cx="-78" cy="6" r="14" fill={skin} />
      <circle cx="78" cy="6" r="14" fill={skin} />
      <ellipse cx="0" cy="0" rx="78" ry="84" fill={skin} />
      <path d="M-86 -2 Q-98 -104 0 -106 Q98 -104 86 -2 Q58 -58 0 -50 Q-58 -58 -86 -2 Z" fill="#d9a441" />
      <Face mood={mood} talking={talking} />
    </g>
  );
}

function Npc({ who, mood, talking }: { who: Who; mood: Mood; talking: boolean }) {
  if (who === "ceo") return <Ceo mood={mood} talking={talking} />;
  if (who === "krueger") return <Krueger mood={mood} talking={talking} />;
  if (who === "brandt") return <Brandt mood={mood} talking={talking} />;
  if (who === "jonas") return <Jonas mood={mood} talking={talking} />;
  return null;
}

// Das Großraumbüro von NOVARA.
function Office() {
  return (
    <g>
      <rect width="1600" height="900" fill="#e6ecf3" />
      {/* Fensterfront */}
      <rect x="640" y="250" width="380" height="250" rx="14" fill={C.white} />
      <rect x="656" y="266" width="348" height="218" rx="6" fill="#bfe3f2" />
      <g fill="#9fc4d6">
        <rect x="680" y="370" width="60" height="114" />
        <rect x="752" y="330" width="52" height="154" />
        <rect x="826" y="396" width="80" height="88" />
        <rect x="924" y="350" width="60" height="134" />
      </g>
      <rect x="826" y="266" width="8" height="218" fill={C.white} />
      {/* Kopierer */}
      <rect x="60" y="500" width="200" height="240" rx="14" fill="#c9d3df" />
      <rect x="60" y="500" width="200" height="50" rx="14" fill="#aab6c5" />
      <rect x="90" y="580" width="140" height="14" rx="5" fill={C.white} />
      <circle cx="226" cy="524" r="8" fill={C.coral} />
      {/* Firmenschild */}
      <rect x="1310" y="250" width="220" height="70" rx="14" fill={C.navy} />
      <circle cx="1346" cy="285" r="14" fill={C.orange} />
      <text x="1438" y="296" textAnchor="middle" fontSize="28" fontWeight="900" fill={C.white} letterSpacing="2">
        NOVARA
      </text>
    </g>
  );
}

// Die Szene: links du, rechts die Person, mit der du es gerade zu tun hast.
// size (0 bis 1) kommt aus deinem Ansehen: Am Anfang bist du winzig.
export function GameScene({
  who,
  npcMood,
  npcTalking,
  youMood,
  rank,
  size,
  sceneKey,
}: {
  who: Who;
  npcMood: Mood;
  npcTalking: boolean;
  youMood: Mood;
  rank: number;
  size: number;
  sceneKey: string;
}) {
  const scale = 0.42 + 0.88 * Math.max(0, Math.min(1, size));
  const ceo = who === "ceo";
  return (
    <g>
      <Office />
      <g
        style={{
          transform: `translate(430px, ${730 - 230 * scale}px) scale(${scale})`,
          transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <Worker rank={rank} mood={youMood} />
      </g>
      {who !== "erzaehler" && (
        <g transform={ceo ? "translate(1110 424) scale(1.6)" : "translate(1110 430) scale(1.3)"}>
          <g key={sceneKey} className="npc-in">
            <Npc who={who} mood={npcMood} talking={npcTalking} />
          </g>
        </g>
      )}
      {/* Schreibtisch im Vordergrund */}
      <rect y="730" width="1600" height="170" fill={C.wood} />
      <rect y="730" width="1600" height="20" fill="#cda070" />
    </g>
  );
}

// Kleines Brustbild für die Karriereleiter.
export function RankAvatar({ rank, className }: { rank: number; className?: string }) {
  return (
    <svg viewBox="-150 -130 300 400" className={className} aria-hidden="true">
      <Worker rank={rank} mood={rank === 0 ? "worried" : "happy"} />
    </svg>
  );
}

export function CeoAvatar({ className }: { className?: string }) {
  return (
    <svg viewBox="-170 -140 340 400" className={className} aria-hidden="true">
      <Ceo mood="neutral" talking={false} />
    </svg>
  );
}
