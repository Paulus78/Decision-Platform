"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { fill, type State } from "@/lib/engine";
import type { Option, Story } from "@/lib/story";
import { pop } from "./sfx";

// Bausteine, die jede Situation benutzt: Abspiel-Steuerung, Bühne, Untertitel,
// Schnitt-Karte, Anzeige oben, Chat-Nachricht, Entscheidung, Erklärung, Vergleich.

export type VoiceLine = { id: string; voice: string; text: string };

// Steuert einen Durchlauf: warten, Audiodatei abspielen, überspringen, abbrechen.
export function useDirector() {
  // Jeder Durchlauf bekommt eine Nummer. Ein alter Durchlauf merkt daran,
  // dass er abgelöst wurde, und hört auf.
  const runId = useRef(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const skip = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      runId.current++;
      audio.current?.pause();
    },
    [],
  );

  // Wartet. Ein Klick aufs Bild springt sofort weiter.
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

  function playFile(file: string) {
    return new Promise<void>((resolve) => {
      const clip = new Audio(`/audio/${file}`);
      audio.current = clip;
      function done() {
        clip.pause();
        skip.current = null;
        resolve();
      }
      clip.onended = done;
      clip.onerror = done;
      skip.current = done;
      clip.play().catch(done);
    });
  }

  // Startet einen neuen Durchlauf und liefert dessen Nummer und "läuft noch?".
  function begin() {
    const id = ++runId.current;
    audio.current?.pause();
    return { id, alive: () => runId.current === id };
  }

  return { wait, playFile, begin, skipNow: () => skip.current?.() };
}

export function Stage({
  onSkip,
  children,
}: {
  onSkip: () => void;
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-[#1e294b]">
      <div
        onClick={onSkip}
        className="relative aspect-video w-full max-w-[177.78dvh] overflow-clip bg-[#f6e7cf] text-[#33273b] [container-type:size]"
      >
        {children}
      </div>
    </main>
  );
}

export function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[2cqw] bg-[#1e294b]/85 text-center backdrop-blur-sm">
      {children}
    </div>
  );
}

export function Poster({
  kicker,
  title,
  subtitle,
  onStart,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  onStart: () => void;
}) {
  return (
    <Overlay>
      <p className="text-[1.5cqw] font-bold uppercase tracking-[0.3em] text-[#f2a33a]">{kicker}</p>
      <h1 className="text-[7cqw] font-black leading-none text-white">{title}</h1>
      <p className="text-[2.2cqw] text-white/75">{subtitle}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onStart();
        }}
        aria-label="Abspielen"
        className="mt-[1cqw] flex h-[9cqw] w-[9cqw] items-center justify-center rounded-full bg-[#f2a33a] text-[#1e294b] hover:brightness-110"
      >
        <svg viewBox="0 0 24 24" className="ml-[0.5cqw] h-[4cqw] w-[4cqw]" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
      <p className="text-[1.4cqw] text-white/50">
        Mit Ton ansehen · Klick aufs Bild springt weiter
      </p>
    </Overlay>
  );
}

export function EndCard({
  kicker,
  disclaimer,
  onReplay,
}: {
  kicker: string;
  disclaimer: string;
  onReplay: () => void;
}) {
  return (
    <Overlay>
      <p className="text-[1.5cqw] font-bold uppercase tracking-[0.3em] text-[#f2a33a]">{kicker}</p>
      <h2 className="text-[4.4cqw] font-black leading-tight text-white">
        Andere Antworten, anderer Verlauf.
      </h2>
      <div className="mt-[1cqw] flex gap-[1.4cqw]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReplay();
          }}
          className="rounded-full bg-[#f2a33a] px-[3.4cqw] py-[1.4cqw] text-[2cqw] font-bold text-[#1e294b] hover:brightness-110"
        >
          Nochmal spielen
        </button>
        <Link
          href="/"
          onClick={(e) => e.stopPropagation()}
          className="rounded-full border-[0.2cqw] border-white/50 px-[3.4cqw] py-[1.4cqw] text-[2cqw] font-bold text-white hover:border-[#f2a33a]"
        >
          Andere Situation
        </Link>
      </div>
      <p className="max-w-[60cqw] text-[1.3cqw] text-white/50">{disclaimer}</p>
      <p className="text-[1.1cqw] text-white/40">Stimmen: ElevenLabs</p>
    </Overlay>
  );
}

