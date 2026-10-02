import type { CSSProperties } from "react";

type PersonProps = {
  who: "you" | "alex";
  x: number;
  y: number;
  scale?: number;
  speaking?: boolean;
  mood?: string;
};
function Person({ who, x, y, scale = 1, speaking, mood }: PersonProps) {
  const seller = who === "you";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} data-person={who}>
      <ellipse cx="0" cy="186" rx="62" ry="12" fill="#253b5020" stroke="none" />
      <g data-body={who}>
        <path
          d="M-34 50 L-38 170 L-10 170 L2 76 L13 170 L42 170 L33 49"
          fill={seller ? "#344259" : "#284e53"}
        />
        <path
          d="M-40 170 Q-54 175-56 185 L-9 185 L-9 170 M13 170 L13 185 L62 185 Q59 173 40 170"
          fill="#243047"
        />
        <path
          d="M-27-67 Q-61-60-65-28 L-47 61 Q0 73 48 60 L66-28 Q62-59 26-67Z"
          fill={seller ? "#f5c65b" : "#de765d"}
        />
        <path d="M-17-66 L0 1 L18-66" fill={seller ? "#466f76" : "#faf0d8"} />
        <path
          d="M0 0 L0 63 M-39 31 L-21 31 M21 31 L39 31"
          fill="none"
          strokeWidth="2"
          opacity=".5"
        />
        <path
          data-arm={who}
          d={
            seller ? "M-58-37 Q-77 4-60 36 L-27 14" : "M57-34 Q79 3 58 25 L25 1"
          }
          fill="none"
          stroke={seller ? "#f5c65b" : "#de765d"}
          strokeWidth="25"
          strokeLinecap="round"
        />
        <path
          d={
            seller
              ? "M-28 15 L-14 8 Q-7 7-9 15 L-18 26 L-27 23"
              : "M25 1 L14-6 Q5-8 9 3 L18 13 L27 11"
          }
          fill="#e8b08e"
        />
        <path
          d={seller ? "M55-31 Q67 7 59 40" : "M-55-32 Q-70 4-61 40"}
          fill="none"
          stroke={seller ? "#f5c65b" : "#de765d"}
          strokeWidth="24"
          strokeLinecap="round"
        />
        <ellipse
          cx={seller ? 59 : -61}
          cy="46"
          rx="11"
          ry="15"
          fill="#e8b08e"
        />
        <path d="M-15-91 L-15-64 Q0-49 16-64 L16-91" fill="#dfa180" />
        <ellipse cx="0" cy="-125" rx="43" ry="51" fill="#ebba98" />
        <ellipse cx="-42" cy="-120" rx="7" ry="12" fill="#ebba98" />
        <ellipse cx="42" cy="-120" rx="7" ry="12" fill="#ebba98" />
        {seller ? (
          <path
            d="M-40-126 Q-52-178-14-182 Q1-202 28-179 Q54-169 39-129 L28-157 Q-1-140-29-157 L-33-125Z"
            fill="#36414e"
          />
        ) : (
          <>
            <path
              d="M-41-133 Q-47-176-9-179 Q28-183 40-153 L38-132 L25-155 Q-5-164-28-150 L-32-131Z"
              fill="#584334"
            />
            <path
              d="M-30-101 Q0-71 30-101 Q24-78 0-75 Q-26-81-30-101"
              fill="#8a644e"
              stroke="none"
            />
          </>
        )}
        <g data-eyes={who}>
          <path
            d="M-23-135 Q-15-140-7-135 M9-135 Q18-141 26-133"
            fill="none"
            strokeWidth="3"
          />
          <ellipse cx="-15" cy="-124" rx="3" ry="4" fill="#253047" />
          <ellipse cx="17" cy="-124" rx="3" ry="4" fill="#253047" />
        </g>
        <path d="M2-121 L-2-108 L5-106" fill="none" strokeWidth="2" />
        {speaking ? (
          <ellipse data-mouth="" cx="2" cy="-96" rx="9" ry="6" fill="#6a3b37" />
        ) : (
          <path
            d={mood === "leave" ? "M-9-94 Q2-98 12-94" : "M-10-98 Q1-89 12-98"}
            fill="none"
            strokeWidth="3"
          />
        )}
        {seller && (
          <g transform="translate(61 48) rotate(-12)">
            <circle r="7" fill="#f2d58b" />
            <path
              d="M0 7 L0 29 L8 29 L8 22 L0 22"
              fill="none"
              strokeWidth="4"
            />
          </g>
        )}
      </g>
    </g>
  );
}
export function Car({
  x = 360,
  y = 395,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <g data-car="" transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse
        cx="250"
        cy="149"
        rx="270"
        ry="23"
        fill="#283e5020"
        stroke="none"
      />
      <path
        d="M-12 86 L14 35 L95 22 L163-49 Q172-58 192-58 L336-58 Q350-57 362-39 L411 27 L480 44 Q503 50 508 75 L508 112 Q504 128 484 128 L13 128 Q-13 127-12 108Z"
        fill="#578bba"
      />
      <path
        d="M119 24 L178-36 Q184-42 199-42 L253-42 L253 24Z M269-42 L334-42 Q341-40 350-26 L386 24 L269 24Z"
        fill="#d3e3dd"
      />
      <path
        d="M135 23 L185-29 L236-29"
        fill="none"
        stroke="#f8f5e3"
        strokeWidth="5"
      />
      <path
        d="M263 32 L263 111 M110 34 L102 90 M393 35 L403 105"
        fill="none"
        opacity=".5"
      />
      <path
        d="M213 43 L238 43 M346 43 L367 43"
        stroke="#263d55"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M-8 78 L34 78 L38 99 L-10 99" fill="#ecbe5b" />
      <path d="M481 63 L504 68 L506 90 L481 89Z" fill="#f4e8c8" />
      <path d="M39 117 L469 117" stroke="#355570" strokeWidth="8" />
      {[91, 417].map((cx) => (
        <g
          key={cx}
          data-wheel=""
          style={{ transformOrigin: `${cx}px 124px` } as CSSProperties}
        >
          <circle cx={cx} cy="124" r="42" fill="#283347" />
          <circle cx={cx} cy="124" r="24" fill="#c7d1cd" />
          <path
            d={`M${cx - 18} 124 H${cx + 18} M${cx} 106 V142`}
            stroke="#6d8092"
            strokeWidth="5"
          />
          <circle cx={cx} cy="124" r="7" fill="#536c80" />
        </g>
      ))}
      <rect x="477" y="104" width="28" height="9" rx="2" fill="#f4f0df" />
      <path
        d="M73 58 Q123 49 185 56"
        fill="none"
        stroke="#84aac9"
        strokeWidth="4"
      />
    </g>
  );
}
function Phone({ message = false }: { message?: boolean }) {
  return (
    <g data-pop="" transform="translate(820 148) rotate(6)">
      <rect x="0" y="0" width="235" height="350" rx="25" fill="#25354a" />
      <rect x="10" y="12" width="215" height="323" rx="17" fill="#fffaf0" />
      <path
        d="M77 16 H157"
        stroke="#25354a"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <text x="26" y="63" fontSize="15" fill="#75837f" stroke="none">
        {message ? "ANDERE INTERESSENTIN" : "ANDERE ANZEIGE"}
      </text>
      {message ? (
        <>
          <rect
            x="23"
            y="94"
            width="188"
            height="132"
            rx="15"
            fill="#dce9dd"
            stroke="none"
          />
          <text x="38" y="126" fontSize="21" stroke="none" fill="#294153">
            <tspan x="38">Vielleicht morgen?</tspan>
            <tspan x="38" dy="35">
              Melde mich noch 🙂
            </tspan>
          </text>
          <text x="26" y="292" fontSize="15" stroke="none" fill="#808882">
            Kein Termin bestätigt
          </text>
        </>
      ) : (
        <>
          <rect
            x="23"
            y="88"
            width="188"
            height="96"
            rx="8"
            fill="#dae5e5"
            stroke="none"
          />
          <g transform="translate(28 105) scale(.34)">
            <Car x={0} y={0} />
          </g>
          <text
            x="25"
            y="228"
            fontSize="37"
            stroke="none"
            fill="#24364a"
            fontWeight="800"
          >
            6.200 €
          </text>
          <text x="25" y="260" fontSize="18" stroke="none" fill="#566d73">
            Baujahr 2016
          </text>
          <text x="25" y="290" fontSize="18" stroke="none" fill="#566d73">
            155.000 km
          </text>
        </>
      )}
    </g>
  );
}
export default function Art({
  scene,
  speaker,
  playing,
  offer,
}: {
  scene: string;
  speaker: string;
  playing: boolean;
  offer: number;
}) {
  const close = scene === "you" || scene === "alex";
  const absent = scene === "empty" || scene === "listing";
  return (
    <svg
      viewBox="0 0 1280 720"
      role="img"
      aria-label={`Gezeichnete Szene: ${scene === "drive" ? "Probefahrt" : "Autoverkauf auf einem Parkplatz"}`}
      data-playing={playing}
    >
      <defs>
        <linearGradient id="codex-sky" x2="0" y2="1">
          <stop stopColor="#e4eddf" />
          <stop offset="1" stopColor="#f5f0da" />
        </linearGradient>
        <pattern
          id="codex-paper"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="3" r=".6" fill="#536445" opacity=".07" />
        </pattern>
      </defs>
      <rect width="1280" height="720" fill="url(#codex-sky)" />
      <circle cx="1027" cy="127" r="60" fill="#edca76" />
      <g data-scenery="" fill="#ccdbc9">
        <path d="M0 280 L0 203 L46 203 L46 183 L151 183 L151 251 L208 251 L208 142 L302 142 L302 181 L382 181 L382 296Z" />
        <path d="M721 302 V214 H766 V176 H840 V228 H940 V196 H1023 V150 H1150 V228 H1280 V304Z" />
      </g>
      <g fill="#758e73" stroke="#637e68" strokeWidth="3">
        <path d="M75 398 V280 M1213 396 V279" />
        <path d="M74 305 Q-15 308 11 252 Q-6 196 53 193 Q70 148 111 180 Q165 173 172 223 Q208 272 158 300Z" />
        <path d="M1213 305 Q1140 306 1151 251 Q1126 218 1169 196 Q1182 153 1223 173 Q1272 175 1280 220 V302Z" />
      </g>
      <path d="M0 348 Q483 327 1280 359 V720 H0Z" fill="#d9dfd5" />
      <path
        d="M0 439 L1280 439 M0 647 L1280 647"
        stroke="#f8f4e6"
        strokeWidth="7"
      />
      <path
        d="M64 719 L306 438 M510 719 L622 438 M920 719 L932 438"
        stroke="#f8f4e6"
        strokeWidth="7"
      />
      <rect width="1280" height="720" fill="url(#codex-paper)" />
      <g
        stroke="#28394b"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {scene === "drive" ? (
          <>
            <g data-road="" stroke="#f8f5e7" strokeWidth="7">
              <path d="M50 585 H260 M470 585 H680 M890 585 H1100" />
            </g>
            <Car x={347} y={370} />
            <g data-pop="" transform="translate(880 200)">
              <path
                d="M0 13 Q10-11 31 8 Q49-11 58 13 Q46 32 28 46Z"
                fill="#e99c74"
              />
              <path d="M82 0 V44 M82 2 L102-5 V30" fill="none" />
              <circle cx="74" cy="47" r="8" fill="#34586d" />
              <circle cx="95" cy="32" r="8" fill="#34586d" />
            </g>
          </>
        ) : (
          <>
            <Car x={close ? 620 : 360} y={395} scale={close ? 0.85 : 1} />
            {!absent && (
              <Person
                who="you"
                x={close && scene === "you" ? 430 : 270}
                y={close ? 438 : 386}
                scale={close && scene === "you" ? 1.6 : 1}
                speaking={playing && speaker === "you"}
              />
            )}
            {!absent && scene !== "leave" && (
              <Person
                who="alex"
                x={close && scene === "alex" ? 850 : 1040}
                y={close ? 438 : 386}
                scale={close && scene === "alex" ? 1.6 : 1}
                speaking={playing && speaker === "alex"}
              />
            )}
            {scene === "leave" && (
              <g data-depart="">
                <Person who="alex" x={1100} y={386} mood="leave" />
              </g>
            )}
          </>
        )}
        {(scene === "listing" || scene === "arrival") && (
          <g data-pop="" transform="translate(165 124) rotate(-4)">
            <rect width="360" height="215" rx="10" fill="#fffaf0" />
            <path d="M0 41 H360" stroke="#dbc8a5" />
            <text
              x="22"
              y="29"
              stroke="none"
              fill="#7c857d"
              fontSize="16"
              letterSpacing="2"
            >
              DEIN INSERAT · SEIT 3 WOCHEN
            </text>
            <text
              x="22"
              y="106"
              stroke="none"
              fill="#28394b"
              fontSize="50"
              fontWeight="850"
            >
              6.800 € VB
            </text>
            <text x="22" y="146" stroke="none" fill="#556b73" fontSize="21">
              2016 · 115.000 km · Service neu
            </text>
            <text x="22" y="188" stroke="none" fill="#9e5c44" fontSize="19">
              Dein Wunsch: 6.500 €
            </text>
          </g>
        )}
        {(scene === "phone" || scene === "message") && (
          <Phone message={scene === "message"} />
        )}
        {scene === "compare" && (
          <g data-pop="" transform="translate(337 123)">
            <rect width="600" height="194" rx="12" fill="#fffaf0" />
            <path d="M300 25 V174" stroke="#d7ddcd" strokeWidth="2" />
            <text
              x="30"
              y="39"
              stroke="none"
              fill="#527d98"
              fontSize="18"
              fontWeight="700"
            >
              DEIN AUTO
            </text>
            <text
              x="328"
              y="39"
              stroke="none"
              fill="#a2634f"
              fontSize="18"
              fontWeight="700"
            >
              DIE ANDERE ANZEIGE
            </text>
            <text
              x="30"
              y="97"
              stroke="none"
              fill="#28394b"
              fontSize="37"
              fontWeight="800"
            >
              115.000 km
            </text>
            <text
              x="328"
              y="97"
              stroke="none"
              fill="#28394b"
              fontSize="37"
              fontWeight="800"
            >
              155.000 km
            </text>
            <text x="30" y="146" stroke="none" fill="#586d72" fontSize="20">
              Inspektion erledigt ✓
            </text>
            <text x="328" y="146" stroke="none" fill="#586d72" fontSize="20">
              Service unklar
            </text>
            <text x="30" y="175" stroke="none" fill="#9e5c44" fontSize="17">
              Reifen bald fällig
            </text>
          </g>
        )}
        {scene === "tire" && (
          <g data-pop="" transform="translate(718 226)">
            <circle r="87" fill="#fff9e9" />
            <circle r="62" fill="#334151" />
            <circle r="35" fill="#c9d4cf" />
            <path
              d="M-49-30 L-35-20 M-49 0 L-35 0 M-49 30 L-35 20 M49-30 L35-20 M49 0 L35 0 M49 30 L35 20"
              stroke="#71838b"
              strokeWidth="6"
            />
            <path d="M-53 74 L-79 112" stroke="#28394b" strokeWidth="7" />
            <text x="-145" y="-110" fontSize="20" fill="#8c5e45" stroke="none">
              Bald ein neuer Satz nötig
            </text>
          </g>
        )}
        {scene === "receipt" && (
          <g data-pop="" transform="translate(543 133) rotate(5)">
            <path
              d="M0 0 H245 V196 L229 187 L211 196 L193 187 L175 196 L157 187 L139 196 L121 187 L103 196 L85 187 L67 196 L49 187 L31 196 L14 187 L0 196Z"
              fill="#fff9ea"
            />
            <text x="21" y="43" fontSize="21" fill="#2b4458" stroke="none">
              INSPEKTION ✓
            </text>
            <path
              d="M22 65 H221 M22 91 H150 M22 111 H190 M22 131 H171"
              stroke="#adc0b6"
              strokeWidth="4"
            />
            <text x="23" y="168" fontSize="17" fill="#678277" stroke="none">
              Vor 3 Wochen erledigt
            </text>
          </g>
        )}
        {scene === "watch" && (
          <g data-pop="" transform="translate(671 230)">
            <circle r="81" fill="#fff9e9" />
            <circle r="67" fill="#e5ecdf" />
            <path d="M0-50 V0 L36 19" fill="none" strokeWidth="6" />
            <circle r="5" fill="#344456" />
            <text x="-87" y="-105" fontSize="20" fill="#8c5e45" stroke="none">
              Die Tochter wartet.
            </text>
          </g>
        )}
        {scene === "anchor" && (
          <g data-pop="" transform="translate(651 224)">
            <circle r="100" fill="#fff9e9" stroke="none" />
            <circle cy="-58" r="13" fill="none" strokeWidth="7" />
            <path
              d="M0-43 V62 M-36-14 H36 M-64 22 Q-57 65 0 65 Q57 65 64 22 M-64 22 L-68 45 M64 22 L68 45"
              fill="none"
              strokeWidth="9"
            />
            <text
              x="-170"
              y="-131"
              fontSize="31"
              fill="#28394b"
              stroke="none"
              fontWeight="800"
            >
              5.800 € → dein Blick
            </text>
          </g>
        )}
        {scene === "handshake" && (
          <g data-pop="" transform="translate(583 175)">
            <circle cx="50" cy="39" r="65" fill="#dfeace" stroke="none" />
            <path
              d="M18 37 L42 60 L82 17"
              stroke="#63896b"
              strokeWidth="9"
              fill="none"
            />
            <text
              x="-60"
              y="143"
              fontSize="28"
              fill="#344e59"
              stroke="none"
              fontWeight="800"
            >
              Abgemacht.
            </text>
          </g>
        )}
      </g>
      {!absent && scene !== "drive" && (
        <g data-price="" transform="translate(535 374)">
          <rect
            width="210"
            height="56"
            rx="10"
            fill="#fff9ee"
            stroke="#526c7d"
            strokeWidth="2"
          />
          <text
            x="105"
            y="36"
            textAnchor="middle"
            fontSize="29"
            fontWeight="800"
            fill="#2e475a"
          >
            {new Intl.NumberFormat("de-DE").format(offer)} €
          </text>
        </g>
      )}
    </svg>
  );
}
