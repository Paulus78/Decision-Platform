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
import audioManifest from "@/stories/gehaltsangebot.audio.json";
import { CallScene, HomeScene, type Mood } from "./art";
import { JonasFace, MailScene, RevealIcon, type Mail } from "./scenes2";
import { pop, ring } from "./sfx";
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
    mark(0.88);
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
    <Stage onSkip={() => !ask && skipNow()} controls={phase === "playing" ? controls : null}>
      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full">
        {cue.view === "home" && (
          <HomeScene key={runKey} mood={cue.youMood} thought={cue.thought} ringing={cue.ringing} />
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
      {cue.view === "reveal" && (
        <RevealPanel
          story={story}
          choices={cue.hud.choices}
          step={cue.revealStep}
          icons={story.reveal.map((card, i) => (
            <RevealIcon key={card.title} kind={i} />
          ))}
        />
      )}
      {cue.view === "strong" && (
        <StrongPanel
          story={story}
          strongValue={`${euro(story.strongRun.result)} €`}
          yourValue={`${euro(cue.hud.offer)} €`}
        />
      )}

      {showChip && (
        <HudChip
          key={fill(cue.hud.table, cue.hud)}
          label="Zahl auf dem Tisch"
          text={fill(cue.hud.table, cue.hud)}
        />
      )}

      {cue.jonas && phase === "playing" && (
        <FriendPopup
          key={cue.jonas.n}
          name={story.characters.jonas}
          text={cue.jonas.text}
          face={<JonasFace />}
        />
      )}

      {cue.title && <TitleCard title={cue.title.title} time={cue.title.time} />}

      {cue.caption && phase === "playing" && !ask && (
        <Caption
          label={SPEAKER_LABEL[cue.caption.who]}
          text={cue.caption.text}
          accent={cue.caption.who === "brandt" ? "#f2a33a" : "#7fd6c8"}
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
          subtitle="Sie wollen dich. Jetzt geht es ums Geld."
          onStart={play}
        />
      )}

      {phase === "end" && (
        <EndCard
          kicker={`Dein Ergebnis: ${euro(cue.hud.offer)} €`}
          disclaimer={story.disclaimer}
          onReplay={play}
        />
      )}
    </Stage>
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
