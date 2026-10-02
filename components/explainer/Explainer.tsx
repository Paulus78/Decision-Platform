"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  advance,
  choose,
  euro,
  fill,
  initialState,
  pickEnding,
  type LogEntry,
  type State,
} from "@/lib/engine";
import type { Beat, Ending, Option, Story } from "@/lib/story";
import audioManifest from "@/stories/gehaltsangebot.audio.json";
import { CallScene, HomeScene, type Mood } from "./art";
import { JonasFace, MailScene, RevealIcon, type Mail } from "./scenes2";
import { pop, ring } from "./sfx";

export type VoiceLine = { id: string; voice: string; text: string };

// Welche Sätze schon eine Audiodatei haben. Fehlt eine, bleibt der Untertitel
// so lange stehen, wie man zum Lesen braucht.
const AUDIO = audioManifest as Record<string, string>;

type DecisionBeat = Extract<Beat, { type: "decision" }>;
type Speaker = "narrator" | "brandt";
type View = "home" | "call" | "mail" | "result" | "reveal" | "strong";

type Cue = {
  view: View;
  night: boolean;
  thought: "goal" | "bank" | null;
  ringing: boolean;
  youMood: Mood;
  brandtMood: Mood;
  talking: Speaker | null;
  caption: { who: Speaker; text: string } | null;
  bubble: string | null;
  mail: Mail | null;
  reply: string | null;
  stamp: boolean;
  jonas: { text: string; n: number } | null;
  title: { title: string; time: string } | null;
  hud: State;
  revealStep: number;
  ending: Ending | null;
};

const START: Cue = {
  view: "home",
  night: false,
  thought: null,
  ringing: false,
  youMood: "neutral",
  brandtMood: "happy",
  talking: null,
  caption: null,
  bubble: null,
  mail: null,
  reply: null,
  stamp: false,
  jonas: null,
  title: null,
  hud: initialState,
  revealStep: 0,
  ending: null,
};

const SPEAKER_LABEL: Record<Speaker, string> = {
  narrator: "Erzähler",
  brandt: "Frau Brandt",
};

type Phase = "poster" | "playing" | "end";
type Ask = { beat: DecisionBeat; number: number; state: State; resolve: (o: Option) => void };

