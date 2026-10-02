"use client";

import { useEffect, useState } from "react";
import { Brain } from "@/components/explainer/date-art";
import { pop } from "@/components/explainer/sfx";
import {
  ALL_LEGENDS,
  EVENTS_PER_DAY,
  FIRST,
  MAX,
  NAMES,
  POOL,
  PROMOTION,
  RANKS,
  START,
  outcome,
  updateSave,
  useSave,
  type Choice,
  type Event,
  type Mood,
  type Outcome,
} from "@/lib/aufstieg";
import { CeoAvatar, GameScene, RankAvatar } from "./art";

// „Der Aufstieg“, Stufe 1: ein Tag als Praktikant.
// Ablauf: Begrüßung durch den CEO (Spitzname) → fünf zufällige Ereignisse → Abrechnung.

type Values = { a: number; v: number; n: number };
type Phase = "start" | "event" | "react" | "end";
type Entry = { event: Event; choice: Choice };

const METERS: { key: keyof Values; label: string; color: string }[] = [
  { key: "a", label: "Ansehen", color: "#f2a33a" },
  { key: "v", label: "Verbündete", color: "#2f9e8f" },
  { key: "n", label: "Nerven", color: "#ef6f5e" },
];

const clamp = (n: number) => Math.max(0, Math.min(MAX, n));
const withNick = (text: string, nick: string) => text.replaceAll("{nick}", nick);

