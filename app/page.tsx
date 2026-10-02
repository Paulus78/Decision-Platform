import Link from "next/link";
import Thumb from "@/components/Thumb";
import { SITE } from "@/lib/site";
import { CATEGORIES, SITUATIONS } from "@/stories";

// Vorläufige Startseite. Das endgültige Design folgt nach docs/DESIGN.md.
export default function Home() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center gap-10 bg-[#1e294b] p-8 text-white">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f2a33a]">{SITE.claim}</p>
        <h1 className="mt-2 text-5xl font-black">Was würdest du tun?</h1>
      </div>
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {SITUATIONS.map((s) => {
          const category = CATEGORIES[s.category];
          return (
            <Link
              key={s.slug}
              href={`/s/${s.slug}`}
              className="flex flex-1 flex-col overflow-clip rounded-3xl bg-white text-[#1e294b] transition-transform hover:-translate-y-1"
            >
              <Thumb slug={s.slug} className="aspect-video w-full" />
              <div className="flex flex-col gap-3 p-8">
                <p className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: category.color }}>
                  {category.label} · {s.minutes} Minuten
                </p>
                <h2 className="text-4xl font-black leading-none">{s.title}</h2>
                <p className="text-lg text-[#2b3a67]/80">{s.hook}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
