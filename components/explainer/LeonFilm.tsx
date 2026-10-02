"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  advance,
  choose,
  euro,
  initialState,
  pickEnding,
  type LogEntry,
  type State,
} from "@/lib/engine";
import type { Beat, Ending, Option, Story } from "@/lib/story";
import audioManifest from "@/stories/leon.audio.json";
import { HomeScene, type Mood } from "./art";
import { LeonIcon, LeonScene, type LeonMessage, type StoryKind } from "./leon-art";
import { pop } from "./sfx";
import {
  Caption,
  Decision,
  EndCard,
  Poster,
  RevealPanel,
  Stage,
  StrongPanel,
  TitleCard,
  useDirector,
  type VoiceLine,
} from "./ui";

// Situation "500 € für Leon". Die Story zählt zwei Dinge: wie viel Leon dir
// schuldet (offer) und wie es um die Freundschaft steht (second, 0–100).

const AUDIO = audioManifest as Record<string, string>;

type DecisionBeat = Extract<Beat, { type: "decision" }>;
type Speaker = "narrator" | "gehirn";
type View = "chat" | "result" | "reveal" | "strong";

type Cue = {
  view: View;
  night: boolean;
  mood: Mood;
  talking: Speaker | null;
  caption: { who: Speaker; text: string } | null;
  messages: LeonMessage[];
  story: StoryKind;
  brain: boolean;
  title: { title: string; time: string } | null;
  hud: State;
  revealStep: number;
  ending: Ending | null;
};

const SPEAKER: Record<Speaker, { label: string; accent: string }> = {
  narrator: { label: "Erzähler", accent: "#7fd6c8" },
  gehirn: { label: "Dein Gehirn", accent: "#f4a6b8" },
};

type Phase = "poster" | "playing" | "end";
type Ask = { beat: DecisionBeat; number: number; state: State; resolve: (o: Option) => void };

const friendship = (state: State) => Math.min(100, Math.max(0, state.second));
// Was am Ende wirklich zurückkommt.
const back = (state: State) => (state.flags.includes("forgiven") ? 0 : state.offer);

