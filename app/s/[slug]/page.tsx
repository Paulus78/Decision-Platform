import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import Film, { hasFilm } from "@/components/Film";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import ScenePanel from "@/components/site/ScenePanel";
import { SITE } from "@/lib/site";
import { CATEGORIES, SITUATIONS, SKILLS, getSituation } from "@/stories";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SITUATIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const situation = getSituation(slug);
  if (!situation) return {};
  return { title: `${situation.title} · ${SITE.name}`, description: situation.hook };
}

export default async function SituationPage({ params }: Props) {
  const { slug } = await params;
  const situation = getSituation(slug);
  if (!situation || !hasFilm(slug)) notFound();

  const category = CATEGORIES[situation.category];
  // Weitere Situationen: erst dieselbe Kategorie, dann der Rest.
  const more = [
    ...SITUATIONS.filter((s) => s.slug !== slug && s.category === situation.category),
    ...SITUATIONS.filter((s) => s.slug !== slug && s.category !== situation.category),
  ].slice(0, 2);

  return (
    <>
      <Header />
      <main>
        {/* Die Bühne füllt den Bildschirm unter der Kopfzeile, lässt aber den Titel anschneiden. */}
        <ViewTransition name={`film-${slug}`} share="morph" default="none">
          <div
            className="bg-navy"
            style={{ "--stage-h": "min(calc(100dvh - 9rem), 56.25vw)" } as React.CSSProperties}
          >
            <Film slug={slug} />
          </div>
        </ViewTransition>

        <p className="bg-sun px-5 py-2.5 text-center text-sm font-bold text-navy md:hidden landscape:hidden">
          Tipp: Dreh dein Handy quer, dann ist der Film größer.
        </p>

        <section className="mx-auto w-full max-w-[1120px] px-5 pb-16 pt-10">
          <nav aria-label="Pfad" className="flex flex-wrap items-center gap-2 font-semibold text-navy/70">
            <Link href="/ueben" className="hover:text-navy">
              Üben
            </Link>
            <span aria-hidden="true">›</span>
            <Link
              href={`/ueben/${situation.category}`}
              className={`rounded-full px-3 py-0.5 font-bold ${category.dark ? "text-white" : "text-navy"}`}
              style={{ background: category.band }}
            >
              {category.label}
            </Link>
          </nav>
          <div className="mt-5 grid gap-x-12 gap-y-6 lg:grid-cols-[7fr_5fr]">
            <div>
              <p className="font-display text-[clamp(31px,4vw,49px)] font-extrabold leading-[1.02] tracking-tight text-navy">
                {situation.title}
              </p>
              <p className="mt-3 text-xl leading-relaxed text-navy/80">{situation.hook}</p>
            </div>
            <dl className="grid content-start gap-4 text-lg">
              <div>
                <dt className="text-sm font-bold text-tealdark">Du übst</dt>
                <dd className="font-semibold text-navy">
                  {situation.skills.map((id) => SKILLS[id]).join(" und ")}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-tealdark">So läuft es</dt>
                <dd className="font-semibold text-navy">
                  Der Film hält dreimal an und wartet auf deine Antwort. Am Ende zeigt der Rückblick, was hinter
                  jeder Antwort steckt.
                </dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-tealdark">Bedienung</dt>
                <dd className="font-semibold text-navy">
                  Ein Klick ins Bild springt zum nächsten Satz. Pause, Ton und Vollbild findest du unten rechts.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="bg-navy text-white">
          <div className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-14">
            <h2 className="font-display text-[clamp(39px,5.4vw,61px)] font-extrabold leading-none tracking-tighter">
              Danach vielleicht
            </h2>
            <div className="mt-12 grid gap-x-12 gap-y-16 md:grid-cols-2">
              {more.map((other) => (
                <ScenePanel key={other.slug} situation={other} dark />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
