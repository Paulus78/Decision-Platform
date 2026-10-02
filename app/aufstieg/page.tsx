import type { Metadata } from "next";
import Game from "@/components/aufstieg/Game";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Der Aufstieg · ${SITE.name}`,
  description: "Du fängst bei NOVARA als Praktikant an. Der CEO hält dich für ein Möbelstück. Dein Ziel: sein Stuhl.",
};

export default function AufstiegPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-navy">
        <Game />
      </main>
      <Footer />
    </>
  );
}
