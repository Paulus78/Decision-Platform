import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import Film, { hasFilm } from "@/components/Film";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import SituationCard from "@/components/site/SituationCard";
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
  ].slice(0, 3);

  return (
    <>
      <Header dark />
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

        <section className="mx-auto w-full max-w-[1120px] px-5 py-12">
          <nav aria-label="Pfad" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-mute">
            <Link href="/ueben" className="hover:text-navy">
              Üben
            </Link>
            <span aria-hidden="true">›</span>
            <Link href={`/ueben/${situation.category}`} className="flex items-center gap-2 hover:text-navy">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
              {category.label}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="text-navy">{situation.title}</span>
          </nav>
          <h1 className="mt-4 font-display text-[39px] font-extrabold leading-tight tracking-tight text-navy sm:text-[49px]">
            {situation.title}
          </h1>
          <p className="mt-3 max-w-[40rem] text-xl leading-relaxed text-mute">{situation.hook}</p>
          <ul className="mt-6 flex flex-wrap gap-2 font-semibold text-navy">
            {situation.skills.map((id) => (
              <li key={id} className="rounded-[14px] bg-white px-4 py-2 shadow-card">
                Du übst: {SKILLS[id]}
              </li>
            ))}
            <li className="rounded-[14px] bg-white px-4 py-2 shadow-card">3 Entscheidungen</li>
            <li className="rounded-[14px] bg-white px-4 py-2 shadow-card">ca. {situation.minutes} Minuten</li>
            <li className="rounded-[14px] bg-white px-4 py-2 shadow-card">Mit Ton am besten</li>
          </ul>
        </section>

        <section className="mx-auto w-full max-w-[1120px] px-5 pb-24">
          <h2 className="font-display text-[31px] font-extrabold text-navy">Danach vielleicht</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((other) => (
              <SituationCard key={other.slug} situation={other} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