export function Caption({
  label,
  text,
  accent,
}: {
  label: string;
  text: string;
  accent: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-[10cqw] bottom-[3cqw] flex justify-center">
      <p className="rounded-[1.4cqw] bg-[#1e294b]/92 px-[2.2cqw] py-[1.1cqw] text-center text-[2.3cqw] font-semibold leading-[1.3] text-white shadow-xl">
        <span
          className="mr-[0.9cqw] text-[1.4cqw] font-bold uppercase tracking-[0.15em]"
          style={{ color: accent }}
        >
          {label}
        </span>
        {text}
      </p>
    </div>
  );
}

// Schnitt zwischen den Szenen: "20 Minuten später – Die Mail".
export function TitleCard({ title, time }: { title: string; time: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(ref.current, { xPercent: -100, duration: 0.45, ease: "power3.out" });
      gsap.from(".t", { opacity: 0, y: 40, duration: 0.4, stagger: 0.12, delay: 0.3 });
    },
    { scope: ref },
  );
  return (
    <div
      ref={ref}
      className="absolute inset-0 flex flex-col items-center justify-center gap-[1cqw] bg-[#2b3a67] text-center"
    >
      <p className="t text-[2.2cqw] font-bold uppercase tracking-[0.3em] text-[#f2a33a]">{time}</p>
      <h2 className="t text-[8cqw] font-black leading-none text-white">{title}</h2>
    </div>
  );
}

// Anzeige oben in der Mitte, z. B. "Zahl auf dem Tisch".
export function HudChip({
  label,
  text,
  danger,
}: {
  label: string;
  text: string;
  danger?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [main, sub] = text.split(" · ");
  useGSAP(() => {
    gsap.from(ref.current, { scale: 1.5, duration: 0.5, ease: "back.out(2)" });
  });
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[1.6cqw] flex justify-center">
      <div
        ref={ref}
        className="rounded-[1.4cqw] bg-white px-[2.2cqw] py-[0.7cqw] text-center shadow-xl"
      >
        <p className="text-[1cqw] font-bold uppercase tracking-[0.25em] text-[#2b3a67]/60">
          {label}
        </p>
        <p
          className="text-[2.8cqw] font-black leading-none"
          style={{ color: danger ? "#ef6f5e" : "#2f9e8f" }}
        >
          {main}
        </p>
        {sub && <p className="mt-[0.2cqw] text-[1.1cqw] text-[#2b3a67]/70">{sub}</p>}
      </div>
    </div>
  );
}