export default function Explainer({ story, voice }: { story: Story; voice: VoiceLine[] }) {
  const [phase, setPhase] = useState<Phase>("poster");
  const [cue, setCue] = useState<Cue>(START);
  const [ask, setAsk] = useState<Ask | null>(null);
  const [runKey, setRunKey] = useState(0);

  // Jeder Durchlauf bekommt eine Nummer. Ein alter Durchlauf merkt daran,
  // dass er abgelöst wurde, und hört auf.
  const runId = useRef(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const skip = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      runId.current++;
      audio.current?.pause();
    },
    [],
  );

  const decisions = story.beats.filter((b): b is DecisionBeat => b.type === "decision");

  // Wartet. Ein Klick aufs Bild springt sofort weiter.
  function wait(ms: number) {
    return new Promise<void>((resolve) => {
      const timer = setTimeout(done, ms);
      function done() {
        clearTimeout(timer);
        skip.current = null;
        resolve();
      }
      skip.current = done;
    });
  }

  function playFile(file: string) {
    return new Promise<void>((resolve) => {
      const clip = new Audio(`/audio/${file}`);
      audio.current = clip;
      function done() {
        clip.pause();
        skip.current = null;
        resolve();
      }
      clip.onended = done;
      clip.onerror = done;
      skip.current = done;
      clip.play().catch(done);
    });
  }

  async function play() {
    const id = ++runId.current;
    const alive = () => runId.current === id;
    const set = (patch: Partial<Cue>) => alive() && setCue((c) => ({ ...c, ...patch }));
    let n = 0;

    // Spielt einen Sprecher-Satz ab und zeigt dazu den Untertitel.
    async function say(voiceId: string | undefined, text?: string, who?: Speaker) {
      if (!alive()) return;
      const line = voice.find((l) => l.id === voiceId);
      const caption = text ?? line?.text ?? "";
      const speaker = who ?? (line?.voice as Speaker | undefined) ?? "narrator";
      set({ caption: { who: speaker, text: caption }, talking: speaker });
      const file = voiceId ? AUDIO[voiceId] : undefined;
      if (file) await playFile(file);
      else await wait(1300 + caption.length * 55);
      set({ talking: null });
      await wait(250);
    }

    audio.current?.pause();
    setAsk(null);
    setCue(START);
    setRunKey(id);
    setPhase("playing");

    // --- Intro ---
    await wait(1100);
    await say("n1");
    set({ thought: "goal", youMood: "happy" });
    pop();
    await say("n2a");
    set({ thought: "bank", youMood: "worried" });
    pop();
    await say("n2b");
    if (!alive()) return;
    set({ thought: null, ringing: true, youMood: "surprised", caption: null });
    ring();
    await wait(900);
    await say("n3");
    if (!alive()) return;
    set({ view: "call", ringing: false, youMood: "happy", caption: null });
    await wait(900);

    // --- Story aus der Story-Datei ---
    let state = initialState;
    let hud = initialState;
    let index = 0;
    let firstScene = true;
    let lastChannel = "call";
    let night = false;
    let mail: Mail | null = null;
    let mailOpen = false;

    function setHud(next: State) {
      hud = next;
      set({ hud });
    }

    async function show(entries: LogEntry[], st: State) {
      for (const entry of entries) {
        if (!alive()) return;
        if (entry.kind === "table") {
          setHud({ ...st, table: entry.table });
          continue;
        }
        if (entry.kind === "scene") {
          // Die erste Szene (der Anruf) hat schon das Intro eingeleitet.
          if (firstScene) {
            firstScene = false;
            continue;
          }
          set({ title: { title: entry.title, time: entry.time }, caption: null, jonas: null });
          if (entry.voice) await say(entry.voice);
          else await wait(1800);
          night = Boolean(entry.night);
          mail = null;
          mailOpen = false;
          lastChannel = "mail";
          set({
            title: null,
            caption: null,
            view: "mail",
            night,
            mail: null,
            reply: null,
            stamp: false,
            youMood: night ? "worried" : "neutral",
          });
          await wait(700);
          continue;
        }

        const { line } = entry;
        if (line.channel === "chat") {
          mailOpen = false;
          set({ caption: null, jonas: { text: line.text, n: ++n } });
          pop();
          await wait(3200);
          set({ jonas: null });
          continue;
        }
        if (line.from === "du") {
          mailOpen = false;
          pop();
          if (lastChannel === "call") {
            set({ caption: null, bubble: line.text, youMood: "neutral" });
            await wait(2000);
            set({ bubble: null });
          } else {
            set({ caption: null, reply: line.text });
            await wait(2400);
          }
          continue;
        }

        // Frau Brandt
        const voiceId = line.voice?.replace(/\{(\w+)\}/g, (_, key) => st.choices[key] ?? "");
        if (line.channel === "call") {
          if (lastChannel !== "call") {
            night = false;
            set({
              view: "call",
              night,
              caption: null,
              reply: null,
              youMood: "surprised",
              brandtMood: "happy",
            });
            ring();
            await wait(1300);
          }
          lastChannel = "call";
          mailOpen = false;
          await say(voiceId, line.text, "brandt");
        } else {
          lastChannel = "mail";
          const open: Mail | null = mailOpen ? mail : null;
          mail = open
            ? { ...open, paragraphs: [...open.paragraphs, line.text] }
            : { subject: line.subject ?? "Re: Ihr Angebot", paragraphs: [line.text] };
          mailOpen = true;
          set({ view: "mail", night, mail, reply: null, stamp: night });
          pop();
          await say(voiceId, line.text, "brandt");
        }
      }
    }

    for (;;) {
      const next = advance(story.beats, index, state);
      state = next.state;
      await show(next.entries, state);
      if (!alive()) return;
      index = next.index;

      const beat = story.beats[index];
      if (!beat || beat.type !== "decision") break;

      if (beat.prompt) {
        set({ youMood: "worried" });
        await say(beat.prompt);
        if (!alive()) return;
      }
      const current = state;
      const option = await new Promise<Option>((resolve) =>
        setAsk({ beat, number: decisions.indexOf(beat) + 1, state: current, resolve }),
      );
      if (!alive()) return;
      setAsk(null);

      const chosen = choose(state, beat, option);
      state = chosen.state;
      // Erst die eigene Antwort, dann die Reaktion, dann springt die Zahl.
      await show(chosen.entries.slice(0, 1), state);
      setHud({ ...hud, table: state.table });
      if (beat.id === "d1") set({ brandtMood: option.id === "A" ? "surprised" : "happy" });
      await show(chosen.entries.slice(1), state);
      if (!alive()) return;
      setHud(state);
      await wait(900);
      index++;
    }

    // --- Ergebnis, Erklärung, starker Verlauf ---
    const ending = pickEnding(story, state);
    setHud(state);
    set({
      view: "result",
      night: false,
      caption: null,
      mail: null,
      reply: null,
      bubble: null,
      ending,
      youMood: ending.id === "schnell" ? "neutral" : "happy",
    });
    await wait(900);
    await say(`e_${ending.id}`);
    set({ jonas: { text: fill(ending.jonas, state), n: ++n } });
    pop();
    await wait(3600);
    if (!alive()) return;

    set({ jonas: null, caption: null, view: "reveal", revealStep: 0 });
    await say("r0");
    for (let step = 1; step <= story.reveal.length; step++) {
      set({ revealStep: step });
      pop();
      await say(`r${step}`);
    }
    await wait(500);
    if (!alive()) return;

    set({ view: "strong", caption: null });
    await say("s1");
    await wait(1200);
    await say("out");
    if (alive()) setPhase("end");
  }

  const inScene = cue.view === "home" || cue.view === "call" || cue.view === "mail";
  const showChip =
    phase === "playing" && inScene && !cue.title && cue.hud.table !== initialState.table;

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-[#1e294b]">
      <div
        onClick={() => !ask && skip.current?.()}
        className="relative aspect-video w-full max-w-[177.78dvh] overflow-clip bg-[#f6e7cf] text-[#33273b] [container-type:size]"
      >
        <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full">
          {cue.view === "home" && (
            <HomeScene
              key={runKey}
              mood={cue.youMood}
              thought={cue.thought}
              ringing={cue.ringing}
            />
          )}
          {cue.view === "call" && (
            <CallScene
              youMood={cue.youMood}
              brandtMood={cue.brandtMood}
              brandtTalking={cue.talking === "brandt"}
              bubble={cue.bubble}
            />
          )}
          {cue.view === "mail" && (
            <MailScene
              key={cue.night ? "night" : "day"}
              night={cue.night}
              mail={cue.mail}
              reply={cue.reply}
              stamp={cue.stamp}
              mood={cue.youMood}
            />
          )}
          {cue.view === "result" && (
            <g transform="translate(-340 0)">
              <HomeScene mood={cue.youMood} thought={null} ringing={false} />
            </g>
          )}
        </svg>

        {cue.view === "result" && cue.ending && (
          <ResultCard story={story} ending={cue.ending} state={cue.hud} />
        )}
        {cue.view === "reveal" && <RevealPanel story={story} step={cue.revealStep} />}
        {cue.view === "strong" && <StrongPanel story={story} state={cue.hud} />}

        {showChip && (
          <TableChip key={fill(cue.hud.table, cue.hud)} text={fill(cue.hud.table, cue.hud)} />
        )}

        {cue.jonas && phase === "playing" && (
          <JonasPopup key={cue.jonas.n} name={story.characters.jonas} text={cue.jonas.text} />
        )}

        {cue.title && <TitleCard title={cue.title.title} time={cue.title.time} />}

        {cue.caption && phase === "playing" && !ask && (
          <div className="pointer-events-none absolute inset-x-[10cqw] bottom-[3cqw] flex justify-center">
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

        {ask && (
          <Decision
            key={ask.beat.id}
            number={ask.number}
            total={decisions.length}
            options={ask.beat.options}
            state={ask.state}
            onPick={ask.resolve}
          />
        )}

        {phase === "poster" && (
          <Overlay>
            <p className="text-[1.5cqw] font-bold uppercase tracking-[0.3em] text-[#f2a33a]">
              Work · 3 Entscheidungen
            </p>
            <h1 className="text-[7cqw] font-black leading-none text-white">{story.title}</h1>
            <p className="text-[2.2cqw] text-white/75">Sie wollen dich. Jetzt geht es ums Geld.</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                play();
              }}
              aria-label="Abspielen"
              className="mt-[1cqw] flex h-[9cqw] w-[9cqw] items-center justify-center rounded-full bg-[#f2a33a] text-[#1e294b] hover:brightness-110"
            >
              <svg viewBox="0 0 24 24" className="ml-[0.5cqw] h-[4cqw] w-[4cqw]" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <p className="text-[1.4cqw] text-white/50">
              Mit Ton ansehen · Klick aufs Bild springt weiter
            </p>
          </Overlay>
        )}

        {phase === "end" && (
          <Overlay>
            <p className="text-[1.5cqw] font-bold uppercase tracking-[0.3em] text-[#f2a33a]">
              Dein Ergebnis: {euro(cue.hud.offer)} €
            </p>
            <h2 className="text-[4.4cqw] font-black leading-tight text-white">
              Andere Antworten, anderer Verlauf.
            </h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                play();
              }}
              className="mt-[1cqw] rounded-full bg-[#f2a33a] px-[3.4cqw] py-[1.4cqw] text-[2cqw] font-bold text-[#1e294b] hover:brightness-110"
            >
              Nochmal spielen
            </button>
            <p className="max-w-[60cqw] text-[1.3cqw] text-white/50">{story.disclaimer}</p>
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

// Schnitt zwischen den Szenen: "20 Minuten später – Die Mail".
function TitleCard({ title, time }: { title: string; time: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(ref.current, { xPercent: -100, duration: 0.45, ease: "power3.out" });
      gsap.from(".t", { opacity: 0, y: 40, duration: 0.4, stagger: 0.12, delay: 0.3 });
    },
    { scope: ref },
  );
  return (
    <div
      ref={ref}
      className="absolute inset-0 flex flex-col items-center justify-center gap-[1cqw] bg-[#2b3a67] text-center"
    >
      <p className="t text-[2.2cqw] font-bold uppercase tracking-[0.3em] text-[#f2a33a]">{time}</p>
      <h2 className="t text-[8cqw] font-black leading-none text-white">{title}</h2>
    </div>
  );
}

