"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  advance,
  choose,
  fill,
  initialState,
  pickEnding,
  type LogEntry,
  type State,
} from "@/lib/engine";
import type { Beat, Ending, Option, Story } from "@/lib/story";
import audioManifest from "@/stories/erstesdate.audio.json";
import { HomeScene, type Mood } from "./art";
import { DateIcon, DateScene } from "./date-art";
import { JonasFace } from "./scenes2";
import { pop } from "./sfx";
import {
  Caption,
  Decision,
  EndCard,
  FriendPopup,
  Poster,
  RevealPanel,
  Stage,
  StrongPanel,
  TitleCard,
  useDirector,
  type VoiceLine,
} from "./ui";

// Situation "Das erste Date". Die Story zählt die Stimmung am Tisch (0–100);
// angezeigt wird das Gegenteil: das Awkward-Meter.

const AUDIO = audioManifest as Record<string, string>;

type DecisionBeat = Extract<Beat, { type: "decision" }>;
type Speaker = "narrator" | "lena" | "gehirn";
type View = "date" | "result" | "reveal" | "strong";

type Cue = {
  view: View;
  place: "bar" | "street";
  lena: boolean;
  youMood: Mood;
  lenaMood: Mood;
  talking: Speaker | null;
  caption: { who: Speaker; text: string } | null;
  brain: boolean;
  bubble: string | null;
  phoneBuzz: boolean;
  friend: { text: string; n: number } | null;
  title: { title: string; time: string } | null;
  hud: State;
  revealStep: number;
  ending: Ending | null;
};

const SPEAKER: Record<Speaker, { label: string; accent: string }> = {
  narrator: { label: "Erzähler", accent: "#7fd6c8" },
  lena: { label: "Lena", accent: "#f2a33a" },
  gehirn: { label: "Dein Gehirn", accent: "#f4a6b8" },
};

type Phase = "poster" | "playing" | "end";
type Ask = { beat: DecisionBeat; number: number; state: State; resolve: (o: Option) => void };

const awkward = (state: State) => 100 - state.offer;

