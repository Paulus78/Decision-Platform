import Link from "next/link";
import { SITE } from "@/lib/site";
import RandomButton from "./RandomButton";

// Bildmarke: eine Sprechblase mit schrägem Pause-Zeichen. Der Film hält an, du bist dran.
// Die Schräge ist dieselbe wie beim Wisch-Übergang und im Startbild der Filme.
// Dieselbe Form liegt als app/icon.svg im Browser-Tab.
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M20 2c10.5 0 19 7.2 19 16.5S30.5 35 20 35c-1.8 0-3.6-.2-5.2-.6L6 39l1.8-8.2C3.6 27.800 1 23.400 1 18.500 1 9.200 9.500 2 20 2z"
        fill="#f2a33a"
      />
      <path d="M15 11.500h5.200l-2.400 14h-5.200z" fill="#1e294b" />
      <path d="M23.400 11.500h5.200l-2.400 14h-5.200z" fill="#1e294b" />
    </svg>
  );
}

// Wortmarke in zwei Stärken: „General“ leicht, „probe“ fett.
export function Logo({ dark }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name}, Startseite`}>
      <Mark className="h-10 w-10" />
      <span className={`font-display text-[24px] tracking-[-0.03em] ${dark ? "text-white" : "text-navy"}`}>
        <span className="font-medium">General</span>
        <span className="font-extrabold">probe</span>
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
