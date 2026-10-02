import Link from "next/link";
import { SITE } from "@/lib/site";
import { CATEGORIES, type CategoryId } from "@/stories";
import { Logo } from "./Header";

export default function Footer() {
  return (
    <footer className="mt-auto bg-navy text-white">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-5 py-12 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <Logo dark />
          <p className="mt-4 text-white/70">{SITE.claim}</p>
        </div>
        <nav aria-label="Kategorien">
          <p className="font-display text-lg font-bold">Üben</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-white/75">
            <li>
              <Link href="/ueben" className="hover:text-white">
                Alle Situationen
              </Link>
            </li>
            {(Object.keys(CATEGORIES) as CategoryId[]).map((id) => (
              <li key={id}>
                <Link href={`/ueben/${id}`} className="hover:text-white">
                  {CATEGORIES[id].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="max-w-xs text-sm text-white/60">
          <p>Prototyp. Alle Personen, Firmen und Ausgänge sind erfunden.</p>
          <p className="mt-2">Stimmen: ElevenLabs.</p>
        </div>
      </div>
    </footer>
  );
}
