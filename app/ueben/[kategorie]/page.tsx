import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Browse from "@/components/site/Browse";
import { SITE } from "@/lib/site";
import { CATEGORIES, type CategoryId } from "@/stories";

type Props = { params: Promise<{ kategorie: string }> };

const isCategory = (id: string): id is CategoryId => id in CATEGORIES;

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((kategorie) => ({ kategorie }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategorie } = await params;
  if (!isCategory(kategorie)) return {};
  return { title: `${CATEGORIES[kategorie].label} · ${SITE.name}`, description: CATEGORIES[kategorie].intro };
}

export default async function KategoriePage({ params }: Props) {
  const { kategorie } = await params;
  if (!isCategory(kategorie)) notFound();
  return <Browse active={kategorie} />;
}