function shuffled<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Game() {
  const save = useSave();
  const [phase, setPhase] = useState<Phase>("start");
  const [deck, setDeck] = useState<Event[]>([FIRST]);
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState<Values>(START);
  const [nick, setNick] = useState("der Neue");
  const [picked, setPicked] = useState<Choice | null>(null);
  const [log, setLog] = useState<Entry[]>([]);
  const [result, setResult] = useState<Outcome | null>(null);
  const [talking, setTalking] = useState(false);
  const [shared, setShared] = useState(false);

  // Die Figur bewegt nach einer Antwort kurz den Mund.
  useEffect(() => {
    if (!picked) return;
    const stop = setTimeout(() => setTalking(false), 1800);
    return () => clearTimeout(stop);
  }, [picked]);

  const event = deck[index];

  function start() {
    setDeck([FIRST, ...shuffled(POOL).slice(0, EVENTS_PER_DAY)]);
    setIndex(0);
    setValues(START);
    setNick("der Neue");
    setPicked(null);
    setLog([]);
    setResult(null);
    setShared(false);
    setPhase("event");
  }

  function pick(choice: Choice) {
    if (picked) return;
    pop();
    setPicked(choice);
    setTalking(true);
    setValues((v) => ({
      a: clamp(v.a + (choice.effect.a ?? 0)),
      v: clamp(v.v + (choice.effect.v ?? 0)),
      n: clamp(v.n + (choice.effect.n ?? 0)),
    }));
    if (choice.nickname) setNick(choice.nickname);
    setLog((l) => [...l, { event, choice }]);
    setPhase("react");
  }

  function next() {
    const last = index + 1 >= deck.length;
    const end = outcome(values, last);
    if (end) {
      const legends = log.map((entry) => entry.choice.legend).filter((l): l is string => Boolean(l));
      updateSave((s) => ({
        runs: s.runs + 1,
        promoted: s.promoted || Boolean(end.promoted),
        legends: [...new Set([...s.legends, ...legends])],
        outcomes: [...new Set([...s.outcomes, end.id])],
      }));
      setResult(end);
      setPhase("end");
      return;
    }
    setPicked(null);
    setIndex(index + 1);
    setPhase("event");
  }

  async function share() {
    if (!result) return;
    const text = `Mein erster Tag bei NOVARA: „${result.title}“. Der CEO nennt mich „${nick}“. Schaffst du die Beförderung?`;
    const url = `${window.location.origin}/aufstieg`;
    try {
      if (navigator.share) await navigator.share({ text, url });
      else await navigator.clipboard.writeText(`${text} ${url}`);
      setShared(true);
    } catch {
      // Teilen abgebrochen.
    }
  }

  // ---------- Startbild ----------
  if (phase === "start") {
    return (
      <section className="bg-navy text-white">
        <div className="mx-auto grid w-full max-w-[1120px] items-center gap-10 px-5 py-14 lg:grid-cols-[7fr_5fr]">
          <div>
            <p className="font-bold text-sun">Ein Spiel von Generalprobe</p>
            <h1 className="mt-1 font-display text-[clamp(56px,10vw,128px)] font-extrabold leading-[0.9] tracking-tighter">
              Der Aufstieg
            </h1>
            <p className="mt-6 max-w-[36rem] text-xl leading-relaxed text-white/85">
              Erster Tag bei NOVARA. Du bist Praktikant, also Luft. Der CEO hat die Firma geerbt und hält dich
              für ein Möbelstück. Dein Ziel: sein Stuhl.
            </p>
            <button
              onClick={start}
              className="press mt-8 rounded-[14px] bg-sun px-7 py-4 text-xl font-bold text-navy hover:bg-white"
            >
              Ersten Tag starten
            </button>
            {save && save.runs > 0 && (
              <p className="mt-4 text-white/70">
                Bisher: {save.runs} {save.runs === 1 ? "Tag" : "Tage"} gespielt, {save.legends.length} von{" "}
                {ALL_LEGENDS.length} Bürolegenden gefunden.
              </p>
            )}
          </div>
          <div className="flex items-end gap-2">
            <CeoAvatar className="w-[58%] max-w-[300px]" />
            <p className="pop-in mb-24 rounded-[20px] rounded-bl-[4px] bg-white px-4 py-3 font-display text-lg font-bold leading-snug text-navy shadow-paper [animation-delay:0.4s]">
              <span className="block text-sm font-bold text-tealdark">Richard von Thalberg, CEO</span>
              „Wer hat das hier reingelassen?“
            </p>
          </div>
        </div>

        {/* Die Karriereleiter */}
        <div className="bg-[#151d38]">
          <ol className="mx-auto grid w-full max-w-[1120px] grid-cols-5 gap-3 px-5 py-8">
            {RANKS.map((rank, i) => (
              <li key={rank.title} className={`text-center ${i === 0 ? "" : "opacity-45"}`}>
                <RankAvatar rank={i} className="mx-auto h-20 w-20 sm:h-28 sm:w-28" />
                <p className="mt-2 font-display text-base font-extrabold sm:text-xl">{rank.title}</p>
                <p className="hidden text-sm text-white/70 sm:block">{i === 0 ? "Hier fängst du an" : rank.outfit}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  // ---------- Abrechnung ----------
  if (phase === "end" && result) {
    const legends = log.map((entry) => entry.choice.legend).filter((l): l is string => Boolean(l));
    // Die Büro-Weisheit zu dem Ereignis, das am meisten Ansehen gekostet hat.
    const lesson = [...log]
      .filter((entry) => entry.event.lesson)
      .sort((x, y) => (x.choice.effect.a ?? 0) - (y.choice.effect.a ?? 0))[0]?.event.lesson;
    return (
      <section className="bg-navy text-white">
        <div className="mx-auto grid w-full max-w-[1120px] gap-12 px-5 py-14 lg:grid-cols-[7fr_5fr]">
          <div>
            <p className="font-bold text-sun">Ende des ersten Tages</p>
            <h1 className="mt-1 font-display text-[clamp(48px,8vw,96px)] font-extrabold leading-[0.95] tracking-tighter">
              {result.title}
            </h1>
            <p className="mt-5 max-w-[36rem] text-xl leading-relaxed text-white/85">{result.text}</p>
            <p className="mt-6 inline-block rounded-[20px] rounded-bl-[4px] bg-white px-4 py-3 font-display text-lg font-bold leading-snug text-navy shadow-paper">
              <span className="block text-sm font-bold text-tealdark">{NAMES[result.who]}</span>„
              {withNick(result.quote, nick)}“
            </p>
            <Meters values={values} />
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                onClick={start}
                className="press rounded-[14px] bg-sun px-6 py-3.5 text-lg font-bold text-navy hover:bg-white"
              >
                {result.promoted ? "Noch einen Tag spielen" : "Neuer Versuch"}
              </button>
              <button
                onClick={share}
                className="font-bold text-white underline decoration-2 underline-offset-4 hover:text-sun"
              >
                {shared ? "Kopiert. Jetzt verschicken." : "Ergebnis teilen"}
              </button>
            </div>
            {result.promoted && (
              <p className="mt-5 max-w-[36rem] text-white/70">
                Die nächste Stufe (Werkstudent) ist noch nicht gebaut. Dies ist ein Prototyp der ersten Stufe.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {/* Visitenkarte */}
            <div className="-rotate-2 rounded-[14px] bg-white p-6 text-navy shadow-paper-lg">
              <p className="flex items-center gap-2 text-sm font-black tracking-widest">
                <span className="h-3.5 w-3.5 rounded-full bg-sun" />
                NOVARA
              </p>
              <p className="mt-5 font-display text-[39px] font-extrabold leading-none">„{nick}“</p>
              <p className="mt-2 text-lg font-semibold text-navy/75">{result.card}</p>
            </div>
            {lesson && (
              <div>
                <p className="font-bold text-sun">Büro-Weisheit des Tages</p>
                <p className="mt-1 font-display text-2xl font-bold leading-snug">{lesson}</p>
                <p className="mt-1 text-sm text-white/60">Erfahrungswissen, keine Studie.</p>
              </div>
            )}
            <div>
              <p className="font-bold text-sun">
                Bürolegenden: {save ? save.legends.length : 0} von {ALL_LEGENDS.length}
              </p>
              {legends.length > 0 ? (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {legends.map((legend) => (
                    <li key={legend} className="font-display text-xl font-bold">
                      {legend}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-white/70">Heute keine neue. Die verrückten Antworten helfen.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ---------- Ein Ereignis ----------
  const reply = picked?.reply;
  const who = reply ? reply.who : event.who;
  const npcMood: Mood = reply ? (reply.mood ?? "neutral") : (event.mood ?? "neutral");
  const delta = picked?.effect.a ?? 0;
  const youMood: Mood = picked ? (delta > 0 ? "happy" : delta < 0 ? "worried" : "surprised") : index === 0 ? "worried" : "neutral";
  const speech = reply ? reply.text : event.line;
  const speaker = reply ? reply.who : event.who;

  return (
    <section className="bg-navy text-white">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4">
        <p className="font-display text-xl font-extrabold">
          {RANKS[0].title} <span className="text-sun">„{nick}“</span>
        </p>
        <Meters values={values} compact />
        <p className="text-sm font-bold text-white/70">
          Ereignis {index + 1} von {deck.length}
        </p>
      </div>

      <div className="relative overflow-clip bg-creme">
        <svg
          viewBox="0 230 1600 670"
          preserveAspectRatio="xMidYMin slice"
          className="block aspect-video w-full md:aspect-auto md:h-[44vh] md:max-h-[500px] md:min-h-[320px]"
          aria-hidden="true"
        >
          <GameScene
            who={who}
            npcMood={npcMood}
            npcTalking={talking}
            youMood={youMood}
            rank={0}
            size={values.a / MAX}
            sceneKey={`${event.id}-${who}`}
          />
        </svg>
        {speech && speaker !== "erzaehler" && (
          <div className="absolute left-1/2 top-[9%] hidden w-[30%] min-w-[17rem] max-w-[26rem] -translate-x-1/2 md:block">
            <div
              key={`${event.id}-${Boolean(picked)}`}
              className="pop-in rounded-[20px] rounded-br-[4px] bg-white px-5 py-4 text-navy shadow-paper"
            >
              <p className="text-sm font-bold text-tealdark">{NAMES[speaker]}</p>
              <p className="font-display text-xl font-bold leading-snug">„{speech}“</p>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-[1120px] px-5 pb-14 pt-7">
        {phase === "event" && (
          <div key={event.id}>
            <p className="max-w-[46rem] font-display text-[clamp(22px,2.6vw,31px)] font-bold leading-tight">
              {event.setup}
            </p>
            {event.line && (
              <p className="mt-4 rounded-[18px] rounded-tl-[4px] bg-white px-4 py-3 text-navy md:hidden">
                <span className="block text-sm font-bold text-tealdark">{NAMES[event.who]}</span>
                <span className="font-display text-lg font-bold leading-snug">„{event.line}“</span>
              </p>
            )}
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {event.choices.map((choice, i) => (
                <button
                  key={choice.text}
                  onClick={() => pick(choice)}
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                  className="rise-in press flex items-center gap-4 rounded-[18px] bg-white p-4 text-left text-navy hover:bg-sun md:flex-col md:items-start md:p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy font-display text-lg font-extrabold text-white">
                    {"ABC"[i]}
                  </span>
                  <span className="font-display text-xl font-bold leading-tight">
                    <ChoiceText text={choice.text} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "react" && picked && reply && (
          <div className="grid gap-8 lg:grid-cols-[7fr_5fr]">
            <div>
              {reply.who === "erzaehler" ? (
                <p className="pop-in font-display text-[clamp(22px,2.6vw,31px)] font-bold leading-tight">{reply.text}</p>
              ) : (
                <p className="pop-in rounded-[18px] rounded-tl-[4px] bg-white px-4 py-3 text-navy md:hidden">
                  <span className="block text-sm font-bold text-tealdark">{NAMES[reply.who]}</span>
                  <span className="font-display text-lg font-bold leading-snug">„{reply.text}“</span>
                </p>
              )}
              {picked.brain && (
                <div className="pop-in mt-5 flex items-center gap-3 [animation-delay:0.5s]">
                  <span className="h-16 w-16 shrink-0">
                    <svg viewBox="30 130 240 240" className="h-full w-full" aria-hidden="true">
                      <Brain talking={false} />
                    </svg>
                  </span>
                  <p className="rounded-[18px] rounded-bl-[4px] bg-[#fde6ec] px-4 py-3 font-display text-xl font-bold leading-snug text-navy">
                    <span className="block text-sm font-bold text-[#a8405c]">Dein Gehirn</span>
                    {picked.brain}
                  </p>
                </div>
              )}
              {picked.nickname && (
                <p className="pop-in mt-5 font-display text-2xl font-extrabold text-sun [animation-delay:0.8s]">
                  Dein Spitzname bei NOVARA: „{picked.nickname}“
                </p>
              )}
              {picked.legend && (
                <p className="pop-in mt-5 inline-block -rotate-1 rounded-[14px] bg-sun px-4 py-2.5 font-display text-xl font-extrabold text-navy shadow-paper [animation-delay:0.8s]">
                  Bürolegende: {picked.legend}
                </p>
              )}
            </div>
            <div>
              <ul className="flex flex-wrap gap-2">
                {METERS.map((meter) => {
                  const change = picked.effect[meter.key] ?? 0;
                  if (change === 0) return null;
                  return (
                    <li
                      key={meter.key}
                      className={`pop-in rounded-full px-4 py-1.5 font-display text-lg font-extrabold [animation-delay:0.3s] ${
                        change > 0 ? "bg-white text-navy" : "bg-coral text-navy"
                      }`}
                    >
                      {meter.label} {change > 0 ? `+${change}` : `−${Math.abs(change)}`}
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={next}
                className="press mt-6 rounded-[14px] bg-sun px-7 py-4 text-xl font-bold text-navy hover:bg-white"
              >
                {index + 1 >= deck.length ? "Feierabend" : "Weiter"}
              </button>
              {index + 1 >= deck.length && (
                <p className="mt-3 text-white/70">Für die Beförderung brauchst du {PROMOTION} Ansehen.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Antworten können eine Handlung in Klammern enthalten: „(Hand ausstrecken) Freut mich.“
function ChoiceText({ text }: { text: string }) {
  const match = text.match(/^\(([^)]+)\)\s*(.*)$/);
  if (!match) return <>„{text}“</>;
  const [, action, said] = match;
  return (
    <>
      <span className="font-sans text-base font-semibold text-navy/70">{action}</span>
      {said && <span className="block">„{said}“</span>}
    </>
  );
}

function Meters({ values, compact }: { values: Values; compact?: boolean }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 ${compact ? "" : "mt-8"}`}>
      {METERS.map((meter) => (
        <li key={meter.key} className="flex items-center gap-2">
          <span className="text-sm font-bold text-white/80">{meter.label}</span>
          <span className="h-3 w-24 overflow-hidden rounded-full bg-white/15">
            <span
              className="block h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${(values[meter.key] / MAX) * 100}%`, background: meter.color }}
            />
          </span>
          <span className="w-5 font-display text-lg font-extrabold">{values[meter.key]}</span>
        </li>
      ))}
    </ul>
  );
}
