"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  advance,
  choose,
  fill,
  initialState,
  pickEnding,
  type LogEntry,
  type State,
} from "@/lib/engine";
import type { Beat, Line, Option, Story } from "@/lib/story";
import {
  CallScene,
  DecisionSheet,
  Hud,
  IntroCard,
  MailScene,
  Notification,
  OutroScene,
  Poster,
  ResultScene,
  RevealScene,
  Ringing,
  TitleCard,
} from "./scenes";

type DecisionBeat = Extract<Beat, { type: "decision" }>;

// Was gerade groß im Bild ist. `n` sorgt dafür, dass jede neue Einstellung
// frisch einblendet.
type Screen =
  | { kind: "poster" }
  | { kind: "intro"; step: number }
  | { kind: "title"; title: string; time: string; n: number }
  | { kind: "ringing"; n: number }
  | { kind: "call"; line: Line; n: number }
  | { kind: "mail"; line: Line; n: number }
  | { kind: "result" }
  | { kind: "reveal" }
  | { kind: "outro" };

type Ask = {
  beat: DecisionBeat;
  number: number;
  state: State;
  resolve: (option: Option) => void;
};

// Wie lange ein Text stehen bleibt: Grundzeit plus Lesezeit pro Zeichen.
function hold(text: string): number {
  return Math.min(5200, Math.max(1800, 1100 + text.length * 48));
}

