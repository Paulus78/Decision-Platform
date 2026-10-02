"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import story from "@/stories/codex-autoverkauf.json";
import Art from "./Art";
import Debrief from "./Debrief";
import { euros, finish, offerFor, type Choice } from "./game";
import styles from "./film.module.css";

gsap.registerPlugin(useGSAP);
type Phase = "ready" | "playing" | "choice" | "result" | "done";
type ClipId = keyof typeof story.clips;
export type AudioCueMap = Record<
  string,
  { duration: number; cues: { text: string; end: number }[] }
>;
const names: Record<string, string> = {
  narrator: "Erzähler",
  you: "Du",
  alex: "Alex",
};
const reveals = [
  {
    id: "reveal1",
    title: "Lass dich nicht klein rechnen.",
    type: "Studie",
    body: "5.800 € können deinen Blick verschieben. Deine Anzeige hatte bereits 6.800 € als Ausgangspunkt gesetzt. Eine begründete eigene Zahl hilft, den Rahmen im Blick zu behalten.",
  },
  {
    id: "reveal2",
    title: "Vergleiche das ganze Auto.",
    type: "Buchwissen",
    body: "Gleiches Baujahr bedeutet nicht gleicher Wert. Kilometer, Service und Reifen zählen mit. Ein Inserat zeigt einen Wunschpreis, keinen nachgewiesenen Verkaufspreis.",
  },
  {
    id: "reveal3",
    title: "Wie gut ist dein Plan B?",
    type: "Buchwissen",
    body: "Ein bestätigter Termin ist mehr wert als ein „vielleicht“. Entscheide vorher, wie viel dir ein schneller Verkauf wert ist. Auch Alex’ Zeitdruck kann echt sein.",
  },
];

