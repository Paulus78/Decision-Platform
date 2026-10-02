"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { euro, fill, type State } from "@/lib/engine";
import type { Ending, Line, Option, Story } from "@/lib/story";

// Alle Größen sind in cqw (Prozent der Videobreite), damit das Bild auf jedem
// Bildschirm gleich aussieht – wie bei einem echten Video.

const AMOUNT = /\d\d\.\d{3}/;

// Text, der Wort für Wort einblendet. Geldbeträge werden hervorgehoben.
export function Words({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      gsap.from(ref.current!.children, {
        opacity: 0,
        y: "0.4em",
        duration: 0.35,
        stagger: 0.045,
        ease: "power2.out",
      });
    },
    { scope: ref },
  );
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const isAmount =
          AMOUNT.test(word) || (word.startsWith("€") && AMOUNT.test(words[i - 1] ?? ""));
        return (
          <span
            key={i}
            className={`inline-block whitespace-pre ${isAmount ? "font-bold text-accent" : ""}`}
          >
            {word + " "}
          </span>
        );
      })}
    </p>
  );
}

// Blendet den ganzen Block beim Erscheinen ein.
function Pop({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { opacity: 0, scale: 0.92, y: "4%", duration: 0.45, ease: "back.out(1.6)" });
  });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function Avatar({ letter, className = "" }: { letter: string; className?: string }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${className}`}
    >
      {letter}
    </div>
  );
}

export function Poster({ story, onStart }: { story: Story; onStart: () => void }) {
  return (
    <Pop className="flex flex-col items-center gap-[6cqw] px-[8cqw] text-center">
      <p className="text-[3.4cqw] font-semibold uppercase tracking-[0.3em] text-accent">
        Work · 3 Entscheidungen
      </p>
      <h1 className="text-[15cqw] font-black leading-[0.95]">{story.title}</h1>
      <p className="text-[4.6cqw] text-white/70">
        Sie wollen dich. Jetzt geht es ums Geld.
      </p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStart();
        }}
        className="mt-[4cqw] flex h-[22cqw] w-[22cqw] items-center justify-center rounded-full bg-accent text-ink transition-transform hover:scale-105"
        aria-label="Abspielen"
      >
        <svg viewBox="0 0 24 24" className="ml-[1cqw] h-[9cqw] w-[9cqw]" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
      <p className="text-[3.2cqw] text-white/40">Make the mistake here. Not in real life.</p>
    </Pop>
  );
}

export function IntroCard({ text, step, total }: { text: string; step: number; total: number }) {
  return (
    <div className="flex flex-col gap-[6cqw] px-[9cqw]">
      <Words text={text} className="text-[8.2cqw] font-bold leading-[1.15]" />
      <div className="flex gap-[1.5cqw]">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-[1cqw] w-[8cqw] rounded-full ${i <= step ? "bg-accent" : "bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function TitleCard({ title, time }: { title: string; time: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(".time", { opacity: 0, x: "-6%", duration: 0.4 });
      gsap.from(".title", { opacity: 0, y: "20%", scale: 1.15, duration: 0.5, ease: "power3.out" });
      gsap.from(".line", { scaleX: 0, duration: 0.6, ease: "power2.out", delay: 0.15 });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="flex w-full flex-col gap-[3cqw] px-[9cqw]">
      <p className="time text-[3.8cqw] font-semibold uppercase tracking-[0.25em] text-accent">
        {time}
      </p>
      <h2 className="title text-[14cqw] font-black leading-none">{title}</h2>
      <span className="line h-[1.2cqw] w-[30cqw] origin-left rounded-full bg-accent" />
    </div>
  );
}

export function Ringing() {
  return (
    <Pop className="flex flex-col items-center gap-[6cqw]">
      <div className="relative flex items-center justify-center">
        <span className="absolute h-[34cqw] w-[34cqw] animate-ping rounded-full bg-accent/30" />
        <Avatar letter="N" className="relative h-[34cqw] w-[34cqw] bg-accent text-[14cqw] text-ink" />
      </div>
      <div className="text-center">
        <p className="text-[8cqw] font-bold">Novara GmbH</p>
        <p className="text-[4.2cqw] text-white/60">Eingehender Anruf …</p>
      </div>
      <svg
        viewBox="0 0 24 24"
        className="h-[12cqw] w-[12cqw] text-accent"
        style={{ animation: "shake 0.6s ease-in-out infinite" }}
        fill="currentColor"
      >
        <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z" />
      </svg>
    </Pop>
  );
}

export function CallScene({ line, name }: { line: Line; name: string }) {
  const mine = line.from === "du";
  return (
    <div className="flex w-full flex-col gap-[7cqw] px-[8cqw]">
      <div className="flex items-center gap-[3cqw]">
        <Avatar letter="B" className="h-[13cqw] w-[13cqw] bg-white/10 text-[6cqw]" />
        <div className="flex-1">
          <p className="text-[4.4cqw] font-semibold">Frau Brandt</p>
          <p className="text-[3.2cqw] text-white/50">Novara GmbH · Anruf läuft</p>
        </div>
        <div className="flex h-[8cqw] items-center gap-[0.9cqw]">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-full w-[1cqw] origin-center rounded-full ${mine ? "bg-white/20" : "bg-accent"}`}
              style={mine ? { transform: "scaleY(0.25)" } : { animation: `wave 0.9s ease-in-out ${i * 0.12}s infinite` }}
            />
          ))}
        </div>
      </div>
      <div>
        <p className={`mb-[2cqw] text-[3.4cqw] font-semibold uppercase tracking-[0.2em] ${mine ? "text-accent" : "text-white/50"}`}>
          {name}
        </p>
        <Words
          text={`„${line.text}“`}
          className={`text-[7cqw] font-bold leading-[1.2] ${mine ? "text-accent" : ""}`}
        />
      </div>
    </div>
  );
}