function TableChip({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [main, sub] = text.split(" · ");
  useGSAP(() => {
    gsap.from(ref.current, { scale: 1.5, duration: 0.5, ease: "back.out(2)" });
  });
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[1.6cqw] flex justify-center">
      <div
        ref={ref}
        className="rounded-[1.4cqw] bg-white px-[2.2cqw] py-[0.7cqw] text-center shadow-xl"
      >
        <p className="text-[1cqw] font-bold uppercase tracking-[0.25em] text-[#2b3a67]/60">
          Zahl auf dem Tisch
        </p>
        <p className="text-[2.8cqw] font-black leading-none text-[#2f9e8f]">{main}</p>
        {sub && <p className="mt-[0.2cqw] text-[1.1cqw] text-[#2b3a67]/70">{sub}</p>}
      </div>
    </div>
  );
}

// Jonas schreibt: Chat-Nachricht, die von links ins Bild rutscht.
function JonasPopup({ name, text }: { name: string; text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { x: "-120%", duration: 0.45, ease: "back.out(1.4)" });
  });
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute left-[2cqw] top-[11cqw] flex max-w-[34cqw] items-center gap-[1.2cqw] rounded-[2cqw] bg-white p-[1.2cqw] shadow-2xl"
    >
      <div className="h-[5.4cqw] w-[5.4cqw] shrink-0">
        <JonasFace />
      </div>
      <div>
        <p className="text-[1.1cqw] font-bold uppercase tracking-[0.15em] text-[#2b3a67]/60">
          {name} · Chat
        </p>
        <p className="text-[2.1cqw] font-bold leading-[1.2] text-[#1e294b]">{text}</p>
      </div>
    </div>
  );
}