export default function VideoPlayer({ story }: { story: Story }) {
  const [screen, setScreen] = useState<Screen>({ kind: "poster" });
  const [notif, setNotif] = useState<{ line: Line; n: number } | null>(null);
  const [hud, setHud] = useState<State>(initialState);
  const [ask, setAsk] = useState<Ask | null>(null);
  const [progress, setProgress] = useState(0);
  const [runKey, setRunKey] = useState(0);

  // Jeder Durchlauf bekommt eine Nummer. Ein alter Durchlauf merkt daran,
  // dass er abgelöst wurde, und hört auf.
  const runId = useRef(0);
  const skip = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      runId.current++;
    },
    [],
  );

  // Wenn die Entscheidungskarte hochfährt, wird der Platz für das Bild kleiner.
  // Dann schrumpft das Bild, statt abgeschnitten zu werden.
  const area = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const a = area.current;
    const i = inner.current;
    if (!a || !i) return;
    const fit = () => {
      const scale = Math.min(1, (a.clientHeight - 12) / i.offsetHeight);
      i.style.transform = scale < 1 ? `scale(${scale})` : "";
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(a);
    observer.observe(i);
    return () => observer.disconnect();
  }, []);

  const decisions = story.beats.filter((b) => b.type === "decision");

  // Wartet `ms` Millisekunden. Ein Tipp aufs Bild springt sofort weiter.
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

  async function play() {
    const id = ++runId.current;
    const alive = () => runId.current === id;
    let n = 0;
    let lastChannel: string | null = null;

    setRunKey(id);
    setHud(initialState);
    setNotif(null);
    setAsk(null);
    setProgress(0);

    for (let step = 0; step < story.intro.length; step++) {
      setScreen({ kind: "intro", step });
      await wait(hold(story.intro[step]) * 0.7);
      if (!alive()) return;
    }

    async function show(entries: LogEntry[]) {
      for (const entry of entries) {
        if (!alive()) return;
        if (entry.kind === "table") {
          setHud((h) => ({ ...h, table: entry.table }));
        } else if (entry.kind === "scene") {
          setScreen({
            kind: "title",
            title: entry.title,
            time: entry.time,
            n: ++n,
          });
          await wait(1900);
        } else if (entry.line.channel === "chat") {
          setNotif({ line: entry.line, n: ++n });
          await wait(hold(entry.line.text) + 400);
          setNotif(null);
        } else {
          const { line } = entry;
          if (line.channel === "call" && lastChannel !== "call") {
            setScreen({ kind: "ringing", n: ++n });
            await wait(2000);
            if (!alive()) return;
          }
          lastChannel = line.channel;
          setScreen({
            kind: line.channel === "call" ? "call" : "mail",
            line,
            n: ++n,
          });
          await wait(hold(line.text));
        }
      }
    }

    let state = initialState;
    let index = 0;
    for (;;) {
      const next = advance(story.beats, index, state);
      state = next.state;
      await show(next.entries);
      if (!alive()) return;
      index = next.index;
      setProgress(index / story.beats.length);

      const beat = story.beats[index];
      if (!beat || beat.type !== "decision") break;

      const current = state;
      const option = await new Promise<Option>((resolve) =>
        setAsk({
          beat,
          number: decisions.indexOf(beat) + 1,
          state: current,
          resolve,
        }),
      );
      if (!alive()) return;
      setAsk(null);

      const chosen = choose(state, beat, option);
      state = chosen.state;
      // Erst die eigene Antwort zeigen, dann die Reaktion, dann springt die Zahl.
      await show(chosen.entries.slice(0, 1));
      setHud((h) => ({ ...h, table: chosen.state.table }));
      await show(chosen.entries.slice(1));
      if (!alive()) return;
      setHud(chosen.state);
      index++;
    }

    setProgress(1);
    setHud(state);
    setScreen({ kind: "result" });
    await wait(2800);
    if (!alive()) return;
    const jonas = pickEnding(story, state).jonas;
    setNotif({
      line: { from: "jonas", channel: "chat", text: fill(jonas, state) },
      n: ++n,
    });
    await wait(4500);
    if (alive()) setNotif(null);
  }

  const playing = !["poster", "result", "reveal", "outro"].includes(screen.kind);

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-black">
      <div
        onClick={() => !ask && skip.current?.()}
        className="relative flex aspect-[9/16] h-dvh max-h-[177.78vw] flex-col overflow-clip bg-ink [container-type:size]"
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-[30%] -top-[10%] h-[70%] w-[90%] rounded-full bg-indigo-600/30 blur-[18cqw]"
            style={{ animation: "drift 14s ease-in-out infinite" }}
          />
          <div
            className="absolute -bottom-[15%] -right-[30%] h-[60%] w-[90%] rounded-full bg-fuchsia-600/20 blur-[18cqw]"
            style={{ animation: "drift 18s ease-in-out infinite reverse" }}
          />
        </div>

        <div className={`relative z-20 ${playing ? "" : "invisible"}`}>
          <Hud key={runKey} state={hud} progress={progress} />
        </div>

        <div
          ref={area}
          className="relative z-10 flex min-h-0 flex-1 items-center justify-center"
        >
          <div ref={inner} className="flex w-full justify-center">
            {screen.kind === "poster" && (
              <Poster story={story} onStart={play} />
            )}
            {screen.kind === "intro" && (
              <IntroCard
                key={screen.step}
                text={story.intro[screen.step]}
                step={screen.step}
                total={story.intro.length}
              />
            )}
            {screen.kind === "title" && (
              <TitleCard
                key={screen.n}
                title={screen.title}
                time={screen.time}
              />
            )}
            {screen.kind === "ringing" && <Ringing key={screen.n} />}
            {screen.kind === "call" && (
              <CallScene
                key={screen.n}
                line={screen.line}
                name={story.characters[screen.line.from]}
              />
            )}
            {screen.kind === "mail" && (
              <MailScene key={screen.n} line={screen.line} />
            )}
            {screen.kind === "result" && (
              <ResultScene
                story={story}
                ending={pickEnding(story, hud)}
                state={hud}
                onNext={() => {
                  setNotif(null);
                  setScreen({ kind: "reveal" });
                }}
              />
            )}
            {screen.kind === "reveal" && (
              <RevealScene
                story={story}
                onDone={() => setScreen({ kind: "outro" })}
              />
            )}
            {screen.kind === "outro" && (
              <OutroScene story={story} state={hud} onReplay={play} />
            )}
          </div>

          {notif && (
            <div className="absolute inset-x-[5cqw] top-[3cqw] z-30">
              <Notification
                key={notif.n}
                line={notif.line}
                name={story.characters[notif.line.from]}
              />
            </div>
          )}
        </div>

        {ask && (
          <div className="relative z-30">
            <DecisionSheet
              key={ask.beat.id}
              number={ask.number}
              total={decisions.length}
              options={ask.beat.options}
              state={ask.state}
              onPick={ask.resolve}
            />
          </div>
        )}
      </div>
    </main>
  );
}
