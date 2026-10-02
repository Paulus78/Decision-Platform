"use client";

import { usePathname, useRouter } from "next/navigation";
import { SITUATIONS } from "@/stories";

// Springt zu einer zufälligen Situation (nie zu der, die gerade offen ist).
export default function RandomButton({ dark }: { dark?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  function go() {
    const others = SITUATIONS.filter((s) => `/s/${s.slug}` !== pathname);
    const pick = others[Math.floor(Math.random() * others.length)];
    router.push(`/s/${pick.slug}`);
  }

  return (
    <button
      onClick={go}
      className={`press flex items-center gap-2 rounded-[14px] px-4 py-2.5 font-bold transition-colors duration-150 ${
        dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-navy text-white hover:bg-[#2b3a67]"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="8.5" cy="8.5" r="1.6" fill="currentColor" />
        <circle cx="15.5" cy="15.5" r="1.6" fill="currentColor" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      </svg>
      <span className="hidden sm:inline">Zufällige Situation</span>
      <span className="sm:hidden">Zufall</span>
    </button>
  );
}