export function MailScene({ line }: { line: Line }) {
  const mine = line.from === "du";
  return (
    <Pop className="w-full px-[6cqw]">
      <div
        className={`rounded-[5cqw] p-[6cqw] shadow-2xl ${mine ? "ml-[8cqw] bg-accent text-ink" : "mr-[4cqw] bg-paper text-ink"}`}
      >
        <div className="mb-[4cqw] flex items-center gap-[3cqw] border-b border-ink/10 pb-[4cqw]">
          <Avatar
            letter={mine ? "Du" : "B"}
            className={`h-[11cqw] w-[11cqw] text-[4.4cqw] ${mine ? "bg-ink text-accent" : "bg-ink text-paper"}`}
          />
          <div>
            <p className="text-[4cqw] font-bold">{mine ? "Deine Antwort" : "Frau Brandt · Novara GmbH"}</p>
            <p className="text-[3.2cqw] opacity-60">{line.subject ?? "Re: Ihr Angebot"}</p>
          </div>
        </div>
        <MailBody text={line.text} big={mine} />
      </div>
    </Pop>
  );
}

// Auf hellem Grund wäre die Akzentfarbe unlesbar, deshalb hier nur fett.
function MailBody({ text, big }: { text: string; big: boolean }) {
  const parts = text.split(/(\d\d\.\d{3} €)/);
  return (
    <p className={`leading-[1.35] ${big ? "text-[6.4cqw] font-bold" : "text-[5cqw]"}`}>
      {parts.map((part, i) =>
        AMOUNT.test(part) ? (
          <strong key={i} className="whitespace-nowrap rounded-[1.5cqw] bg-ink px-[1.6cqw] text-accent">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </p>
  );
}

// Jonas schreibt: Mitteilung, die von oben ins Bild rutscht.
export function Notification({ line, name }: { line: Line; name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { y: "-140%", opacity: 0, duration: 0.45, ease: "back.out(1.4)" });
  });
  return (
    <div
      ref={ref}
      className="flex items-start gap-[3cqw] rounded-[5cqw] border border-white/10 bg-white/15 p-[4cqw] shadow-2xl backdrop-blur-xl"
    >
      <Avatar letter={name[0]} className="h-[11cqw] w-[11cqw] bg-emerald-400 text-[5cqw] text-ink" />
      <div className="min-w-0 flex-1">
        <p className="text-[3.2cqw] text-white/60">{name} · jetzt</p>
        <p className="text-[4.8cqw] font-semibold leading-[1.25]">{line.text}</p>
      </div>
    </div>
  );
}

export function Hud({ state, progress }: { state: State; progress: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const chip = useRef<HTMLSpanElement>(null);
  const prevOffer = useRef(0);
  const [main, sub] = fill(state.table, state).split(" · ");

  useGSAP(
    () => {
      gsap.from(".value", { scale: 1.35, color: "#ffffff", duration: 0.5, ease: "back.out(2)" });
    },
    { scope: ref, dependencies: [main] },
  );

  // Kleines "+1.500 €", das nach oben wegfliegt, wenn das Angebot steigt.
  useGSAP(
    () => {
      const prev = prevOffer.current;
      prevOffer.current = state.offer;
      if (prev > 0 && state.offer > prev && chip.current) {
        chip.current.textContent = `+${euro(state.offer - prev)} €`;
        gsap.fromTo(
          chip.current,
          { opacity: 1, y: "0%" },
          { opacity: 0, y: "-160%", duration: 1.8, ease: "power1.out" },
        );
      }
    },
    { dependencies: [state.offer] },
  );

  return (
    <div ref={ref} className="px-[6cqw] pt-[5cqw]">
      <div className="h-[0.8cqw] overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-white/70 transition-[width] duration-700"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="mt-[4cqw] flex items-end justify-between">
        <div>
          <p className="text-[2.8cqw] font-semibold uppercase tracking-[0.25em] text-white/50">
            Zahl auf dem Tisch
          </p>
          <p className="relative inline-block">
            <span className="value inline-block origin-left text-[8cqw] font-black text-accent">
              {main}
            </span>
            <span
              ref={chip}
              className="absolute left-full top-0 ml-[2cqw] whitespace-nowrap text-[4.4cqw] font-bold text-emerald-300 opacity-0"
            />
          </p>
        </div>
        {sub && <p className="pb-[1.6cqw] text-right text-[3.2cqw] text-white/60">{sub}</p>}
      </div>
    </div>
  );
}

export function DecisionSheet({
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
      gsap.from(ref.current, { y: "100%", duration: 0.45, ease: "power3.out" });
      gsap.from(".option", { opacity: 0, y: "30%", duration: 0.35, stagger: 0.09, delay: 0.25 });
    },
    { scope: ref },
  );

  function pick(option: Option) {
    if (picked) return;
    setPicked(option.id);
    setTimeout(() => onPick(option), 450);
  }

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      className="rounded-t-[7cqw] border-t border-white/10 bg-ink/95 px-[6cqw] pb-[5cqw] pt-[4cqw] backdrop-blur-xl"
    >
      <p className="flex items-center gap-[2cqw] text-[3cqw] font-semibold uppercase tracking-[0.2em] text-accent">
        <span className="flex gap-[0.8cqw]">
          <span className="h-[3cqw] w-[1cqw] rounded-sm bg-accent" />
          <span className="h-[3cqw] w-[1cqw] rounded-sm bg-accent" />
        </span>
        Pause · Entscheidung {number} von {total}
      </p>
      <p className="mt-[1.5cqw] text-[5.6cqw] font-black">Was sagst du?</p>
      <div className="mt-[3cqw] flex flex-col gap-[2cqw]">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => pick(option)}
            className={`option flex items-center gap-[3.5cqw] rounded-[4cqw] border px-[4cqw] py-[2.8cqw] text-left transition-colors duration-300 ${
              picked === option.id
                ? "border-accent bg-accent text-ink"
                : picked
                  ? "border-white/10 opacity-30"
                  : "border-white/20 bg-white/5 hover:border-accent hover:bg-white/10"
            }`}
          >
            <span
              className={`flex h-[8cqw] w-[8cqw] shrink-0 items-center justify-center rounded-full text-[4cqw] font-black ${
                picked === option.id ? "bg-ink text-accent" : "bg-white/10"
              }`}
            >
              {option.id}
            </span>
            <span className="text-[4.4cqw] font-semibold leading-[1.2]">
              {fill(option.text, state)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="rounded-full bg-accent px-[7cqw] py-[3.6cqw] text-[4.4cqw] font-bold text-ink transition-transform hover:scale-105"
    >
      {children}
    </button>
  );
}

