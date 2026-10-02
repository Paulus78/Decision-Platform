"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Explainer from "@/components/explainer/Explainer";
import { JonasFace } from "@/components/explainer/scenes2";
import type { VoiceLine } from "@/components/explainer/ui";
import { euro, fill, type State } from "@/lib/engine";
import { dayString, nextStreak, updateSeries, useSeries, type SeriesData } from "@/lib/series";
import type { Ending, Story } from "@/lib/story";

// Die Serie „Das Angebot“: dieselbe Geschichte wie der Film, aber in drei Folgen.
// Jede Folge hat eine Entscheidung unter Zeitdruck und endet mit einem Cliffhanger.
// Die nächste Folge gibt es am nächsten Tag.

const EPISODES = [
  { title: "Der Anruf", teaser: "Sie wollen dich. Dann kommt die Frage nach deiner Zahl.", cliff: "c1" },
  { title: "Die Mail", teaser: "Das Angebot ist da. Und Jonas hat eine Meinung dazu.", cliff: "c2" },
  { title: "Der Druck", teaser: "Es gibt eine zweite Kandidatin. Du hast bis morgen früh.", cliff: undefined },
];

// Bedenkzeit pro Entscheidung. Danach entscheidet „dein Gehirn“.
const SECONDS = 15;

function untilMidnight(now: number) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const minutes = Math.max(1, Math.ceil((next.getTime() - now) / 60000));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h} Std ${m} Min` : `${m} Min`;
}

export default function SeriesHub({ story, voice }: { story: Story; voice: VoiceLine[] }) {
  const data = useSeries();
  const [now, setNow] = useState(() => Date.now());
  const [askSkip, setAskSkip] = useState(false);
  const [shared, setShared] = useState(false);

  // Die Uhr für die Wartezeit läuft im Minutentakt.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 20000);
    return () => clearInterval(timer);
  }, []);

  if (!data) {
    return <div className="h-[60dvh] bg-navy" aria-busy="true" />;
  }

  const played = data.episodes.length;
  const finished = Boolean(data.ending);
  const last = data.episodes[played - 1];
  const today = dayString(new Date(now));
  const open = !finished && (played === 0 || data.instant || last.day < today || data.early > played);
  const ending = story.endings.find((e) => e.id === data.ending) ?? null;
  const decisions = story.beats.filter((b) => b.type === "decision");

  function record(state: State, end: Ending | null) {
    const number = played + 1;
    const beat = decisions[number - 1];
    const choice = state.choices[beat.type === "decision" ? beat.id : ""] ?? "";
    const option = beat.type === "decision" ? beat.options.find((o) => o.id === choice) : undefined;
    const date = new Date();
    updateSeries((d) => ({
      ...d,
      episodes: [
        ...d.episodes,
        { day: dayString(date), choice, text: option ? fill(option.text, state) : "", state },
      ],
      ending: end ? end.id : null,
      album: end && !d.album.includes(end.id) ? [...d.album, end.id] : d.album,
      streak: nextStreak(d.streak, date),
    }));
    setAskSkip(false);
  }

  function skipWait() {
    updateSeries((d) => ({ ...d, early: d.episodes.length + 1, skips: d.skips + 1 }));
    setAskSkip(false);
  }

  function restart() {
    updateSeries((d) => ({ ...d, episodes: [], ending: null, early: 0, instant: true, runs: d.runs + 1 }));
    setShared(false);
  }

  async function share() {
    if (!ending || !last) return;
    const text = `Generalprobe, „Das Angebot“: Ich bin bei ${euro(last.state.offer)} € gelandet. Mein Ende: „${ending.title}“. Was holst du raus?`;
    const url = `${window.location.origin}/serie`;
    try {
      if (navigator.share) await navigator.share({ text, url });
      else await navigator.clipboard.writeText(`${text} ${url}`);
      setShared(true);
    } catch {
      // Teilen abgebrochen: nichts zu tun.
    }
  }

  const meta = EPISODES[Math.min(played, EPISODES.length - 1)];

  return (
    <>
      {/* Oben: die spielbare Folge, die Wartezeit oder das Ende */}
      {open && (
        <div className="bg-navy" style={{ "--stage-h": "min(calc(100dvh - 9rem), 56.25vw)" } as React.CSSProperties}>
          <Explainer
            key={`${data.runs}-${played}`}
            story={story}
            voice={voice}
            episode={{
              number: played + 1,
              total: EPISODES.length,
              title: meta.title,
              teaser: meta.teaser,
              start: last ? last.state : null,
              recap: last ? `Bisher: „${last.text}“` : "",
              cliff: meta.cliff,
              seconds: SECONDS,
              onDone: record,
            }}
          />
        </div>
      )}

      {!open && !finished && last && (
        <section className="bg-navy text-white">
          <div className="mx-auto grid w-full max-w-[1120px] gap-10 px-5 py-16 lg:grid-cols-[7fr_5fr]">
            <div>
              <p className="font-bold text-sun">Folge {played} geschafft. Du hast gesagt: „{last.text}“</p>
              <h2 className="mt-2 font-display text-[clamp(48px,8vw,96px)] font-extrabold leading-[0.95] tracking-tighter">
                Folge {played + 1} kommt morgen.
              </h2>
              <p className="mt-5 text-xl text-white/80">
                Noch {untilMidnight(now)}. Dann: „{meta.title}“. {meta.teaser}
              </p>
              {!askSkip ? (
                <button
                  onClick={() => setAskSkip(true)}
                  className="press mt-8 rounded-[14px] bg-sun px-6 py-3.5 text-lg font-bold text-navy hover:bg-white"
                >
                  Nicht warten
                </button>
              ) : (
                <div className="pop-in mt-8 max-w-[34rem] rounded-[20px] rounded-tl-[4px] bg-white p-5 text-navy">
                  <p className="font-display text-xl font-extrabold">Sofort weiterspielen</p>
                  <p className="mt-1 text-navy/80">
                    Im fertigen Produkt wäre das ein kleines Extra gegen Geld. Im Prototyp ist es gratis.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <button
                      onClick={skipWait}
                      className="press rounded-[14px] bg-navy px-5 py-3 font-bold text-white hover:bg-[#2b3a67]"
                    >
                      Folge {played + 1} freischalten
                    </button>
                    <button
                      onClick={() => setAskSkip(false)}
                      className="font-bold text-tealdark underline decoration-2 underline-offset-4"
                    >
                      Ich warte bis morgen
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-end gap-3 self-end">
              <span className="h-14 w-14 shrink-0">
                <JonasFace />
              </span>
              <p className="rounded-[18px] rounded-bl-[4px] bg-white px-4 py-3 text-lg font-semibold leading-snug text-navy shadow-paper">
                <span className="block text-sm font-bold text-tealdark">Jonas</span>
                Und?? Was hat sie gesagt? Schreib mir morgen sofort.
              </p>
            </div>
          </div>
        </section>
      )}

      {finished && ending && last && (
        <section className="bg-navy text-white">
          <div className="mx-auto grid w-full max-w-[1120px] gap-10 px-5 py-16 lg:grid-cols-[7fr_5fr]">
            <div>
              <p className="font-bold text-sun">Dein Ende, ein möglicher Verlauf</p>
              <h2 className="mt-2 font-display text-[clamp(48px,8vw,96px)] font-extrabold leading-[0.95] tracking-tighter">
                {ending.title}
              </h2>
              <p className="mt-4 font-display text-[clamp(39px,5.4vw,61px)] font-extrabold leading-none text-sun">
                {euro(last.state.offer)} €
              </p>
              <p className="mt-4 max-w-[34rem] text-xl text-white/80">{fill(ending.text, last.state)}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <button
                  onClick={share}
                  className="press rounded-[14px] bg-sun px-6 py-3.5 text-lg font-bold text-navy hover:bg-white"
                >
                  {shared ? "Kopiert. Jetzt verschicken." : "Ergebnis teilen"}
                </button>
                <button
                  onClick={restart}
                  className="font-bold text-white underline decoration-2 underline-offset-4 hover:text-sun"
                >
                  Neue Runde, ohne Wartezeit
                </button>
              </div>
            </div>
            <div className="flex items-end gap-3 self-end">
              <span className="h-14 w-14 shrink-0">
                <JonasFace />
              </span>
              <p className="rounded-[18px] rounded-bl-[4px] bg-white px-4 py-3 text-lg font-semibold leading-snug text-navy shadow-paper">
                <span className="block text-sm font-bold text-tealdark">Jonas</span>
                {fill(ending.jonas, last.state)}
              </p>
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold text-tealdark">Die Serie, Staffel 1</p>
            <h1 className="font-display text-[clamp(39px,5.4vw,61px)] font-extrabold leading-none tracking-tighter text-navy">
              Das Angebot
            </h1>
          </div>
          <StreakBadge data={data} today={today} />
        </div>
        <p className="mt-4 max-w-[40rem] text-lg text-navy/80">
          Jeden Tag eine Folge, etwa eine Minute. Jede Folge hat eine Entscheidung, und du hast {SECONDS}{" "}
          Sekunden dafür. Deine Antwort bestimmt, wie es morgen weitergeht.
        </p>

        {/* Die drei Folgen */}
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {EPISODES.map((episode, i) => {
            const done = data.episodes[i];
            const current = i === played && !finished;
            return (
              <li
                key={episode.title}
                className={`rounded-[20px] p-5 ${
                  done ? "bg-[#237a6e] text-white" : current ? "bg-white text-navy shadow-paper" : "bg-navy/[0.06] text-navy/60"
                }`}
              >
                <p className="text-sm font-bold opacity-80">
                  Folge {i + 1}
                  {done ? ", gespielt" : current ? (open ? ", jetzt spielbar" : ", ab morgen") : ", gesperrt"}
                </p>
                <p className="mt-1 font-display text-[31px] font-extrabold leading-none">{episode.title}</p>
                <p className="mt-3 leading-snug">{done ? `Du: „${done.text}“` : episode.teaser}</p>
              </li>
            );
          })}
        </ol>

        {/* Album der Enden */}
        <section className="mt-16">
          <h2 className="font-display text-[clamp(31px,4vw,49px)] font-extrabold leading-none tracking-tight text-navy">
            Dein Album: {data.album.length} von {story.endings.length} Enden
          </h2>
          <p className="mt-3 max-w-[40rem] text-lg text-navy/80">
            Jede Runde endet anders. Auch die verpatzten Enden zählen.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {story.endings.map((e) => {
              const found = data.album.includes(e.id);
              return (
                <li
                  key={e.id}
                  className={`rounded-[20px] p-5 ${found ? "bg-sun text-navy shadow-paper" : "bg-navy/[0.06] text-navy/50"}`}
                >
                  <p className="font-display text-[25px] font-extrabold leading-tight">{found ? e.title : "???"}</p>
                  <p className="mt-2 leading-snug">{found ? e.text : "Noch nicht gefunden."}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Nach dem Ende: Merksätze und der Schritt zum Ernstfall */}
        {finished && (
          <section className="mt-16 grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-[clamp(31px,4vw,49px)] font-extrabold leading-none tracking-tight text-navy">
                Was dahintersteckt
              </h2>
              <div className="mt-6 flex flex-col gap-3">
                {story.reveal.map((card) => (
                  <details key={card.title} className="rounded-[18px] bg-white px-5 py-4 text-navy">
                    <summary className="cursor-pointer font-display text-xl font-extrabold">{card.title}</summary>
                    <p className="mt-3 text-navy/85">{card.text}</p>
                    <p className="mt-2 text-sm text-navy/70">
                      <span className="font-bold text-tealdark">{card.strength}.</span> {card.source}
                    </p>
                  </details>
                ))}
              </div>
            </div>
            <div className="self-start rounded-[20px] bg-[#237a6e] p-6 text-white">
              <h2 className="font-display text-[31px] font-extrabold leading-tight">
                Hast du so ein Gespräch wirklich bald?
              </h2>
              <p className="mt-3 text-lg text-white/85">
                Geplant ist eine ernsthafte Vorbereitung: mit deinen Zahlen, fertigen Sätzen und einer Checkliste.
                Die gibt es noch nicht.
              </p>
              <button
                onClick={() => updateSeries((d) => ({ ...d, prep: true }))}
                disabled={data.prep}
                className="press mt-5 rounded-[14px] bg-white px-5 py-3 font-bold text-navy hover:bg-sun disabled:bg-white/70"
              >
                {data.prep ? "Vorgemerkt. Danke." : "Das würde mich interessieren"}
              </button>
              <p className="mt-3 text-sm text-white/70">
                Der Klick wird nur in deinem Browser gespeichert. Es wird nichts verschickt.
              </p>
            </div>
          </section>
        )}

        <p className="mt-16 text-navy/70">
          Lieber alles am Stück?{" "}
          <Link href="/s/gehaltsangebot" className="font-bold text-navy underline decoration-sun decoration-[3px] underline-offset-4">
            „Das Angebot“ als ganzen Film spielen
          </Link>
        </p>
      </main>
    </>
  );
}

function StreakBadge({ data, today }: { data: SeriesData; today: string }) {
  if (data.streak.count === 0) return null;
  const playedToday = data.streak.last === today;
  return (
    <p className="rounded-[14px] bg-sun px-4 py-2.5 font-display text-xl font-extrabold text-navy">
      {data.streak.count} {data.streak.count === 1 ? "Tag" : "Tage"} in Folge
      <span className="ml-2 text-sm font-bold opacity-70">{playedToday ? "heute gespielt" : "heute noch offen"}</span>
    </p>
  );
}
