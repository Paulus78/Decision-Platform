"use client";

import { useRef, useState } from "react";
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
import audioManifest from "@/stories/autoverkauf.audio.json";
import type { Mood } from "./art";
import { AutoIcon, DriveScene, LisaFace, ParkingScene } from "./auto-art";
import { JonasFace } from "./scenes2";
import { pop } from "./sfx";
import {
  Caption,
  Decision,
  EndCard,
  FriendPopup,
  HudChip,
  Poster,
  RevealPanel,
  Stage,
  StrongPanel,
  TitleCard,
  useDirector,
  type VoiceLine,
} from "./ui";

// Situation "Der Käufer ist da": Du verkaufst dein Auto. Die Story zählt,
// was Alex gerade bietet.

const AUDIO = audioManifest as Record<string, string>;

type DecisionBeat = Extract<Beat, { type: "decision" }>;
type Speaker = "narrator" | "alex";
type View = "park" | "drive" | "result" | "reveal" | "strong";

type Cue = {
  view: View;
  alex: boolean;
  car: boolean;
  youMood: Mood;
  alexMood: Mood;
  talking: Speaker | null;
  caption: { who: Speaker; text: string } | null;
  bubble: string | null;
  compare: boolean;
  friend: { who: string; text: string; n: number } | null;
  title: { title: string; time: string } | null;
  hud: State;
  revealStep: number;
  ending: Ending | null;
};

const SPEAKER: Record<Speaker, { label: string; accent: string }> = {
  narrator: { label: "Erzähler", accent: "#7fd6c8" },
  alex: { label: "Alex", accent: "#f2a33a" },
};

type Phase = "poster" | "playing" | "end";
type Ask = { beat: DecisionBeat; number: number; state: State; resolve: (o: Option) => void };

const sold = (state: State) => state.flags.includes("sold");
const outcome = (state: State) => (sold(state) ? `${euro(state.offer)} €` : "Kein Verkauf");