// Der Kumpel schreibt: Chat-Nachricht, die von links ins Bild rutscht.
export function FriendPopup({
  name,
  text,
  face,
  position = "left-[2cqw] top-[11cqw]",
}: {
  name: string;
  text: string;
  face: React.ReactNode;
  // Wo die Nachricht im Bild sitzt (Tailwind-Klassen).
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, { x: "-120%", duration: 0.45, ease: "back.out(1.4)" });
  });
  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute ${position} flex max-w-[34cqw] items-center gap-[1.2cqw] rounded-[2cqw] bg-white p-[1.2cqw] shadow-2xl`}
    >
      <div className="h-[5.4cqw] w-[5.4cqw] shrink-0">{face}</div>
      <div>
        <p className="text-[1.1cqw] font-bold uppercase tracking-[0.15em] text-[#2b3a67]/60">
          {name} · Chat
        </p>
        <p className="text-[2.1cqw] font-bold leading-[1.2] text-[#1e294b]">{text}</p>
      </div>
    </div>
  );
}

export function Decision({
  number,
  total,
  question,
  options,
  state,
  onPick,
}: {
  number: number;
  total: number;
  question: string;
  options: Option[];
  state: State;
  onPick: (option: Option) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<string | null>(null);
  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, duration: 0.3 });
      gsap.from(".card", {
        y: "60%",
        opacity: 0,
        duration: 0.45,
        stagger: 0.1,
        delay: 0.15,
        ease: "back.out(1.5)",
      });
    },
    { scope: ref },
  );

  function pick(option: Option) {
    if (picked) return;
    setPicked(option.id);
    pop();
    setTimeout(() => onPick(option), 500);
  }

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      className="absolute inset-0 flex flex-col items-center justify-end gap-[2cqw] bg-[#1e294b]/60 pb-[4cqw]"
    >
      <div className="text-center">
        <p className="flex items-center justify-center gap-[0.8cqw] text-[1.4cqw] font-bold uppercase tracking-[0.25em] text-[#f2a33a]">
          <span className="flex gap-[0.3cqw]">
            <span className="h-[1.4cqw] w-[0.45cqw] rounded-sm bg-[#f2a33a]" />
            <span className="h-[1.4cqw] w-[0.45cqw] rounded-sm bg-[#f2a33a]" />
          </span>
          Pause · Entscheidung {number} von {total}
        </p>
        <p className="text-[4.4cqw] font-black text-white">{question}</p>
      </div>
      <div className="flex w-full items-stretch justify-center gap-[1.6cqw] px-[4cqw]">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => pick(option)}
            className={`card flex w-[28cqw] flex-col items-start gap-[1cqw] rounded-[1.8cqw] border-[0.3cqw] p-[2cqw] text-left shadow-2xl ${
              picked === option.id
                ? "border-[#f2a33a] bg-[#f2a33a] text-[#1e294b]"
                : picked
                  ? "border-transparent bg-white/40 text-[#1e294b]"
                  : "border-transparent bg-white text-[#1e294b] hover:border-[#f2a33a]"
            }`}
          >
            <span className="flex h-[3.4cqw] w-[3.4cqw] items-center justify-center rounded-full bg-[#1e294b] text-[1.7cqw] font-black text-white">
              {option.id}
            </span>
            <span className="text-[2.3cqw] font-bold leading-[1.2]">
              „{fill(option.text, state)}“
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RevealCard({
  story,
  index,
  icon,
}: {
  story: Story;
  index: number;
  icon: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(ref.current, {
      y: "40%",
      opacity: 0,
      scale: 0.85,
      duration: 0.5,
      ease: "back.out(1.6)",
    });
  });
  const card = story.reveal[index];
  return (
    <div
      ref={ref}
      className="flex w-[28cqw] flex-col items-center gap-[1cqw] rounded-[2cqw] bg-white p-[2cqw] text-center shadow-xl"
    >
      <div className="h-[9cqw] w-[9cqw]">{icon}</div>
      <h3 className="text-[2.3cqw] font-black leading-[1.15] text-[#1e294b]">{card.title}</h3>
      <p className="rounded-[1cqw] bg-[#2f9e8f]/12 px-[1cqw] py-[0.5cqw] text-[1.05cqw] leading-[1.3] text-[#2b3a67]">
        <strong>{card.strength}</strong>
        <br />
        {card.source}
      </p>
    </div>
  );
}

// "Was ist gerade passiert?" – die Karten erscheinen nacheinander.
export function RevealPanel({
  story,
  step,
  icons,
}: {
  story: Story;
  step: number;
  icons: React.ReactNode[];
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center gap-[2.4cqw] bg-[#f6e7cf] pt-[4cqw]">
      <h2 className="text-[4.4cqw] font-black text-[#1e294b]">Was ist gerade passiert?</h2>
      <div className="flex gap-[2cqw]">
        {story.reveal.map((card, i) =>
          step > i ? (
            <RevealCard key={card.title} story={story} index={i} icon={icons[i]} />
          ) : (
            <div key={card.title} className="w-[28cqw]" />
          ),
        )}
      </div>
    </div>
  );
}

// "So hätte es auch laufen können" mit Vergleich zum eigenen Ergebnis.
export function StrongPanel({
  story,
  strongValue,
  yourValue,
}: {
  story: Story;
  strongValue: string;
  yourValue: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(".step", { opacity: 0, x: "-10%", duration: 0.45, stagger: 1.7, delay: 1.2 });
      gsap.from(".compare", {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        delay: 6.4,
        ease: "back.out(1.8)",
      });
    },
    { scope: ref },
  );
  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center gap-[4cqw] bg-[#2b3a67] px-[6cqw] text-white"
    >
      <div className="flex flex-1 flex-col gap-[1.8cqw]">
        <h2 className="text-[3.8cqw] font-black leading-[1.05]">{story.strongRun.title}</h2>
        {story.strongRun.steps.map((step, i) => (
          <div key={step.text} className="step flex items-center gap-[1.4cqw]">
            <span className="flex h-[4cqw] w-[4cqw] shrink-0 items-center justify-center rounded-full bg-[#f2a33a] text-[2cqw] font-black text-[#1e294b]">
              {i + 1}
            </span>
            <div>
              <p className="text-[2.4cqw] font-bold leading-[1.2]">„{step.text}“</p>
              <p className="text-[1.6cqw] text-[#7fd6c8]">→ {step.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="compare w-[28cqw] rounded-[2cqw] bg-white p-[2.4cqw] text-center text-[#1e294b]">
        <p className="text-[1.3cqw] font-bold uppercase tracking-[0.2em] opacity-60">
          Starker Verlauf
        </p>
        <p className="text-[4.4cqw] font-black leading-none text-[#2f9e8f]">{strongValue}</p>
        <p className="mt-[1.4cqw] text-[1.3cqw] font-bold uppercase tracking-[0.2em] opacity-60">
          Du
        </p>
        <p className="text-[3.2cqw] font-black leading-none">{yourValue}</p>
      </div>
    </div>
  );
}