export function ResultScene({
  story,
  ending,
  state,
  onNext,
}: {
  story: Story;
  ending: Ending;
  state: State;
  onNext: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const counter = { value: Math.max(0, state.offer - 9000) };
      gsap.to(counter, {
        value: state.offer,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (number.current) number.current.textContent = euro(Math.round(counter.value / 100) * 100);
        },
      });
      gsap.from(".rise", { opacity: 0, y: "20%", duration: 0.5, stagger: 0.18, delay: 0.2 });
    },
    { scope: ref },
  );
  const extras = state.flags.map((flag) => story.flagLabels[flag]).filter(Boolean);
  return (
    <div ref={ref} className="flex w-full flex-col items-start gap-[4cqw] px-[8cqw]">
      <p className="rise rounded-full border border-white/20 px-[3cqw] py-[1.2cqw] text-[3cqw] uppercase tracking-[0.2em] text-white/60">
        Ein möglicher Verlauf
      </p>
      <h2 className="rise text-[11cqw] font-black leading-none">{ending.title}</h2>
      <p className="rise text-[5cqw] text-white/70">{ending.text}</p>
      <div className="rise mt-[2cqw]">
        <p className="text-[3cqw] font-semibold uppercase tracking-[0.25em] text-white/50">
          Dein Ergebnis
        </p>
        <p className="text-[15cqw] font-black leading-none text-accent">
          <span ref={number}>{euro(state.offer)}</span> €
        </p>
        {extras.map((extra) => (
          <p key={extra} className="mt-[1.5cqw] text-[4cqw] font-semibold text-emerald-300">
            + {extra}
          </p>
        ))}
        <p className="mt-[2cqw] text-[4cqw] text-white/50">Dein Ziel war: {euro(story.goal)} €</p>
      </div>
      <div className="rise mt-[3cqw]">
        <PrimaryButton onClick={onNext}>Was ist gerade passiert?</PrimaryButton>
      </div>
    </div>
  );
}

