import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Film, { hasFilm } from "@/components/Film";
import { SITE } from "@/lib/site";
import { SITUATIONS, getSituation } from "@/stories";

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
  if (!getSituation(slug) || !hasFilm(slug)) notFound();
  return <Film slug={slug} />;
}