export default function LeonFilm({ story, voice }: { story: Story; voice: VoiceLine[] }) {
  const begun: State = { ...initialState, offer: story.start ?? 0, second: story.start2 ?? 0 };
  const START: Cue = {
    view: "chat",
    night: false,
    mood: "neutral",
    talking: null,
    caption: null,
    messages: [],
    story: "ask",
    brain: false,
    title: null,
    hud: begun,
    revealStep: 0,
    ending: null,
  };

  const [phase, setPhase] = useState<Phase>("poster");
  const [cue, setCue] = useState<Cue>(START);
  const [ask, setAsk] = useState<Ask | null>(null);
  const [runKey, setRunKey] = useState(0);
  const { wait, playFile, begin, skipNow, mark, controls } = useDirector();

  const decisions = story.beats.filter((b): b is DecisionBeat => b.type === "decision");

  async function play() {
    const { id, alive } = begin();
    const set = (patch: Partial<Cue>) => alive() && setCue((c) => ({ ...c, ...patch }));

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

    setAsk(null);
    setCue(START);
    setRunKey(id);
    setPhase("playing");

    // --- Intro ---
    await wait(1200);
    await say("f1");
    if (!alive()) return;
    set({ caption: null });

    // --- Story aus der Story-Datei ---
    let state = begun;
    let index = 0;
    let firstScene = true;
    let messages: LeonMessage[] = [];

    async function show(entries: LogEntry[]) {
      for (const entry of entries) {
        if (!alive()) return;
        if (entry.kind === "table") continue;
        if (entry.kind === "scene") {
          // Die erste Szene hat schon das Intro eingeleitet.
          if (firstScene) {
            firstScene = false;
            continue;
          }
          set({ title: { title: entry.title, time: entry.time }, caption: null });
          if (entry.voice) await say(entry.voice);
          else await wait(1800);
          set({ title: null, caption: null, night: Boolean(entry.night), mood: "neutral" });
          await wait(600);
          continue;
        }

        const { line } = entry;
        if (line.visual) set({ story: line.visual as StoryKind });
        if (line.from === "gehirn") {
          set({ brain: true, mood: "worried" });
          await say(line.voice, line.text, "gehirn");
        } else if (line.from === "du") {
          // "(Nichts schreiben.)" ist keine Nachricht.
          if (line.text.startsWith("(")) {
            await wait(700);
            continue;
          }
          messages = [...messages, { from: "du", text: line.text }];
          set({ caption: null, messages, mood: "neutral" });
          pop();
          await wait(1900);
        } else {
          messages = [...messages, { from: "leon", text: line.text }];
          set({ caption: null, messages });
          pop();
          await wait(1300 + line.text.length * 45);
        }
      }
    }

    for (;;) {
      const next = advance(story.beats, index, state);
      state = next.state;
      await show(next.entries);
      if (!alive()) return;
      index = next.index;
      mark((index + 1) / (story.beats.length + 5));

      const beat = story.beats[index];
      if (!beat || beat.type !== "decision") break;

      if (beat.prompt) {
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
      await show(chosen.entries.slice(0, 1));
      set({ hud: state });
      await show(chosen.entries.slice(1));
      if (!alive()) return;
      await wait(900);
      index++;
    }

    // --- Ergebnis, Erklärung, starker Verlauf ---
    mark(0.88);
    const ending = pickEnding(story, state);
    set({
      view: "result",
      night: false,
      caption: null,
      brain: false,
      hud: state,
      ending,
      mood: ending.id === "gut" ? "happy" : ending.id === "weg" ? "neutral" : "worried",
    });
    await wait(900);
    await say(`e_${ending.id}`);
    await wait(1500);
    if (!alive()) return;

    set({ caption: null, view: "reveal", revealStep: 0 });
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

  return (
    <Stage onSkip={() => !ask && skipNow()} controls={phase === "playing" ? controls : null}>
      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full">
        {cue.view === "chat" && (
          <LeonScene
            key={runKey}
            night={cue.night}
            mood={cue.mood}
            messages={cue.messages}
            story={cue.story}
            brain={cue.brain}
            brainTalking={cue.talking === "gehirn"}
          />
        )}
        {cue.view === "result" && (
          <g transform="translate(-340 0)">
            <HomeScene mood={cue.mood} thought={null} ringing={false} />
          </g>
        )}
      </svg>

      {cue.view === "result" && cue.ending && <ResultCard ending={cue.ending} state={cue.hud} />}
      {cue.view === "reveal" && (
        <RevealPanel
          story={story}
          choices={cue.hud.choices}
          step={cue.revealStep}
          icons={story.reveal.map((card, i) => (
            <LeonIcon key={card.title} kind={i} />
          ))}
        />
      )}
      {cue.view === "strong" && (
        <StrongPanel
          story={story}
          strongValue={`${euro(story.strongRun.result)} € zurück`}
          yourValue={`${euro(back(cue.hud))} € zurück`}
        />
      )}

      {phase === "playing" && cue.view === "chat" && !cue.title && <DoubleHud state={cue.hud} />}

      {cue.title && <TitleCard title={cue.title.title} time={cue.title.time} />}

      {cue.caption && phase === "playing" && !ask && (
        <Caption
          label={SPEAKER[cue.caption.who].label}
          text={cue.caption.text}
          accent={SPEAKER[cue.caption.who].accent}
        />
      )}

      {ask && (
        <Decision
          key={ask.beat.id}
          number={ask.number}
          total={decisions.length}
          question="Was schreibst du?"
          options={ask.beat.options}
          state={ask.state}
          onPick={ask.resolve}
        />
      )}

      {phase === "poster" && (
        <Poster
          kicker="Freunde · 3 Entscheidungen"
          title={story.title}
          subtitle="„Kriegst du nächste Woche zurück, safe.“"
          onStart={play}
        />
      )}

      {phase === "end" && (
        <EndCard
          kicker={`Zurück: ${euro(back(cue.hud))} € · Freundschaft: ${friendship(cue.hud)} %`}
          disclaimer={story.disclaimer}
          credit="Stimmen: Gemini"
          onReplay={play}
        />
      )}
    </Stage>
  );
}

// Zwei Anzeigen, die gegeneinander laufen: Geld und Freundschaft.
function DoubleHud({ state }: { state: State }) {
  const value = friendship(state);
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[1.4cqw] flex justify-center gap-[1cqw]">
      <div className="rounded-[1.4cqw] bg-white px-[1.8cqw] py-[0.7cqw] text-center shadow-xl">
        <p className="text-[1cqw] font-bold uppercase tracking-[0.2em] text-[#2b3a67]/60">
          Leon schuldet dir
        </p>
        <p className="text-[2.6cqw] font-black leading-none text-[#2f9e8f]">
          {euro(state.offer)} €
        </p>
      </div>
      <div className="rounded-[1.4cqw] bg-white px-[1.8cqw] py-[0.7cqw] text-center shadow-xl">
        <p className="text-[1cqw] font-bold uppercase tracking-[0.2em] text-[#2b3a67]/60">
          Freundschaft
        </p>
        <div className="mt-[0.6cqw] h-[1.1cqw] w-[13cqw] overflow-hidden rounded-full bg-[#2b3a67]/15">
          <div
            className="h-full rounded-full transition-[width] duration-700"
            style={{ width: `${value}%`, background: value >= 50 ? "#ef6f5e" : "#7a8399" }}
          />
        </div>
        <p className="mt-[0.3cqw] text-[1.3cqw] font-black leading-none text-[#1e294b]">
          {value} %
        </p>
      </div>
    </div>
  );
}

function ResultCard({ ending, state }: { ending: Ending; state: State }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { x: "120%", duration: 0.6, ease: "back.out(1.2)" });
  });
  const returned = back(state);
  return (
    <div className="pointer-events-none absolute inset-y-0 right-[3cqw] flex w-[46cqw] items-center">
      <div ref={ref} className="w-full rounded-[2.4cqw] bg-white p-[3cqw] shadow-2xl">
        <p className="inline-block rounded-full bg-[#2b3a67]/10 px-[1.4cqw] py-[0.4cqw] text-[1.2cqw] font-bold uppercase tracking-[0.2em] text-[#2b3a67]/70">
          Ein möglicher Verlauf
        </p>
        <h2 className="mt-[1cqw] text-[3.8cqw] font-black leading-[1.05] text-[#1e294b]">
          {ending.title}
        </h2>
        <div className="mt-[1.6cqw] flex gap-[3cqw]">
          <div>
            <p className="text-[1.2cqw] font-bold uppercase tracking-[0.2em] text-[#2b3a67]/60">
              Zurück
            </p>
            <p
              className="text-[4.6cqw] font-black leading-none"
              style={{ color: returned > 0 ? "#2f9e8f" : "#ef6f5e" }}
            >
              {euro(returned)} €
            </p>
            <p className="text-[1.3cqw] text-[#2b3a67]/60">von {euro(state.offer)} €</p>
          </div>
          <div>
            <p className="text-[1.2cqw] font-bold uppercase tracking-[0.2em] text-[#2b3a67]/60">
              Freundschaft
            </p>
            <p className="text-[4.6cqw] font-black leading-none text-[#ef6f5e]">
              {friendship(state)} %
            </p>
          </div>
        </div>
        <p className="mt-[1cqw] text-[1.8cqw] text-[#2b3a67]/80">{ending.text}</p>
      </div>
    </div>
  );
}