function Decision({
  number,
  total,
  options,
  state,
  onPick,
}: {
  number: number;
  total: number;
  options: Option[];
  state: State;
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
      onClick={(e) => e.stopPropagation()}
      className="absolute inset-0 flex flex-col items-center justify-end gap-[2cqw] bg-[#1e294b]/60 pb-[4cqw]"
    >
      <div className="text-center">
        <p className="flex items-center justify-center gap-[0.8cqw] text-[1.4cqw] font-bold uppercase tracking-[0.25em] text-[#f2a33a]">
          <span className="flex gap-[0.3cqw]">
            <span className="h-[1.4cqw] w-[0.45cqw] rounded-sm bg-[#f2a33a]" />
            <span className="h-[1.4cqw] w-[0.45cqw] rounded-sm bg-[#f2a33a]" />
          </span>
          Pause · Entscheidung {number} von {total}
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
            <span className="text-[2.3cqw] font-bold leading-[1.2]">
              „{fill(option.text, state)}“
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ story, ending, state }: { story: Story; ending: Ending; state: State }) {
  const ref = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      gsap.from(ref.current, { x: "120%", duration: 0.6, ease: "back.out(1.2)" });
      const counter = { value: state.offer - 9000 };
      gsap.to(counter, {
        value: state.offer,
        duration: 1.5,
        delay: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          if (number.current) {
            number.current.textContent = euro(Math.round(counter.value / 100) * 100);
          }
        },
      });
    },
    { scope: ref },
  );
  const extras = state.flags.map((flag) => story.flagLabels[flag]).filter(Boolean);
  return (
    <div className="pointer-events-none absolute inset-y-0 right-[3cqw] flex w-[46cqw] items-center">
      <div ref={ref} className="w-full rounded-[2.4cqw] bg-white p-[3cqw] shadow-2xl">
        <p className="inline-block rounded-full bg-[#2b3a67]/10 px-[1.4cqw] py-[0.4cqw] text-[1.2cqw] font-bold uppercase tracking-[0.2em] text-[#2b3a67]/70">
          Ein möglicher Verlauf
        </p>
        <h2 className="mt-[1cqw] text-[4.6cqw] font-black leading-none text-[#1e294b]">
          {ending.title}
        </h2>
        <p className="mt-[1.6cqw] text-[1.2cqw] font-bold uppercase tracking-[0.25em] text-[#2b3a67]/60">
          Dein Ergebnis
        </p>
        <p className="text-[7cqw] font-black leading-none text-[#2f9e8f]">
          <span ref={number}>{euro(state.offer)}</span> €
        </p>
        {extras.map((extra) => (
          <p key={extra} className="mt-[0.6cqw] text-[1.8cqw] font-bold text-[#ef6f5e]">
            + {extra}
          </p>
        ))}
        <p className="mt-[0.8cqw] text-[1.6cqw] text-[#2b3a67]/60">
          Dein Ziel war: {euro(story.goal)} €
        </p>
      </div>
    </div>
  );
}

