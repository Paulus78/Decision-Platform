import Link from "next/link";
import { SITE } from "@/lib/site";
import RandomButton from "./RandomButton";

// Bildmarke: ein G auf orangem Feld. Dieselbe Form liegt als app/icon.svg im Browser-Tab.
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#f2a33a" />
      <path d="M27.7 13.6 A10 10 0 1 0 30 20.4 H20.5" fill="none" stroke="#1e294b" strokeWidth="5.6" />
    </svg>
  );
}

export function Logo({ dark }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.name}, Startseite`}>
      <Mark className="h-9 w-9" />
      <span
        className={`font-display text-[23px] font-extrabold tracking-[-0.03em] ${dark ? "text-white" : "text-navy"}`}
      >
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