export default function DateFilm({ story, voice }: { story: Story; voice: VoiceLine[] }) {
  const begun: State = { ...initialState, offer: story.start ?? 0 };
  const START: Cue = {
    view: "date",
    place: "bar",
    lena: false,
    youMood: "neutral",
    lenaMood: "happy",
    talking: null,
    caption: null,
    brain: false,
    bubble: null,
    phoneBuzz: false,
    friend: null,
    title: null,
    hud: begun,
    revealStep: 0,
    ending: null,
  };

  const [phase, setPhase] = useState<Phase>("poster");
  const [cue, setCue] = useState<Cue>(START);
  const [ask, setAsk] = useState<Ask | null>(null);
  const [runKey, setRunKey] = useState(0);
  const { wait, playFile, begin, skipNow } = useDirector();

  const decisions = story.beats.filter((b): b is DecisionBeat => b.type === "decision");

  async function play() {
    const { id, alive } = begin();
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

    setAsk(null);
    setCue(START);
    setRunKey(id);
    setPhase("playing");

    // --- Intro ---
    await wait(900);
    await say("i1");
    set({ youMood: "worried" });
    await say("i2");
    set({ brain: true });
    pop();
    await say("g1");
    if (!alive()) return;
    set({ lena: true, youMood: "surprised", caption: null });
    await say("i3");
    set({ youMood: "happy" });
    if (!alive()) return;

    // --- Story aus der Story-Datei ---
    let state = begun;
    let index = 0;
    let firstScene = true;

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
          set({ title: { title: entry.title, time: entry.time }, caption: null, friend: null });
          if (entry.voice) await say(entry.voice);
          else await wait(1800);
          set({
            title: null,
            caption: null,
            place: entry.night ? "street" : "bar",
            lenaMood: state.offer >= 50 ? "happy" : "neutral",
            youMood: state.offer >= 50 ? "happy" : "neutral",
          });
          await wait(700);
          continue;
        }

        const { line } = entry;
        if (line.from === "jonas") {
          set({ caption: null, phoneBuzz: true, youMood: "surprised", friend: { text: line.text, n: ++n } });
          pop();
          await wait(3400);
          set({ friend: null });
        } else if (line.from === "gehirn") {
          set({ brain: true });
          await say(line.voice, line.text, "gehirn");
        } else if (line.from === "du") {
          set({ caption: null, bubble: line.text });
          pop();
          await wait(2100);
          set({ bubble: null });
        } else {
          await say(line.voice, line.text, "lena");
        }
      }
    }

    for (;;) {
      const next = advance(story.beats, index, state);
      state = next.state;
      await show(next.entries);
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
      const better = state.offer > current.offer;
      const worse = state.offer < current.offer;
      set({ phoneBuzz: false });
      await show(chosen.entries.slice(0, 1));
      // Das Meter schlägt aus, während Lena reagiert.
      set({
        hud: state,
        lenaMood: better ? "happy" : "neutral",
        youMood: worse ? "worried" : better ? "happy" : "neutral",
      });
      await show(chosen.entries.slice(1));
      if (!alive()) return;
      await wait(900);
      index++;
    }

    // --- Ergebnis, Erklärung, starker Verlauf ---
    const ending = pickEnding(story, state);
    set({
      view: "result",
      caption: null,
      brain: false,
      hud: state,
      ending,
      youMood: ending.id === "zweites" ? "happy" : ending.id === "mal" ? "neutral" : "worried",
    });
    await wait(900);
    await say(`e_${ending.id}`);
    set({ friend: { text: fill(ending.jonas, state), n: ++n } });
    pop();
    await wait(3800);
    if (!alive()) return;

    set({ friend: null, caption: null, view: "reveal", revealStep: 0 });
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
    <Stage onSkip={() => !ask && skipNow()}>
      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full">
        {cue.view === "date" && (
          <DateScene
            key={runKey}
            place={cue.place}
            lena={cue.lena}
            youMood={cue.youMood}
            lenaMood={cue.lenaMood}
            lenaTalking={cue.talking === "lena"}
            brain={cue.brain}
            brainTalking={cue.talking === "gehirn"}
            bubble={cue.bubble}
            phoneBuzz={cue.phoneBuzz}
          />
        )}
        {cue.view === "result" && (
          <g transform="translate(-340 0)">
            <HomeScene mood={cue.youMood} thought={null} ringing={false} />
          </g>
        )}
      </svg>

      {cue.view === "result" && cue.ending && <ResultCard ending={cue.ending} state={cue.hud} />}
      {cue.view === "reveal" && (
        <RevealPanel
          story={story}
          step={cue.revealStep}
          icons={story.reveal.map((card, i) => (
            <DateIcon key={card.title} kind={i} />
          ))}
        />
      )}
      {cue.view === "strong" && (
        <StrongPanel
          story={story}
          strongValue="0 % awkward"
          yourValue={`${awkward(cue.hud)} % awkward`}
        />
      )}

      {phase === "playing" && cue.view === "date" && !cue.title && (
        <AwkwardMeter value={awkward(cue.hud)} />
      )}

      {cue.friend && phase === "playing" && (
        <FriendPopup
          key={cue.friend.n}
          name={story.characters.jonas}
          text={cue.friend.text}
          face={<JonasFace />}
          position={cue.view === "date" ? "left-[33cqw] top-[36cqw]" : undefined}
        />
      )}

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
          question="Was sagst du?"
          options={ask.beat.options}
          state={ask.state}
          onPick={ask.resolve}
        />
      )}

      {phase === "poster" && (
        <Poster
          kicker="Dating · 3 Entscheidungen"
          title={story.title}
          subtitle="Drei Wochen geschrieben. Jetzt sitzt ihr euch gegenüber."
          onStart={play}
        />
      )}

      {phase === "end" && (
        <EndCard
          kicker={`Awkward-Meter: ${awkward(cue.hud)} %`}
          disclaimer={story.disclaimer}
          onReplay={play}
        />
      )}
    </Stage>
  );
}

// Anzeige oben: Wie unangenehm ist es gerade?
function AwkwardMeter({ value }: { value: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[1.6cqw] flex justify-center">
      <div className="rounded-[1.4cqw] bg-white px-[2cqw] py-[0.9cqw] text-center shadow-xl">
        <p className="text-[1cqw] font-bold uppercase tracking-[0.25em] text-[#2b3a67]/60">
          Awkward-Meter
        </p>
        <div className="relative mt-[0.7cqw] h-[1.3cqw] w-[24cqw] rounded-full bg-gradient-to-r from-[#2f9e8f] via-[#f2c14e] to-[#ef6f5e]">
          <div
            className="absolute top-[-0.5cqw] h-[2.3cqw] w-[0.9cqw] -translate-x-1/2 rounded-full border-[0.25cqw] border-white bg-[#1e294b] shadow transition-[left] duration-700"
            style={{ left: `${Math.min(97, Math.max(3, value))}%` }}
          />
        </div>
        <p className="mt-[0.5cqw] text-[1.5cqw] font-black leading-none text-[#1e294b]">{value} %</p>
      </div>
    </div>
  );
}

function ResultCard({ ending, state }: { ending: Ending; state: State }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { x: "120%", duration: 0.6, ease: "back.out(1.2)" });
  });
  const value = awkward(state);
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
          Awkward-Meter
        </p>
        <p
          className="text-[7cqw] font-black leading-none"
          style={{ color: value <= 25 ? "#2f9e8f" : value <= 55 ? "#f2a33a" : "#ef6f5e" }}
        >
          {value} %
        </p>
        <p className="mt-[0.8cqw] text-[1.8cqw] text-[#2b3a67]/80">{ending.text}</p>
      </div>
    </div>
  );
}