function RevealCard({ story, index }: { story: Story; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      y: "40%",
      opacity: 0,
      scale: 0.85,
      duration: 0.5,
      ease: "back.out(1.6)",
    });
  });
  const card = story.reveal[index];
  return (
    <div
      ref={ref}
      className="flex w-[28cqw] flex-col items-center gap-[1cqw] rounded-[2cqw] bg-white p-[2cqw] text-center shadow-xl"
    >
      <div className="h-[9cqw] w-[9cqw]">
        <RevealIcon kind={index} />
      </div>
      <h3 className="text-[2.3cqw] font-black leading-[1.15] text-[#1e294b]">{card.title}</h3>
      <p className="rounded-[1cqw] bg-[#2f9e8f]/12 px-[1cqw] py-[0.5cqw] text-[1.05cqw] leading-[1.3] text-[#2b3a67]">
        <strong>Belegt · {card.strength}</strong>
        <br />
        {card.source}
      </p>
    </div>
  );
}

function RevealPanel({ story, step }: { story: Story; step: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center gap-[2.4cqw] bg-[#f6e7cf] pt-[4cqw]">
      <h2 className="text-[4.4cqw] font-black text-[#1e294b]">Was ist gerade passiert?</h2>
      <div className="flex gap-[2cqw]">
        {story.reveal.map((card, i) =>
          step > i ? (
            <RevealCard key={card.title} story={story} index={i} />
          ) : (
            <div key={card.title} className="w-[28cqw]" />
          ),
        )}
      </div>
    </div>
  );
}

function StrongPanel({ story, state }: { story: Story; state: State }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(".step", { opacity: 0, x: "-10%", duration: 0.45, stagger: 1.7, delay: 1.2 });
      gsap.from(".compare", {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        delay: 6.4,
        ease: "back.out(1.8)",
      });
    },
    { scope: ref },
  );
  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center gap-[4cqw] bg-[#2b3a67] px-[6cqw] text-white"
    >
      <div className="flex flex-1 flex-col gap-[1.8cqw]">
        <h2 className="text-[3.8cqw] font-black leading-[1.05]">{story.strongRun.title}</h2>
        {story.strongRun.steps.map((step, i) => (
          <div key={step.text} className="step flex items-center gap-[1.4cqw]">
            <span className="flex h-[4cqw] w-[4cqw] shrink-0 items-center justify-center rounded-full bg-[#f2a33a] text-[2cqw] font-black text-[#1e294b]">
              {i + 1}
            </span>
            <div>
              <p className="text-[2.4cqw] font-bold leading-[1.2]">„{step.text}“</p>
              <p className="text-[1.6cqw] text-[#7fd6c8]">→ {step.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="compare w-[28cqw] rounded-[2cqw] bg-white p-[2.4cqw] text-center text-[#1e294b]">
        <p className="text-[1.3cqw] font-bold uppercase tracking-[0.2em] opacity-60">
          Starker Verlauf
        </p>
        <p className="text-[5cqw] font-black leading-none text-[#2f9e8f]">
          {euro(story.strongRun.result)} €
        </p>
        <p className="mt-[1.4cqw] text-[1.3cqw] font-bold uppercase tracking-[0.2em] opacity-60">
          Du
        </p>
        <p className="text-[3.4cqw] font-black leading-none">{euro(state.offer)} €</p>
      </div>
    </div>
  );
}