export default function AutoFilm({ story, voice }: { story: Story; voice: VoiceLine[] }) {
  const begun: State = { ...initialState, offer: story.start ?? 0 };
  const START: Cue = {
    view: "park",
    alex: false,
    car: true,
    youMood: "neutral",
    alexMood: "happy",
    talking: null,
    caption: null,
    bubble: null,
    compare: false,
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
  const [offered, setOffered] = useState(false);
  const { wait, playFile, begin, skipNow, mark, controls } = useDirector();

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
    setOffered(false);
    setRunKey(id);
    setPhase("playing");

    // --- Intro ---
    await wait(1300);
    await say("a1");
    set({ youMood: "happy" });
    await say("a2");
    if (!alive()) return;
    set({ alex: true, caption: null });
    await wait(700);
    await say("x1");
    if (!alive()) return;
    set({ view: "drive", caption: null });
    await say("a3");
    if (!alive()) return;
    set({ view: "park", caption: null, youMood: "neutral" });
    await wait(900);

    // --- Story aus der Story-Datei ---
    let state = begun;
    let index = 0;
    let firstScene = true;

    async function show(entries: LogEntry[]) {
      for (const entry of entries) {
        if (!alive()) return;
        if (entry.kind === "table") {
          set({ hud: { ...state, table: entry.table } });
          continue;
        }
        if (entry.kind === "scene") {
          // Die erste Szene hat schon das Intro eingeleitet.
          if (firstScene) {
            firstScene = false;
            continue;
          }
          set({
            title: { title: entry.title, time: entry.time },
            caption: null,
            friend: null,
            compare: false,
          });
          if (entry.voice) await say(entry.voice);
          else await wait(1800);
          set({ title: null, caption: null, youMood: "neutral", alexMood: "happy" });
          await wait(600);
          continue;
        }

        const { line } = entry;
        if (line.visual === "compare") {
          set({ compare: true });
          pop();
        }
        if (line.from === "jonas" || line.from === "lisa") {
          set({ caption: null, friend: { who: line.from, text: line.text, n: ++n } });
          pop();
          await wait(1500 + line.text.length * 45);
          set({ friend: null });
        } else if (line.from === "erzaehler") {
          await say(line.voice, line.text, "narrator");
        } else if (line.from === "du") {
          set({ caption: null, bubble: line.text, compare: false });
          pop();
          await wait(2100);
          set({ bubble: null });
        } else {
          await say(line.voice, line.text, "alex");
          // Ab dem ersten Angebot läuft die Anzeige oben mit.
          if (alive()) setOffered(true);
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
      // Erst die eigene Antwort, dann Alex' Reaktion, dann springt die Zahl.
      await show(chosen.entries.slice(0, 1));
      set({ alexMood: better ? "surprised" : "happy" });
      await show(chosen.entries.slice(1));
      if (!alive()) return;
      set({
        hud: state,
        alexMood: "happy",
        youMood: better ? "happy" : state.offer < current.offer ? "worried" : "neutral",
      });
      await wait(1000);
      index++;
    }

    // --- Ergebnis, Erklärung, starker Verlauf ---
    mark(0.88);
    const ending = pickEnding(story, state);
    set({
      view: "result",
      caption: null,
      compare: false,
      hud: state,
      ending,
      alex: false,
      car: !sold(state),
      youMood: ending.id === "stark" ? "happy" : ending.id === "geplatzt" ? "worried" : "neutral",
    });
    await wait(900);
    await say(`e_${ending.id}`);
    set({ friend: { who: "jonas", text: fill(ending.jonas, state), n: ++n } });
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
    mark(1);
    if (alive()) setPhase("end");
  }

  const scene = (
    <ParkingScene
      key={runKey}
      youMood={cue.youMood}
      alexMood={cue.alexMood}
      alexTalking={cue.talking === "alex"}
      alex={cue.alex}
      car={cue.car}
      bubble={cue.bubble}
      compare={cue.compare}
    />
  );

  return (
    <Stage onSkip={() => !ask && skipNow()} controls={phase === "playing" ? controls : null}>
      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full">
        {cue.view === "park" && scene}
        {cue.view === "drive" && <DriveScene />}
        {cue.view === "result" && <g transform="translate(-140 0)">{scene}</g>}
      </svg>

      {cue.view === "result" && cue.ending && (
        <ResultCard story={story} ending={cue.ending} state={cue.hud} />
      )}
      {cue.view === "reveal" && (
        <RevealPanel
          story={story}
          choices={cue.hud.choices}
          step={cue.revealStep}
          icons={story.reveal.map((card, i) => (
            <AutoIcon key={card.title} kind={i} />
          ))}
        />
      )}
      {cue.view === "strong" && (
        <StrongPanel
          story={story}
          strongValue={`${euro(story.strongRun.result)} €`}
          yourValue={outcome(cue.hud)}
        />
      )}

      {phase === "playing" && cue.view === "park" && offered && !cue.title && (
        <HudChip
          key={cue.hud.offer}
          label="Alex bietet"
          text={fill(cue.hud.table, cue.hud)}
        />
      )}

      {cue.friend && phase === "playing" && (
        <FriendPopup
          key={cue.friend.n}
          name={story.characters[cue.friend.who]}
          text={cue.friend.text}
          face={cue.friend.who === "lisa" ? <LisaFace /> : <JonasFace />}
          position="left-[33cqw] top-[12cqw]"
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
          kicker="Money · 3 Entscheidungen"
          title={story.title}
          subtitle="Du willst 6.500 €. Alex bietet 5.800."
          onStart={play}
        />
      )}

      {phase === "end" && (
        <EndCard
          kicker={`Dein Ergebnis: ${outcome(cue.hud)}`}
          disclaimer={story.disclaimer}
          onReplay={play}
        />
      )}
    </Stage>
  );
}

function ResultCard({ story, ending, state }: { story: Story; ending: Ending; state: State }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { x: "120%", duration: 0.6, ease: "back.out(1.2)" });
  });
  return (
    <div className="pointer-events-none absolute inset-y-0 right-[3cqw] flex w-[44cqw] items-center">
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
        <p
          className="text-[6cqw] font-black leading-none"
          style={{ color: sold(state) ? "#2f9e8f" : "#ef6f5e" }}
        >
          {outcome(state)}
        </p>
        <p className="mt-[0.8cqw] text-[1.6cqw] text-[#2b3a67]/60">
          Dein Wunsch war: {euro(story.goal)} €
        </p>
        <p className="mt-[0.8cqw] text-[1.8cqw] text-[#2b3a67]/80">{ending.text}</p>
      </div>
    </div>
  );
}
