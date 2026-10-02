import Link from "next/link";
import { JonasFace } from "@/components/explainer/scenes2";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";

// Fehlerseite: Jonas meldet sich per Chat.
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[1120px] flex-col items-start px-5 py-24">
        <div className="pop-in flex items-end gap-3">
          <span className="h-14 w-14 shrink-0">
            <JonasFace />
          </span>
          <div className="rounded-[20px] rounded-bl-[4px] bg-white px-5 py-4 shadow-card">
            <p className="text-sm font-bold text-tealdark">Jonas</p>
            <p className="text-lg font-semibold text-navy">Bro. Die Seite gibt es nicht. Hast du dich vertippt?</p>
          </div>
        </div>
        <h1 className="mt-10 font-display text-[39px] font-extrabold leading-tight tracking-tight text-navy sm:text-[49px]">
          Hier ist nichts.
        </h1>
        <p className="mt-3 max-w-[34rem] text-lg text-mute">
          Die Adresse führt ins Leere. Alle Situationen findest du in der Übersicht.
        </p>
        <Link
          href="/ueben"
          className="press mt-8 rounded-[14px] bg-teal px-6 py-3.5 text-lg font-bold text-white hover:bg-tealdark"
        >
          Zur Übersicht
        </Link>
      </main>
      <Footer />
    </>
  );
}
