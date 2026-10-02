import Link from "next/link";
import Thumb from "@/components/Thumb";
import { RevealIcon } from "@/components/explainer/scenes2";
import CategoryTile from "@/components/site/CategoryTile";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import HeroDemo from "@/components/site/HeroDemo";
import Reveal from "@/components/site/Reveal";
import SituationCard from "@/components/site/SituationCard";
import type { Story } from "@/lib/story";
import { CATEGORIES, SITUATIONS, getSituation, type CategoryId } from "@/stories";
import dateStory from "@/stories/erstesdate.json";
import gehaltStory from "@/stories/gehaltsangebot.json";
import leonStory from "@/stories/leon.json";
import wohnungStory from "@/stories/traumwohnung.json";

// Vier echte Rückblick-Karten aus den Story-Dateien, bewusst mit unterschiedlicher Stärke.
const SOURCES = [
  { story: gehaltStory as Story, card: 0, situation: "gehaltsangebot" },
  { story: dateStory as Story, card: 0, situation: "erstes-date" },
  { story: wohnungStory as Story, card: 0, situation: "traumwohnung" },
  { story: leonStory as Story, card: 0, situation: "leon" },
].map(({ story, card, situation }) => ({ ...story.reveal[card], situation: getSituation(situation)! }));

const START = ["gehaltsangebot", "erstes-date", "traumwohnung"].map((slug) => getSituation(slug)!);

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Erster Bildschirm: Erklärung links, spielbare Szene rechts */}
        <section className="mx-auto grid w-full max-w-[1120px] items-center gap-12 px-5 pb-20 pt-12 lg:grid-cols-[5fr_6fr] lg:pt-16">
          <div>
            <h1 className="font-display text-[39px] font-extrabold leading-[1.05] tracking-tight text-navy sm:text-[49px] lg:text-[61px]">
              Üb den schwierigen Moment, bevor er echt ist.
            </h1>
            <p className="mt-6 max-w-[34rem] text-xl leading-relaxed text-mute">
              Gehalt verhandeln, Geld zurückfordern, erstes Date: kurze gezeichnete Situationen, in denen du
              dreimal entscheidest. Danach siehst du, wie es ausgehen kann und was Studien dazu sagen.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/ueben"
                className="press rounded-[14px] bg-teal px-6 py-3.5 text-lg font-bold text-white hover:bg-tealdark"
              >
                Situationen ansehen
              </Link>
              <Link
                href="#ablauf"
                className="font-bold text-tealdark underline decoration-2 underline-offset-4 hover:text-navy"
              >
                So läuft es ab
              </Link>
            </div>
            <p className="mt-8 text-sm font-semibold text-mute">
              {SITUATIONS.length} Situationen · je etwa 3 Minuten · kostenlos, ohne Anmeldung
            </p>
          </div>
          <div>
            <p className="mb-3 font-bold text-navy">Probier es gleich hier aus:</p>
            <HeroDemo />
          </div>
        </section>

        {/* Ablauf in drei Schritten */}
        <section id="ablauf" className="scroll-mt-20 bg-white py-20">
          <div className="mx-auto w-full max-w-[1120px] px-5">
            <h2 className="font-display text-[39px] font-extrabold leading-tight tracking-tight text-navy">
              So läuft es ab
            </h2>
            <p className="mt-3 max-w-[38rem] text-lg text-mute">
              Jede Situation ist ein kurzer Film, der dreimal anhält und auf dich wartet.
            </p>
            <Reveal className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
              <div>
                <div className="flex h-44 items-center">
                  <div className="relative w-64 -rotate-2 overflow-clip rounded-[14px] shadow-lift">
                    <Thumb slug="erstes-date" className="block aspect-video w-full" />
                    <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-sun text-navy">
                      <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <p className="mt-6 text-sm font-bold text-tealdark">Zuerst</p>
                <h3 className="font-display text-[25px] font-extrabold text-navy">Schauen</h3>
                <p className="mt-2 text-mute">
                  Ein Erzähler führt dich in die Situation: wer du bist, was auf dem Spiel steht. Jonas und dein
                  Gehirn geben ungefragt ihren Senf dazu.
                </p>
              </div>
              <div className="md:mt-10">
                <div className="flex h-44 flex-col justify-center gap-2">
                  {["Okay, passt.", "Wie kommen wir näher an meine Zahl?", "Ich melde mich morgen früh."].map(
                    (text, i) => (
                      <div
                        key={text}
                        className={`flex w-72 max-w-full items-center gap-3 rounded-[14px] p-3 shadow-card ${
                          i === 1 ? "translate-x-6 bg-sun" : "bg-page"
                        }`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-black text-white">
                          {"ABC"[i]}
                        </span>
                        <span className="font-bold leading-snug text-navy">„{text}“</span>
                      </div>
                    ),
                  )}
                </div>
                <p className="mt-6 text-sm font-bold text-tealdark">Dann</p>
                <h3 className="font-display text-[25px] font-extrabold text-navy">Entscheiden</h3>
                <p className="mt-2 text-mute">
                  An drei Stellen hält der Film an. Du wählst eine von drei Antworten. Keine ist offensichtlich
                  richtig, und jede verändert, wie es weitergeht.
                </p>
              </div>
              <div className="md:mt-20">
                <div className="flex h-44 items-center gap-4">
                  <span className="h-28 w-28 shrink-0">
                    <RevealIcon kind={0} />
                  </span>
                  <div className="rounded-[14px] bg-page p-4">
                    <p className="font-bold leading-snug text-navy">Die erste Zahl setzt den Rahmen.</p>
                    <p className="mt-1 text-sm text-mute">Galinsky &amp; Mussweiler (2001)</p>
                    <p className="mt-2 inline-block rounded-full bg-teal/15 px-2.5 py-0.5 text-xs font-bold text-tealdark">
                      Gut belegt · Studien
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-sm font-bold text-tealdark">Danach</p>
                <h3 className="font-display text-[25px] font-extrabold text-navy">Verstehen</h3>
                <p className="mt-2 text-mute">
                  Der Rückblick zeigt zu jeder deiner Antworten, was dahintersteckt, und wie das Gespräch auch
                  hätte laufen können.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Kategorien */}
        <section id="kategorien" className="mx-auto w-full max-w-[1120px] scroll-mt-20 px-5 py-20">
          <h2 className="font-display text-[39px] font-extrabold leading-tight tracking-tight text-navy">
            Was willst du üben?
          </h2>
          <p className="mt-3 max-w-[38rem] text-lg text-mute">Such dir einen Bereich aus oder sieh dir alles an.</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(CATEGORIES) as CategoryId[]).map((id) => (
              <CategoryTile key={id} id={id} />
            ))}
            <CategoryTile />
          </div>
        </section>

        {/* Drei Situationen zum Einstieg */}
        <section className="mx-auto w-full max-w-[1120px] px-5 pb-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[39px] font-extrabold leading-tight tracking-tight text-navy">
              Gut zum Einstieg
            </h2>
            <Link
              href="/ueben"
              className="font-bold text-tealdark underline decoration-2 underline-offset-4 hover:text-navy"
            >
              Alle {SITUATIONS.length} Situationen
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {START.map((situation) => (
              <SituationCard key={situation.slug} situation={situation} />
            ))}
          </div>
        </section>

        {/* Quellen */}
        <section id="quellen" className="scroll-mt-20 bg-navy py-20 text-white">
          <div className="mx-auto grid w-full max-w-[1120px] gap-12 px-5 lg:grid-cols-[4fr_6fr]">
            <div>
              <h2 className="font-display text-[39px] font-extrabold leading-tight tracking-tight">
                Woher wissen wir das?
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/75">
                Der Rückblick nach jeder Situation nennt zu jedem Tipp die Quelle: eine Studie, ein Fachbuch oder
                eine offizielle Warnung. Wo es nur Erfahrungswissen gibt, steht das dabei.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/75">
                Die Ausgänge selbst sind erfunden. Sie zeigen einen möglichen Verlauf, kein Versprechen.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {SOURCES.map((source) => (
                <li key={source.title} className="rounded-[14px] bg-white/[0.07] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <p className="font-display text-xl font-bold">{source.title}</p>
                    <span className="rounded-full bg-sun px-3 py-0.5 text-sm font-bold text-navy">
                      {source.strength}
                    </span>
                  </div>
                  <p className="mt-2 text-white/70">{source.source}</p>
                  <Link
                    href={`/s/${source.situation.slug}`}
                    className="mt-2 inline-block text-sm font-bold text-[#7fd6c8] hover:text-white"
                  >
                    Aus: {source.situation.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