export default function CarFilm({
  audioFiles = [],
  audioCues = {},
}: {
  audioFiles?: string[];
  audioCues?: AudioCueMap;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [queue, setQueue] = useState<string[]>(story.intro);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Choice[]>([]);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playhead, setPlayhead] = useState(0);
  const [showSources, setShowSources] = useState(false);
  const [isReveal, setIsReveal] = useState(false);
  const [isExample, setIsExample] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const choiceFocus = useRef<HTMLHeadingElement>(null);
  const resultFocus = useRef<HTMLHeadingElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const sound = useRef<AudioContext | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const elapsed = useRef(0);
  const completed = useRef(false);
  const gate = useRef(false);
  const id = queue[index] as ClipId;
  const clip = story.clips[id];
  const playing = phase === "playing" && !paused;
  const result =
    answers.length === 3 ? finish(answers[0], answers[1], answers[2]) : null;
  let offer = answers.length >= 2 ? offerFor(answers[0], answers[1]) : 5800;
  if (
    !isExample &&
    result?.sold &&
    (isReveal ||
      ["counterYes", "resultSold"].includes(id) ||
      phase === "result" ||
      phase === "done")
  )
    offer = result.price!;
  if (isExample)
    offer = ["b3", "counterYes"].includes(id)
      ? 6400
      : ["a2", "ra2"].includes(id)
        ? 6200
        : 5800;
  const revealIndex = reveals.findIndex((r) => r.id === id);
  const cues = audioCues[id]?.cues;
  const caption =
    cues?.find((cue) => playhead < cue.end)?.text ??
    cues?.at(-1)?.text ??
    clip.text;
  const speaking =
    playing && (!audioCues[id] || playhead < audioCues[id].duration);
  const displayedScene = phase === "ready" ? "listing" : clip.scene;

  function blip(kind: "start" | "choice" | "message") {
    if (muted) return;
    try {
      const ctx = sound.current ?? new AudioContext();
      sound.current = ctx;
      void ctx.resume();
      const tones =
        kind === "start"
          ? [260, 390, 520]
          : kind === "choice"
            ? [420, 580]
            : [740, 920];
      tones.forEach((frequency, i) => {
        const oscillator = ctx.createOscillator(),
          gain = ctx.createGain();
        const t = ctx.currentTime + i * 0.09;
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.055, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(t);
        oscillator.stop(t + 0.24);
      });
    } catch {
      /* Film remains usable without Web Audio. */
    }
  }
  function begin() {
    blip("start");
    gate.current = false;
    setAudioError(false);
    setPlayhead(0);
    setProgress(0);
    setAnswers([]);
    setIsReveal(false);
    setIsExample(false);
    setShowSources(false);
    setQueue(story.intro);
    setIndex(0);
    setPaused(false);
    setPhase("playing");
  }
  function next() {
    if (phase !== "playing" || completed.current) return;
    completed.current = true;
    setProgress(0);
    setPlayhead(0);
    if (index < queue.length - 1) setIndex((n) => n + 1);
    else {
      setPhase(
        isReveal || isExample
          ? "done"
          : answers.length === 3
            ? "result"
            : "choice",
      );
    }
  }
  function choose(choice: Choice) {
    if (phase !== "choice" || gate.current) return;
    gate.current = true;
    blip("choice");
    setPlayhead(0);
    setProgress(0);
    const step = answers.length,
      decision = story.decisions[step];
    const selected = [...answers, choice];
    const clips = [...decision.options[choice].clips];
    if (step === 2) {
      const ending = finish(selected[0], selected[1], selected[2]);
      clips.push(ending.ending, ending.sold ? "resultSold" : "resultOpen");
    } else clips.push(...decision.rejoin);
    setAnswers(selected);
    setQueue(clips);
    setIndex(0);
    setPaused(false);
    setPhase("playing");
  }
  function reveal() {
    setPlayhead(0);
    setProgress(0);
    blip("choice");
    setIsReveal(true);
    setIsExample(false);
    setQueue(reveals.map((r) => r.id));
    setIndex(0);
    setPaused(false);
    setPhase("playing");
  }
  function example() {
    setPlayhead(0);
    setProgress(0);
    blip("choice");
    setIsExample(true);
    setIsReveal(false);
    setQueue(["exampleIntro", "b1", "a2", "b3", "counterYes"]);
    setIndex(0);
    setPaused(false);
    setPhase("playing");
  }

  useEffect(() => {
    elapsed.current = 0;
    completed.current = false;
    const element = audio.current;
    const fail = () => setAudioError(true);
    if (element && audioFiles.includes(id)) {
      element.src = `/audio/codex/${id}.mp3`;
      element.addEventListener("error", fail, { once: true });
    }
    return () => {
      element?.pause();
      element?.removeEventListener("error", fail);
      element?.removeAttribute("src");
    };
  }, [id, index, queue, audioFiles]);

  useEffect(() => {
    const element = audioFiles.includes(id) ? audio.current : null;
    if (!playing) {
      element?.pause();
      return;
    }
    let alive = true;
    if (element)
      void element.play().catch(() => {
        if (alive) setAudioError(true);
      });
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      elapsed.current += (now - previous) / 1000;
      previous = now;
      const duration =
        element && Number.isFinite(element.duration)
          ? Math.max(clip.seconds, element.duration + 0.7)
          : clip.seconds;
      setProgress(Math.min(1, elapsed.current / duration));
      setPlayhead(
        element && !element.error ? element.currentTime : elapsed.current,
      );
      if (
        elapsed.current >= duration &&
        (!element || element.ended || element.error || audioError)
      )
        next();
    }, 100);
    return () => {
      alive = false;
      window.clearInterval(timer);
      element?.pause();
    };
    // Each queue is a playback segment; choices cannot be skipped by transport controls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, id, index, queue, clip.seconds, audioError, audioFiles]);

  useEffect(() => {
    if (audio.current) audio.current.muted = muted;
  }, [muted, id, index, queue]);
  useEffect(() => {
    if (phase === "choice") {
      gate.current = false;
      choiceFocus.current?.focus({ preventScroll: true });
    }
    if (phase === "result" || phase === "done")
      resultFocus.current?.focus({ preventScroll: true });
  }, [phase]);
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      void sound.current?.close();
    };
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        timeline.current = null;
        return;
      }
      const tl = gsap.timeline();
      timeline.current = tl;
      if (art.current?.querySelector("[data-pop]"))
        tl.from("[data-pop]", {
          opacity: 0,
          y: "+=24",
          scale: 0.9,
          transformOrigin: "50% 50%",
          duration: 0.6,
          ease: "back.out(1.3)",
        });
      if (art.current?.querySelector("[data-price]"))
        tl.from(
          "[data-price]",
          { opacity: 0, scale: 0.9, transformOrigin: "center", duration: 0.3 },
          0,
        );
      if (displayedScene === "arrival")
        tl.from(
          '[data-person="alex"]',
          { x: "+=100", opacity: 0, duration: 1.2 },
          0,
        );
      if (displayedScene === "leave")
        tl.to(
          "[data-depart]",
          { x: 250, opacity: 0, duration: 2.5, ease: "power1.in" },
          1.7,
        );
      if (displayedScene === "drive") {
        tl.to(
          "[data-car]",
          {
            y: -3,
            duration: 0.3,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          },
          0,
        );
        // Wheels rotate around their own local zero; placement is a separate group.
        tl.to(
          "[data-wheel]",
          {
            attr: { transform: "rotate(360)" },
            duration: 1.2,
            repeat: -1,
            ease: "none",
          },
          0,
        );
        tl.to(
          "[data-distant]",
          { x: -1280, duration: 32, repeat: -1, ease: "none" },
          0,
        );
        tl.to(
          "[data-near]",
          { x: -1280, duration: 6, repeat: -1, ease: "none" },
          0,
        );
        tl.to(
          "[data-road]",
          { x: -320, duration: 0.65, repeat: -1, ease: "none" },
          0,
        );
        tl.to(
          "[data-radio]",
          {
            y: -12,
            opacity: 0.4,
            duration: 0.7,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          },
          0,
        );
      }
      if (clip.speaker !== "narrator")
        tl.to(
          `[data-arm="${clip.speaker}"]`,
          {
            rotation: clip.speaker === "you" ? -8 : 8,
            transformOrigin: "50% 10%",
            duration: 0.7,
            yoyo: true,
            repeat: 3,
          },
          0.2,
        );
      if (phase === "ready") tl.progress(1);
      else if (!playing) tl.pause();
    },
    {
      scope: art,
      dependencies: [id, index, queue, displayedScene, phase === "ready"],
      revertOnUpdate: true,
    },
  );
  useEffect(() => {
    if (playing) timeline.current?.resume();
    else timeline.current?.pause();
  }, [playing]);

  const badge = isExample
    ? "Ein anderer Verlauf"
    : isReveal
      ? "Was steckt dahinter?"
      : phase === "ready"
        ? "Ein ganz normaler Samstag"
        : answers.length === 0
          ? "01 / Das Angebot"
          : answers.length === 1
            ? "02 / Der Vergleich"
            : "03 / Die Entscheidung";
  return (
    <main className={styles.page}>
      <audio ref={audio} preload="auto" hidden aria-hidden="true" />
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          decision<span>platform</span>
          <i>↗</i>
        </Link>
        <span className={styles.edition}>CODEX · SITUATION 01</span>
      </header>
      <h1 className={styles.heading}>Der Käufer ist schon da.</h1>
      <div ref={screen} className={styles.player}>
        <div className={styles.screen}>
          <div
            ref={art}
            className={styles.art}
            aria-hidden={
              isReveal ||
              phase === "ready" ||
              phase === "result" ||
              phase === "done"
            }
            data-muted-stage={
              phase === "ready" || phase === "result" || phase === "done"
            }
          >
            <Art
              scene={
                phase === "result" || phase === "done"
                  ? result?.sold
                    ? "handshake"
                    : "empty"
                  : displayedScene
              }
              speaker={clip.speaker}
              playing={speaking}
            />
          </div>
          {!isReveal && (
            <div className={styles.sceneBadge}>
              <span className={playing ? styles.live : styles.still} />
              {badge}
            </div>
          )}
          {phase !== "ready" &&
            phase !== "done" &&
            phase !== "result" &&
            !isReveal && (
              <div className={styles.target}>
                <span>
                  DEIN WUNSCH <strong>6.500 €</strong>
                </span>
                {!["intro", "arrival", "drive"].includes(id) && (
                  <span>
                    AUF DEM TISCH <strong>{euros(offer)}</strong>
                  </span>
                )}
              </div>
            )}
          {phase === "ready" && (
            <div className={styles.start}>
              <span className={styles.startLabel}>
                AUTOVERKAUF · CA. 2 MINUTEN
              </span>
              <h2>
                Der Käufer
                <br />
                ist schon da<span>.</span>
              </h2>
              <p>
                Drei Wochen online. Heute kommt Alex zur Probefahrt.
                <br />
                Du willst dein Auto verkaufen – aber zu welchem Preis?
              </p>
              <button onClick={begin}>
                <span>▶</span> Situation starten
              </button>
              <small>
                {audioFiles.length
                  ? "Mit Stimmen & Untertiteln"
                  : "Stimmen noch ausstehend · mit Untertiteln spielbar"}
              </small>
            </div>
          )}
          {phase === "playing" && !isReveal && (
            <div
              className={`${styles.captions} ${clip.speaker !== "narrator" ? styles.dialogue : ""}`}
              data-speaker={clip.speaker}
              key={`${id}-${index}`}
            >
              <span>{names[clip.speaker]}</span>
              <p>{caption}</p>
              {isExample && ["b1", "a2", "b3"].includes(id) && (
                <em>
                  {id === "b1"
                    ? "Kosten verstehen"
                    : id === "a2"
                      ? "Sachlich vergleichen"
                      : "Klare Zahl, klare Zusage"}
                </em>
              )}
            </div>
          )}
          {phase === "playing" && isReveal && (
            <Debrief
              step={revealIndex}
              answers={answers}
              caption={caption}
              playing={playing}
            />
          )}
          {(phase === "result" || phase === "done") && (
            <div className={styles.resultCard}>
              <span className={styles.resultLabel}>
                {phase === "done" && !isExample
                  ? "DEIN RÜCKBLICK"
                  : "EIN MÖGLICHER VERLAUF"}
              </span>
              <h2 tabIndex={-1} ref={resultFocus}>
                {isExample
                  ? "6.400 € · abgemacht."
                  : phase === "done"
                    ? "Drei Dinge fürs nächste Mal."
                    : result?.sold
                      ? `${euros(result.price!)} · verkauft.`
                      : "Heute kein Verkauf."}
              </h2>
              <p>
                {isExample
                  ? "Gleiche Situation. Andere Sätze. Ein möglicher Verlauf – keine Garantie."
                  : phase === "done"
                    ? "Eine Zahl im Kopf. Ein fairer Vergleich. Ein echter Plan B."
                    : result?.sold
                      ? `Dein Wunsch war 6.500 €. Du hast dich für einen Abschluss entschieden.`
                      : `Alex’ letztes Angebot: ${euros(result?.offer ?? offer)}. Die andere Interessentin hat noch keinen Termin bestätigt.`}
              </p>
              {isExample ? (
                <div className={styles.resultComparison}>
                  <div>
                    <span>DEIN VERLAUF</span>
                    <strong>
                      {result?.sold ? euros(result.price!) : "Kein Abschluss"}
                    </strong>
                  </div>
                  <div>
                    <span>DAS BEISPIEL</span>
                    <strong>6.400 €</strong>
                  </div>
                </div>
              ) : phase === "done" ? (
                <div className={styles.summaryTips}>
                  {reveals.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setIsReveal(true);
                        setIsExample(false);
                        setQueue([item.id]);
                        setIndex(0);
                        setPaused(false);
                        setPlayhead(0);
                        setPhase("playing");
                      }}
                    >
                      <span>0{i + 1}</span>
                      <strong>
                        {
                          ["Eigene Zahl", "Fairer Vergleich", "Echter Plan B"][
                            i
                          ]
                        }
                      </strong>
                      <small>Noch einmal ansehen ↗</small>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={styles.resultComparison}>
                  <div>
                    <span>DEIN WUNSCH</span>
                    <strong>6.500 €</strong>
                  </div>
                  <div>
                    <span>
                      {result?.sold ? "DEIN ABSCHLUSS" : "LETZTES ANGEBOT"}
                    </span>
                    <strong>
                      {euros(result?.price ?? result?.offer ?? offer)}
                    </strong>
                  </div>
                </div>
              )}
              {phase === "result" ? (
                <button className={styles.primary} onClick={reveal}>
                  Was ist gerade passiert? <span>→</span>
                </button>
              ) : (
                <>
                  {!isExample && (
                    <button className={styles.primary} onClick={example}>
                      So hätte es auch laufen können <span>▶</span>
                    </button>
                  )}
                  {isExample && (
                    <button
                      className={styles.secondary}
                      onClick={() => {
                        setIsExample(false);
                        setIsReveal(true);
                      }}
                    >
                      ← Zurück zum Rückblick
                    </button>
                  )}
                  <button className={styles.secondary} onClick={begin}>
                    ↻ Nochmal spielen
                  </button>
                </>
              )}
              <small>Stimmen: ElevenLabs · Ausgang erfunden</small>
            </div>
          )}
          {phase === "playing" && paused && (
            <button
              className={styles.resume}
              onClick={() => setPaused(false)}
              aria-label="Video fortsetzen"
            >
              ▶
            </button>
          )}
        </div>
        {phase === "choice" && (
          <section className={styles.decision} aria-labelledby="codex-question">
            <div className={styles.question}>
              <div>
                <span>ENTSCHEIDUNG {answers.length + 1} / 3</span>
                <h2 id="codex-question" tabIndex={-1} ref={choiceFocus}>
                  Was sagst du?
                </h2>
              </div>
              <p>{story.decisions[answers.length].title}</p>
            </div>
            <div className={styles.options}>
              {story.decisions[answers.length].options.map((option, i) => (
                <button key={option.label} onClick={() => choose(i as Choice)}>
                  <span>{["A", "B", "C"][i]}</span>
                  <strong>{option.label}</strong>
                  <i>↗</i>
                </button>
              ))}
            </div>
          </section>
        )}
        <div className={styles.controls}>
          <div className={styles.controlButtons}>
            <button
              disabled={phase !== "playing"}
              aria-label={paused ? "Video fortsetzen" : "Video pausieren"}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? "▶" : "Ⅱ"}
            </button>
            <button
              aria-label={muted ? "Ton einschalten" : "Ton ausschalten"}
              aria-pressed={muted}
              onClick={() => {
                setMuted((m) => !m);
                if (muted) blip("choice");
              }}
            >
              {muted ? "Ton aus" : "Ton an"}
            </button>
          </div>
          <div className={styles.progress}>
            <span
              style={{
                width: `${phase === "choice" || phase === "result" || phase === "done" ? 100 : progress * 100}%`,
              }}
            />
          </div>
          <span className={styles.controlStatus}>
            {phase === "choice"
              ? "Du bist dran"
              : phase === "ready"
                ? "Bereit?"
                : phase === "playing"
                  ? `${index + 1} / ${queue.length}`
                  : "Dein Verlauf"}
          </span>
          <button
            disabled={phase !== "playing"}
            onClick={next}
            aria-label="Nächster Satz"
          >
            Weiter ›
          </button>
          <button
            aria-label="Vollbild"
            onClick={() => {
              if (document.fullscreenElement) void document.exitFullscreen();
              else void screen.current?.requestFullscreen().catch(() => {});
            }}
          >
            ⛶
          </button>
        </div>
      </div>
      <div className={styles.below}>
        <span>DU SPIELST DEN VERKÄUFER.</span>
        <p>Preis oder Ruhe im Kopf? Beides hat einen Wert.</p>
        <span>01 — AUTOVERKAUF</span>
      </div>
      {(isReveal || phase === "done") && (
        <section className={styles.takeaways}>
          <button
            className={styles.sourceToggle}
            aria-expanded={showSources}
            onClick={() => setShowSources((v) => !v)}
          >
            {showSources ? "−" : "+"} Quellen & Grenzen der Tipps
          </button>
          {showSources && (
            <div className={styles.sources}>
              {story.sources.map((source) => (
                <p key={source.title}>
                  <span>{source.type}</span>{" "}
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title} ↗
                  </a>
                  <br />
                  {source.detail}
                </p>
              ))}
              <p>
                Die Zahlen, Reaktionen und Ergebnisse dieser Geschichte sind
                erfunden. Es gibt keine allgemein beste Antwort. Geld, Zeit und
                deine echten Alternativen zählen zusammen.
              </p>
            </div>
          )}
        </section>
      )}
      <footer className={styles.footer}>
        <span>Eine kleine Generalprobe fürs echte Leben.</span>
        <span>Zeichnungen & Animation: Codex · Stimmen: ElevenLabs</span>
      </footer>
      {(audioError || !audioFiles.length) && phase !== "ready" && (
        <p className={styles.audioNotice}>
          {audioFiles.length
            ? "Eine Tonspur konnte nicht abgespielt werden. Die Untertitel laufen weiter."
            : "Die ElevenLabs-Stimmen sind noch nicht erzeugt. Du kannst bereits mit Untertiteln spielen."}
        </p>
      )}
    </main>
  );
}