export function RevealScene({ story, onDone }: { story: Story; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const card = story.reveal[index];
  const last = index === story.reveal.length - 1;
  return (
    <div className="flex w-full flex-col gap-[5cqw] px-[8cqw]">
      <p className="text-[3.4cqw] font-semibold uppercase tracking-[0.25em] text-accent">
        Was ist gerade passiert? · {index + 1}/{story.reveal.length}
      </p>
      <Pop key={index} className="flex flex-col gap-[4cqw]">
        <h2 className="text-[9cqw] font-black leading-[1.05]">{card.title}</h2>
        <p className="text-[5cqw] leading-[1.35] text-white/80">{card.text}</p>
        <p className="rounded-[3cqw] border border-white/15 bg-white/5 p-[3cqw] text-[3.2cqw] text-white/60">
          <span className="font-bold text-emerald-300">Belegt · {card.strength}</span>
          <br />
          {card.source}
        </p>
      </Pop>
      <div>
        <PrimaryButton onClick={() => (last ? onDone() : setIndex(index + 1))}>
          Weiter
        </PrimaryButton>
      </div>
    </div>
  );
}

export function OutroScene({
  story,
  state,
  onReplay,
}: {
  story: Story;
  state: State;
  onReplay: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full flex-col gap-[5cqw] px-[8cqw]">
      {open ? (
        <StrongRun story={story} state={state} />
      ) : (
        <>
          <h2 className="text-[9cqw] font-black leading-[1.05]">Und wie wäre es besser gelaufen?</h2>
          <div>
            <PrimaryButton onClick={() => setOpen(true)}>Zeig mir einen starken Verlauf</PrimaryButton>
          </div>
        </>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onReplay();
        }}
        className="self-start rounded-full border border-white/30 px-[7cqw] py-[3.6cqw] text-[4.4cqw] font-bold hover:border-accent"
      >
        Nochmal spielen
      </button>
      <p className="text-[2.8cqw] leading-[1.4] text-white/40">{story.disclaimer}</p>
    </div>
  );
}

function StrongRun({ story, state }: { story: Story; state: State }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(".step", { opacity: 0, x: "-8%", duration: 0.45, stagger: 0.9 });
      gsap.from(".compare", { opacity: 0, y: "20%", duration: 0.5, delay: 2.9 });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="flex flex-col gap-[4cqw]">
      <h2 className="text-[7.4cqw] font-black leading-[1.05]">{story.strongRun.title}</h2>
      {story.strongRun.steps.map((step, i) => (
        <div key={step.text} className="step flex gap-[3cqw]">
          <span className="flex h-[8cqw] w-[8cqw] shrink-0 items-center justify-center rounded-full bg-accent text-[4cqw] font-black text-ink">
            {i + 1}
          </span>
          <div>
            <p className="text-[5cqw] font-bold leading-[1.2]">„{step.text}“</p>
            <p className="text-[3.6cqw] text-emerald-300">→ {step.label}</p>
          </div>
        </div>
      ))}
      <div className="compare rounded-[4cqw] border border-white/15 bg-white/5 p-[4cqw]">
        <p className="text-[4cqw] text-white/60">Starker Verlauf</p>
        <p className="text-[9cqw] font-black leading-none text-accent">
          {euro(story.strongRun.result)} €
        </p>
        <p className="mt-[2cqw] text-[4cqw] text-white/60">Du: {euro(state.offer)} €</p>
      </div>
    </div>
  );
}
