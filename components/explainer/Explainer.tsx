"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Beat, Option, Story } from "@/lib/story";
import { CallScene, HomeScene, type Mood } from "./art";
import { pop, ring } from "./sfx";

// STIL-TEST: nur die erste Szene bis nach der ersten Entscheidung.
// Der Ablauf steht hier noch fest im Code; für das ganze Video wandert er in
// die Story-Datei.

export type VoiceLine = { id: string; voice: string; text: string };

type Speaker = "narrator" | "brandt";

type Cue = {
  scene: "home" | "call";
  thought: "goal" | "bank" | null;
  ringing: boolean;
  youMood: Mood;
  brandtMood: Mood;
  talking: Speaker | null;
  caption: { who: Speaker; text: string } | null;
  bubble: string | null;
  table: string | null;
};

const START: Cue = {
  scene: "home",
  thought: null,
  ringing: false,
  youMood: "neutral",
  brandtMood: "happy",
  talking: null,
  caption: null,
  bubble: null,
  table: null,
};

const SPEAKER_LABEL: Record<Speaker, string> = {
  narrator: "Erzähler",
  brandt: "Frau Brandt",
};

type Phase = "poster" | "playing" | "end";

export default function Explainer({
  story,
  voice,
}: {
  story: Story;
  voice: VoiceLine[];
}) {
  const [phase, setPhase] = useState<Phase>("poster");
  const [cue, setCue] = useState<Cue>(START);
  const [ask, setAsk] = useState<{ options: Option[]; resolve: (o: Option) => void } | null>(null);

  const [runKey, setRunKey] = useState(0);

  const runId = useRef(0);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(
    () => () => {
      runId.current++;
      audio.current?.pause();
    },
    [],
  );

  const decision = story.beats.find(
    (b): b is Extract<Beat, { type: "decision" }> => b.type === "decision",
  )!;

  function wait(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  async function play() {
    const id = ++runId.current;
    const alive = () => runId.current === id;
    const set = (patch: Partial<Cue>) => alive() && setCue((c) => ({ ...c, ...patch }));

    // Spielt einen Sprecher-Satz ab und zeigt dazu den Untertitel.
    async function say(lineId: string) {
      const line = voice.find((l) => l.id === lineId)!;
      const who = line.voice as Speaker;
      set({ caption: { who, text: line.text }, talking: who });
      const played = await new Promise<boolean>((resolve) => {
        const clip = new Audio(`/audio/${lineId}.wav`);
        audio.current = clip;
        clip.onended = () => resolve(true);
        clip.onerror = () => resolve(false);
        clip.play().catch(() => resolve(false));
      });
      // Ohne Ton bleibt der Untertitel so lange stehen, wie man zum Lesen braucht.
      if (!played) await wait(1200 + line.text.length * 55);
      set({ talking: null });
      await wait(250);
    }

    audio.current?.pause();
    setAsk(null);
    setCue(START);
    setRunKey(id);
    setPhase("playing");

    await wait(1100);
    if (!alive()) return;
    await say("n1");
    if (!alive()) return;
    set({ thought: "goal", youMood: "happy" });
    pop();
    await say("n2a");
    if (!alive()) return;
    set({ thought: "bank", youMood: "worried" });
    pop();
    await say("n2b");
    if (!alive()) return;

    set({ thought: null, ringing: true, youMood: "surprised", caption: null });
    ring();
    await wait(900);
    await say("n3");
    if (!alive()) return;

    set({ scene: "call", ringing: false, youMood: "happy", caption: null });
    await wait(900);
    await say("b1");
    if (!alive()) return;
    set({ brandtMood: "neutral" });
    await say("b2");
    if (!alive()) return;
    set({ youMood: "worried" });
    await say("n4");
    if (!alive()) return;

    const option = await new Promise<Option>((resolve) =>
      setAsk({ options: decision.options, resolve }),
    );
    if (!alive()) return;
    setAsk(null);

    set({ caption: null, bubble: option.text, youMood: "neutral" });
    pop();
    await wait(2000);
    if (!alive()) return;
    set({
      bubble: null,
      table: option.table ?? null,
      brandtMood: option.id === "A" ? "surprised" : "happy",
    });
    await say(`${decision.id}${option.id}`);
    if (!alive()) return;
    await wait(1200);
    if (alive()) setPhase("end");
  }

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-[#1e294b]">
      <div className="relative aspect-video w-full max-w-[177.78dvh] overflow-clip bg-[#f6e7cf] text-[#33273b] [container-type:size]">
        <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full">
          {cue.scene === "home" ? (
            <HomeScene
              key={runKey}
              mood={cue.youMood}
              thought={cue.thought}
              ringing={cue.ringing}
            />
          ) : (
            <CallScene
              youMood={cue.youMood}
              brandtMood={cue.brandtMood}
              brandtTalking={cue.talking === "brandt"}
              bubble={cue.bubble}
            />
          )}
        </svg>

        {cue.table && phase === "playing" && <TableChip key={cue.table} text={cue.table} />}

        {cue.caption && phase === "playing" && !ask && (
          <div className="absolute inset-x-[10cqw] bottom-[3cqw] flex justify-center">
            <p className="rounded-[1.4cqw] bg-[#1e294b]/92 px-[2.2cqw] py-[1.1cqw] text-center text-[2.3cqw] font-semibold leading-[1.3] text-white shadow-xl">
              <span
                className={`mr-[0.9cqw] text-[1.4cqw] font-bold uppercase tracking-[0.15em] ${
                  cue.caption.who === "brandt" ? "text-[#f2a33a]" : "text-[#7fd6c8]"
                }`}
              >
                {SPEAKER_LABEL[cue.caption.who]}
              </span>
              {cue.caption.text}
            </p>
          </div>
        )}

        {ask && <Decision options={ask.options} onPick={ask.resolve} />}

        {phase === "poster" && (
          <Overlay>
            <p className="text-[1.5cqw] font-bold uppercase tracking-[0.3em] text-[#f2a33a]">
              Work · 3 Entscheidungen
            </p>
            <h1 className="text-[7cqw] font-black leading-none text-white">{story.title}</h1>
            <p className="text-[2.2cqw] text-white/75">Sie wollen dich. Jetzt geht es ums Geld.</p>
            <button
              onClick={play}
              aria-label="Abspielen"
              className="mt-[1cqw] flex h-[9cqw] w-[9cqw] items-center justify-center rounded-full bg-[#f2a33a] text-[#1e294b] hover:brightness-110"
            >
              <svg viewBox="0 0 24 24" className="ml-[0.5cqw] h-[4cqw] w-[4cqw]" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <p className="text-[1.4cqw] text-white/50">Mit Ton ansehen</p>
          </Overlay>
        )}

        {phase === "end" && (
          <Overlay>
            <p className="text-[1.5cqw] font-bold uppercase tracking-[0.3em] text-[#f2a33a]">
              Ende des Stil-Tests
            </p>
            <h2 className="text-[4.4cqw] font-black leading-tight text-white">
              Hier ginge es mit der Mail weiter.
            </h2>
            <button
              onClick={play}
              className="mt-[1cqw] rounded-full bg-[#f2a33a] px-[3.4cqw] py-[1.4cqw] text-[2cqw] font-bold text-[#1e294b] hover:brightness-110"
            >
              Nochmal ansehen
            </button>
          </Overlay>
        )}
      </div>
    </main>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[2cqw] bg-[#1e294b]/85 text-center backdrop-blur-sm">
      {children}
    </div>
  );
}

function TableChip({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [main, sub] = text.split(" · ");
  useGSAP(() => {
    gsap.from(ref.current, { y: "-150%", opacity: 0, duration: 0.5, ease: "back.out(1.6)" });
  });
  return (
    <div className="absolute inset-x-0 top-[2.4cqw] flex justify-center">
      <div
        ref={ref}
        className="rounded-[1.6cqw] bg-white px-[2.6cqw] py-[1cqw] text-center shadow-xl"
      >
        <p className="text-[1.1cqw] font-bold uppercase tracking-[0.25em] text-[#2b3a67]/60">
          Zahl auf dem Tisch
        </p>
        <p className="text-[3.2cqw] font-black leading-none text-[#2f9e8f]">{main}</p>
        {sub && <p className="mt-[0.3cqw] text-[1.2cqw] text-[#2b3a67]/70">{sub}</p>}
      </div>
    </div>
  );
}

function Decision({
  options,
  onPick,
}: {
  options: Option[];
  onPick: (option: Option) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<string | null>(null);
  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, duration: 0.3 });
      gsap.from(".card", {
        y: "60%",
        opacity: 0,
        duration: 0.45,
        stagger: 0.1,
        delay: 0.15,
        ease: "back.out(1.5)",
      });
    },
    { scope: ref },
  );

  function pick(option: Option) {
    if (picked) return;
    setPicked(option.id);
    pop();
    setTimeout(() => onPick(option), 500);
  }

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex flex-col items-center justify-end gap-[2cqw] bg-[#1e294b]/60 pb-[4cqw]"
    >
      <div className="text-center">
        <p className="flex items-center justify-center gap-[0.8cqw] text-[1.4cqw] font-bold uppercase tracking-[0.25em] text-[#f2a33a]">
          <span className="flex gap-[0.3cqw]">
            <span className="h-[1.4cqw] w-[0.45cqw] rounded-sm bg-[#f2a33a]" />
            <span className="h-[1.4cqw] w-[0.45cqw] rounded-sm bg-[#f2a33a]" />
          </span>
          Pause · Entscheidung 1 von 3
        </p>
        <p className="text-[4.4cqw] font-black text-white">Was sagst du?</p>
      </div>
      <div className="flex w-full items-stretch justify-center gap-[1.6cqw] px-[4cqw]">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => pick(option)}
            className={`card flex w-[28cqw] flex-col items-start gap-[1cqw] rounded-[1.8cqw] border-[0.3cqw] p-[2cqw] text-left shadow-2xl ${
              picked === option.id
                ? "border-[#f2a33a] bg-[#f2a33a] text-[#1e294b]"
                : picked
                  ? "border-transparent bg-white/40 text-[#1e294b]"
                  : "border-transparent bg-white text-[#1e294b] hover:border-[#f2a33a]"
            }`}
          >
            <span className="flex h-[3.4cqw] w-[3.4cqw] items-center justify-center rounded-full bg-[#1e294b] text-[1.7cqw] font-black text-white">
              {option.id}
            </span>
            <span className="text-[2.3cqw] font-bold leading-[1.2]">„{option.text}“</span>
          </button>
        ))}
      </div>
    </div>
  );
}
