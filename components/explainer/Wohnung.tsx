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
import audioManifest from "@/stories/traumwohnung.audio.json";
import type { Mood } from "./art";
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
import {
  ChatScene,
  ListingScene,
  SofaScene,
  WohnungIcon,
  type ChatMessage,
} from "./wohnung-art";

// Situation "Die Traumwohnung": ein Fake-Inserat und ein sehr netter Vermieter.

const AUDIO = audioManifest as Record<string, string>;

type DecisionBeat = Extract<Beat, { type: "decision" }>;
type Speaker = "narrator" | "markus";
type View = "sofa" | "listing" | "chat" | "result" | "reveal" | "strong";

type Cue = {
  view: View;
  night: boolean;
  mood: Mood;
  stats: number;
  talking: Speaker | null;
  caption: { who: Speaker; text: string } | null;
  messages: ChatMessage[];
  search: boolean;
  friend: { text: string; n: number } | null;
  title: { title: string; time: string } | null;
  hud: State;
  revealStep: number;
  ending: Ending | null;
};

const START: Cue = {
  view: "sofa",
  night: false,
  mood: "neutral",
  stats: 0,
  talking: null,
  caption: null,
  messages: [],
  search: false,
  friend: null,
  title: null,
  hud: initialState,
  revealStep: 0,
  ending: null,
};

const SPEAKER_LABEL: Record<Speaker, string> = { narrator: "Erzähler", markus: "Markus" };

type Phase = "poster" | "playing" | "end";
type Ask = { beat: DecisionBeat; number: number; state: State; resolve: (o: Option) => void };

function lost(state: State): string {
  return `${euro(state.offer)} € verloren`;
}

export default function Wohnung({ story, voice }: { story: Story; voice: VoiceLine[] }) {
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
    await wait(1100);
    await say("w1");
    set({ stats: 1, mood: "worried" });
    pop();
    await wait(500);
    set({ stats: 2 });
    pop();
    await say("w2");
    if (!alive()) return;
    set({ view: "listing", caption: null, mood: "surprised" });
    await say("w3");
    set({ mood: "happy" });
    await say("w4");
    if (!alive()) return;
    set({ view: "chat", caption: null, mood: "happy" });
    await wait(1100);

    // --- Story aus der Story-Datei ---
    let state = initialState;
    let index = 0;
    let firstScene = true;
    let messages: ChatMessage[] = [];

    async function show(entries: LogEntry[], st: State) {
      for (const entry of entries) {
        if (!alive()) return;
        if (entry.kind === "table") {
          set({ hud: { ...st, table: entry.table } });
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
          set({
            title: null,
            caption: null,
            night: Boolean(entry.night),
            mood: entry.night ? "worried" : "neutral",
          });
          await wait(600);
          continue;
        }

        const { line } = entry;
        const voiceId = line.voice?.replace(/\{(\w+)\}/g, (_, key) => st.choices[key] ?? "");
        if (line.from === "jonas") {
          set({ caption: null, friend: { text: line.text, n: ++n } });
          pop();
          await wait(3400);
          set({ friend: null });
        } else if (line.from === "erzaehler") {
          if (line.visual === "search") {
            set({ search: true, mood: "surprised" });
            pop();
          }
          await say(voiceId, line.text, "narrator");
        } else if (line.from === "du") {
          messages = [...messages, { from: "du", text: line.text }];
          set({ caption: null, messages, mood: "neutral" });
          pop();
          await wait(1900);
        } else {
          messages = [...messages, { from: "markus", text: line.text, visual: line.visual }];
          set({ messages });
          pop();
          await say(voiceId, line.text, "markus");
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
        set({ mood: "worried" });
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
      await show(chosen.entries.slice(0, 1), state);
      // Das Geld ist in dem Moment weg, in dem du überweist.
      set({ hud: state, mood: state.offer > current.offer ? "happy" : "neutral" });
      await show(chosen.entries.slice(1), state);
      if (!alive()) return;
      await wait(900);
      index++;
    }

    // --- Ergebnis, Erklärung, starker Verlauf ---
    const ending = pickEnding(story, state);
    set({
      view: "result",
      night: false,
      caption: null,
      search: false,
      hud: state,
      ending,
      stats: 0,
      mood: ending.id === "safe" ? "happy" : "worried",
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

  const showChip = phase === "playing" && cue.view === "chat" && !cue.title;
  const extra = cue.hud.flags.includes("idsent") ? " + Ausweis" : "";

  return (
    <Stage onSkip={() => !ask && skipNow()}>
      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full">
        {cue.view === "sofa" && <SofaScene key={runKey} mood={cue.mood} stats={cue.stats} />}
        {cue.view === "listing" && <ListingScene mood={cue.mood} />}
        {cue.view === "chat" && (
          <ChatScene
            night={cue.night}
            mood={cue.mood}
            messages={cue.messages}
            markusTalking={cue.talking === "markus"}
            search={cue.search}
          />
        )}
        {cue.view === "result" && (
          <g transform="translate(-340 0)">
            <SofaScene mood={cue.mood} stats={0} />
          </g>
        )}
      </svg>

      {cue.view === "result" && cue.ending && (
        <ResultCard story={story} ending={cue.ending} state={cue.hud} />
      )}
      {cue.view === "reveal" && (
        <RevealPanel
          story={story}
          step={cue.revealStep}
          icons={story.reveal.map((card, i) => (
            <WohnungIcon key={card.title} kind={i} />
          ))}
        />
      )}
      {cue.view === "strong" && (
        <StrongPanel
          story={story}
          strongValue="0 € verloren"
          yourValue={lost(cue.hud) + extra}
        />
      )}

      {showChip && (
        <HudChip
          key={cue.hud.offer}
          label="An Markus überwiesen"
          text={fill(cue.hud.table, cue.hud)}
          danger={cue.hud.offer > 0}
        />
      )}

      {cue.friend && phase === "playing" && (
        <FriendPopup
          key={cue.friend.n}
          name={story.characters.jonas}
          text={cue.friend.text}
          face={<JonasFace />}
        />
      )}

      {cue.title && <TitleCard title={cue.title.title} time={cue.title.time} />}

      {cue.caption && phase === "playing" && !ask && (
        <Caption
          label={SPEAKER_LABEL[cue.caption.who]}
          text={cue.caption.text}
          accent={cue.caption.who === "markus" ? "#f2a33a" : "#7fd6c8"}
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
          kicker="Alltag · 3 Entscheidungen"
          title={story.title}
          subtitle="420 € warm, mit Balkon. Wo ist der Haken?"
          onStart={play}
        />
      )}

      {phase === "end" && (
        <EndCard
          kicker={`Dein Ergebnis: ${lost(cue.hud)}${extra}`}
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
  const extras = state.flags.map((flag) => story.flagLabels[flag]).filter(Boolean);
  const safe = state.offer === 0 && extras.length === 0;
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
          Verloren
        </p>
        <p
          className="text-[7cqw] font-black leading-none"
          style={{ color: safe ? "#2f9e8f" : "#ef6f5e" }}
        >
          {euro(state.offer)} €
        </p>
        {extras.map((extra) => (
          <p key={extra} className="mt-[0.6cqw] text-[1.8cqw] font-bold text-[#ef6f5e]">
            + {extra}
          </p>
        ))}
        <p className="mt-[0.8cqw] text-[1.6cqw] text-[#2b3a67]/70">{ending.text}</p>
      </div>
    </div>
  );
}
