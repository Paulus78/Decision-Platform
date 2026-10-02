"use client";

import { useState } from "react";
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
import type { Channel, Option, Story } from "@/lib/story";

const CHANNEL_LABEL: Record<Channel, string> = {
  call: "Anruf",
  mail: "Mail",
  chat: "Chat",
};

type Run = { index: number; state: State; log: LogEntry[] };

// Schritt 1: reine Textversion ohne Design. Dient zum Testen von Story und Engine.
export default function TextPlayer({ story }: { story: Story }) {
  const [run, setRun] = useState<Run | null>(null);
  const [showStrongRun, setShowStrongRun] = useState(false);

  function start() {
    const first = advance(story.beats, 0, initialState);
    setRun({ index: first.index, state: first.state, log: first.entries });
    setShowStrongRun(false);
  }

  if (!run) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-6">
        <h1 className="text-2xl font-bold">{story.title}</h1>
        {story.intro.map((text) => (
          <p key={text}>{text}</p>
        ))}
        <button
          onClick={start}
          className="rounded bg-black px-4 py-3 text-white"
        >
          Rangehen
        </button>
      </main>
    );
  }

  const beat = story.beats[run.index];
  const decision = beat?.type === "decision" ? beat : null;
  const finished = !beat;

  function pick(option: Option) {
    if (!run || !decision) return;
    const chosen = choose(run.state, decision, option);
    const rest = advance(story.beats, run.index + 1, chosen.state);
    setRun({
      index: rest.index,
      state: rest.state,
      log: [...run.log, ...chosen.entries, ...rest.entries],
    });
  }

  const ending = finished ? pickEnding(story, run.state) : null;
  const extras = run.state.flags
    .map((flag) => story.flagLabels[flag])
    .filter(Boolean);

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-6">
      <div className="sticky top-0 border-b bg-background py-2 text-sm">
        Zahl auf dem Tisch: <strong>{fill(run.state.table, run.state)}</strong>
      </div>

      {run.log.map((entry, i) =>
        entry.kind === "scene" ? (
          <h2 key={i} className="mt-4 text-lg font-bold">
            {entry.title}{" "}
            <span className="text-sm font-normal opacity-60">
              · {entry.time}
            </span>
          </h2>
        ) : (
          <p key={i} className={entry.line.from === "du" ? "text-right" : ""}>
            <span className="block text-xs opacity-60">
              {story.characters[entry.line.from]} ·{" "}
              {CHANNEL_LABEL[entry.line.channel]}
            </span>
            {entry.line.text}
          </p>
        ),
      )}

      {decision && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold">Was sagst du?</p>
          {decision.options.map((option) => (
            <button
              key={option.id}
              onClick={() => pick(option)}
              className="rounded border px-4 py-3 text-left"
            >
              {option.id}: {fill(option.text, run.state)}
            </button>
          ))}
        </div>
      )}

      {ending && (
        <>
          <section className="mt-4 rounded border p-4">
            <p className="text-xs opacity-60">{story.disclaimer}</p>
            <h2 className="mt-2 text-xl font-bold">{ending.title}</h2>
            <p>{ending.text}</p>
            <p className="mt-2">
              Dein Ergebnis: <strong>{euro(run.state.offer)} €</strong>
              {extras.length > 0 && ` + ${extras.join(" + ")}`}
              <br />
              Dein Ziel war: {euro(story.goal)} €
            </p>
            <p className="mt-2">
              <span className="block text-xs opacity-60">
                {story.characters.jonas} · Chat
              </span>
              {fill(ending.jonas, run.state)}
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold">Was ist gerade passiert?</h2>
            {story.reveal.map((card) => (
              <div key={card.title} className="rounded border p-4">
                <h3 className="font-bold">{card.title}</h3>
                <p>{card.text}</p>
                <p className="mt-2 text-xs opacity-60">
                  {card.strength} · {card.source}
                </p>
              </div>
            ))}
          </section>

          {showStrongRun ? (
            <section className="rounded border p-4">
              <h2 className="text-lg font-bold">{story.strongRun.title}</h2>
              <ol className="mt-2 flex list-decimal flex-col gap-2 pl-5">
                {story.strongRun.steps.map((step) => (
                  <li key={step.text}>
                    „{step.text}“{" "}
                    <span className="text-sm opacity-60">→ {step.label}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-2">
                Starker Verlauf: <strong>{euro(story.strongRun.result)} €</strong>{" "}
                · Du: {euro(run.state.offer)} €
              </p>
            </section>
          ) : (
            <button
              onClick={() => setShowStrongRun(true)}
              className="rounded border px-4 py-3"
            >
              Zeig mir einen starken Verlauf
            </button>
          )}

          <button
            onClick={start}
            className="rounded bg-black px-4 py-3 text-white"
          >
            Nochmal spielen
          </button>
        </>
      )}
    </main>
  );
}
