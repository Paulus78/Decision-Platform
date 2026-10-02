import Link from "next/link";
import { JonasFace } from "@/components/explainer/scenes2";
import CategoryRow from "@/components/site/CategoryRow";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import HeroDemo from "@/components/site/HeroDemo";
import type { Story } from "@/lib/story";
import { CATEGORY_IDS, getSituation } from "@/stories";
import dateStory from "@/stories/erstesdate.json";
import gehaltStory from "@/stories/gehaltsangebot.json";
import leonStory from "@/stories/leon.json";
import wohnungStory from "@/stories/traumwohnung.json";

const gehalt = gehaltStory as Story;

// Vier echte Rückblick-Karten aus den Story-Dateien, bewusst mit unterschiedlicher Stärke.
const SOURCES = [
  { story: gehalt, situation: "gehaltsangebot" },
  { story: dateStory as Story, situation: "erstes-date" },
  { story: wohnungStory as Story, situation: "traumwohnung" },
  { story: leonStory as Story, situation: "leon" },
].map(({ story, situation }) => ({ ...story.reveal[0], situation: getSituation(situation)! }));

export default function Home() {
  // Die Auflösung der Mini-Entscheidung kommt aus dem Rückblick der echten Story.
  const principles = gehalt.reveal.slice(0, 2).map(({ title, text, strength, source }) => ({
    title,
    text,
    strength,
    source,
  }));

  return (
    <>
      <Header />
      <main>
        <HeroDemo principles={principles} />

        {/* Kategorien: je ein Farbstreifen über die ganze Breite */}
        <section id="kategorien" className="scroll-mt-[72px]">
          <div className="mx-auto grid w-full max-w-[1120px] items-end gap-8 px-5 pb-12 pt-20 lg:grid-cols-[7fr_5fr]">
            <h2 className="font-display text-[clamp(48px,8vw,96px)] font-extrabold leading-[0.95] tracking-tighter text-navy">
              Was willst du üben?
            </h2>
            <div className="flex items-end gap-3 lg:pb-3">
              <span className="h-14 w-14 shrink-0">
                <JonasFace />
              </span>
              <p className="rounded-[18px] rounded-bl-[4px] bg-white px-4 py-3 text-lg font-semibold leading-snug text-navy shadow-paper">
                <span className="block text-sm font-bold text-tealdark">Jonas</span>
                Bro. Mach den Fehler lieber hier. Nicht bei deinem Chef.
              </p>
            </div>
          </div>
          {CATEGORY_IDS.map((id) => (
            <CategoryRow key={id} id={id} />
          ))}
          <CategoryRow />
        </section>

        {/* Quellen */}
        <section id="quellen" className="scroll-mt-[72px]">
          <div className="mx-auto grid w-full max-w-[1120px] gap-x-12 gap-y-10 px-5 py-24 lg:grid-cols-[5fr_7fr]">
            <div>
              <h2 className="font-display text-[clamp(39px,5.4vw,61px)] font-extrabold leading-none tracking-tighter text-navy">
                Woher wissen wir das?
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-navy/80">
                Der Rückblick nach jeder Situation nennt zu jedem Tipp die Quelle: eine Studie, ein Fachbuch oder
                eine offizielle Warnung. Wo es nur Erfahrungswissen gibt, steht das dabei.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-navy/80">
                Die Ausgänge selbst sind erfunden. Sie zeigen einen möglichen Verlauf, kein Versprechen.
              </p>
            </div>
            <dl className="grid content-start gap-x-10 gap-y-9 sm:grid-cols-2">
              {SOURCES.map((source) => (
                <div key={source.title}>
                  <dt className="font-display text-2xl font-extrabold leading-tight text-navy">{source.title}</dt>
                  <dd className="mt-2 text-navy/80">
                    <span className="font-bold text-tealdark">{source.strength}.</span> {source.source}
                  </dd>
                  <dd className="mt-2">
                    <Link
                      href={`/s/${source.situation.slug}`}
                      className="font-bold text-navy underline decoration-sun decoration-[3px] underline-offset-4 hover:decoration-navy"
                    >
                      Aus „{source.situation.title}“
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
