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
import audioManifest from "@/stories/erhoehung.audio.json";
import { HomeScene, type Mood } from "./art";
import { OfficeIcon, OfficeScene } from "./office-art";
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

// Situation "Das Jahresgespräch": Du forderst eine Gehaltserhöhung.
// Die Story zählt, wie viel Euro mehr pro Monat gerade im Raum stehen.

const AUDIO = audioManifest as Record<string, string>;

type DecisionBeat = Extract<Beat, { type: "decision" }>;
type Speaker = "narrator" | "krueger" | "gehirn";
type View = "scene" | "result" | "reveal" | "strong";

type Cue = {
  view: View;
  place: "hall" | "office";
  stats: number;
  youMood: Mood;
  kruegerMood: Mood;
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
  krueger: { label: "Herr Krüger", accent: "#f2a33a" },
  gehirn: { label: "Dein Gehirn", accent: "#f4a6b8" },
};

type Phase = "poster" | "playing" | "end";
type Ask = { beat: DecisionBeat; number: number; state: State; resolve: (o: Option) => void };

const raise = (state: State) => `${euro(state.offer)} € mehr`;

export default function OfficeFilm({ story, voice }: { story: Story; voice: VoiceLine[] }) {
  const begun: State = { ...initialState, offer: story.start ?? 0 };
  const START: Cue = {
    view: "scene",
    place: "hall",
    stats: 0,
    youMood: "neutral",
    kruegerMood: "neutral",
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
    setRunKey(id);
    setPhase("playing");

    // --- Intro: der Flur vor dem Büro ---
    await wait(900);
    set({ stats: 1 });
    pop();
    await say("i1");
    set({ stats: 2, youMood: "worried" });
    pop();
    await say("i2");
    if (!alive()) return;
    set({ stats: 0, brain: true });
    pop();
    await say("g1");
    set({ friend: { text: "Sag einfach, du hast ein anderes Angebot. Hat bei meinem Cousin geklappt. Glaub ich.", n: ++n } });
    pop();
    await wait(4200);
    if (!alive()) return;
    set({ friend: null, caption: null });
    await say("i3");
    if (!alive()) return;
    set({ place: "office", caption: null, youMood: "neutral", kruegerMood: "happy" });
    await wait(1000);

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
          set({ title: { title: entry.title, time: entry.time }, caption: null, friend: null });
          if (entry.voice) await say(entry.voice);
          else await wait(1800);
          set({ title: null, caption: null, kruegerMood: "neutral" });
          await wait(600);
          continue;
        }

        const { line } = entry;
        if (line.from === "jonas") {
          set({ caption: null, phoneBuzz: true, youMood: "surprised", friend: { text: line.text, n: ++n } });
          pop();
          await wait(3600);
          set({ friend: null });
        } else if (line.from === "gehirn") {
          set({ brain: true });
          await say(line.voice, line.text, "gehirn");
        } else if (line.from === "du") {
          set({ caption: null, bubble: line.text });
          pop();
          await wait(2300);
          set({ bubble: null });
        } else {
          await say(line.voice, line.text, "krueger");
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
      const better = state.offer > current.offer || state.flags.length > current.flags.length;
      const bad = state.flags.includes("busted") || state.flags.includes("threat");
      set({ phoneBuzz: false });
      // Erst die eigene Antwort, dann Krügers Reaktion, dann springt die Zahl.
      await show(chosen.entries.slice(0, 1));
      set({ kruegerMood: bad ? "surprised" : better ? "happy" : "neutral" });
      await show(chosen.entries.slice(1));
      if (!alive()) return;
      set({
        hud: state,
        youMood: bad || state.offer < current.offer ? "worried" : better ? "happy" : "neutral",
      });
      await wait(1100);
      index++;
    }

    // --- Ergebnis, Erklärung, starker Verlauf ---
    mark(0.88);
    const ending = pickEnding(story, state);
    set({
      view: "result",
      caption: null,
      brain: false,
      hud: state,
      ending,
      youMood: ending.id === "stark" ? "happy" : ending.id === "klein" ? "neutral" : "worried",
    });
    await wait(900);
    await say(`e_${ending.id}`);
    set({ friend: { text: fill(ending.jonas, state), n: ++n } });
    pop();
    await wait(4000);
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

  const inOffice = cue.view === "scene" && cue.place === "office";

  return (
    <Stage onSkip={() => !ask && skipNow()} controls={phase === "playing" ? controls : null}>
      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full">
        {cue.view === "scene" && (
          <OfficeScene
            key={runKey}
            place={cue.place}
            stats={cue.stats}
            youMood={cue.youMood}
            kruegerMood={cue.kruegerMood}
            kruegerTalking={cue.talking === "krueger"}
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
          choices={cue.hud.choices}
          step={cue.revealStep}
          icons={story.reveal.map((card, i) => (
            <OfficeIcon key={card.title} kind={i} />
          ))}
        />
      )}
      {cue.view === "strong" && (
        <StrongPanel
          story={story}
          strongValue={`${euro(story.strongRun.result)} € mehr`}
          yourValue={raise(cue.hud)}
        />
      )}

      {phase === "playing" && inOffice && !cue.title && (
        <HudChip
          key={fill(cue.hud.table, cue.hud)}
          label="Deine Erhöhung"
          text={fill(cue.hud.table, cue.hud)}
          danger={cue.hud.flags.includes("busted")}
          align="right"
        />
      )}

      {cue.friend && phase === "playing" && (
        <FriendPopup
          key={cue.friend.n}
          name={story.characters.jonas}
          text={cue.friend.text}
          face={<JonasFace />}
          position={inOffice ? "left-[33cqw] top-[36cqw]" : "left-[4cqw] top-[10cqw]"}
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
          kicker="Work · 3 Entscheidungen"
          title={story.title}
          subtitle="Zwei Jahre, ein gerettetes Projekt, null Euro mehr. Heute fragst du."
          onStart={play}
        />
      )}

      {phase === "end" && (
        <EndCard
          kicker={`Dein Ergebnis: ${raise(cue.hud)} im Monat`}
          disclaimer={story.disclaimer}
          onReplay={play}
        />
      )}
    </Stage>
  );
}

function ResultCard({ ending, state }: { ending: Ending; state: State }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { x: "120%", duration: 0.6, ease: "back.out(1.2)" });
  });
  return (
    <div className="pointer-events-none absolute inset-y-0 right-[3cqw] flex w-[46cqw] items-center">
      <div ref={ref} className="w-full rounded-[2.4cqw] bg-white p-[3cqw] shadow-2xl">
        <p className="inline-block rounded-full bg-[#2b3a67]/10 px-[1.4cqw] py-[0.4cqw] text-[1.2cqw] font-bold uppercase tracking-[0.2em] text-[#2b3a67]/70">
          Ein möglicher Verlauf
        </p>
        <h2 className="mt-[1cqw] text-[4.4cqw] font-black leading-none text-[#1e294b]">
          {ending.title}
        </h2>
        <p className="mt-[1.6cqw] text-[1.2cqw] font-bold uppercase tracking-[0.25em] text-[#2b3a67]/60">
          Mehr pro Monat
        </p>
        <p
          className="text-[7cqw] font-black leading-none"
          style={{ color: state.offer > 0 ? "#2f9e8f" : "#ef6f5e" }}
        >
          {euro(state.offer)} €
        </p>
        <p className="mt-[0.8cqw] text-[1.8cqw] text-[#2b3a67]/80">{fill(ending.text, state)}</p>
      </div>
    </div>
  );
}
