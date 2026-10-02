import type { Metadata } from "next";
import Browse from "@/components/site/Browse";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Alle Situationen · ${SITE.name}`,
  description: "Alle spielbaren Situationen, sortiert nach Job, Geld, Alltag, Dating und Freunde.",
};

export default function UebenPage() {
  return <Browse />;
}
