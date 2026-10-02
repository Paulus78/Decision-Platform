import Link from "next/link";
import { SITE } from "@/lib/site";
import RandomButton from "./RandomButton";

// Logo: eine Sprechblase mit Play-Dreieck.
export function Logo({ dark }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name}, Startseite`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <path d="M6 4h28a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H19l-9 8v-8H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z" fill="#f2a33a" />
        <path d="M16 10.5v13l11-6.5z" fill="#1e294b" />
      </svg>
      <span className={`font-display text-[22px] font-extrabold tracking-tight ${dark ? "text-white" : "text-navy"}`}>
        {SITE.name}
      </span>
    </Link>
  );
}

const LINKS = [
  { href: "/ueben", label: "Üben" },
  { href: "/#kategorien", label: "Kategorien" },
  { href: "/#quellen", label: "Quellen" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-navy">
      <div className="mx-auto flex h-[72px] w-full max-w-[1120px] items-center gap-8 px-5">
        <Logo dark />
        <nav className="hidden flex-1 items-center gap-1 md:flex" aria-label="Hauptnavigation">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[14px] px-4 py-2.5 font-semibold text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link href="/ueben" className="rounded-[14px] px-4 py-2.5 font-semibold text-white md:hidden">
            Üben
          </Link>
          <RandomButton />
        </div>
      </div>
    </header>
  );
}
