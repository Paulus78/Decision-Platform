import Link from "next/link";
import { ViewTransition } from "react";
import Thumb from "@/components/Thumb";
import { CATEGORIES, SKILLS, type Situation } from "@/stories";

// Karte einer Situation. Beim Überfahren hebt sie sich und die Sprechblase
// mit dem Satz erscheint, auf den man im Film reagieren muss.
export default function SituationCard({ situation }: { situation: Situation }) {
  const category = CATEGORIES[situation.category];
  return (
    <Link
      href={`/s/${situation.slug}`}
      className="group flex flex-col rounded-[20px] bg-white shadow-card transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className="relative overflow-clip rounded-t-[20px]">
        <ViewTransition name={`film-${situation.slug}`} share="morph" default="none">
          <div>
            <Thumb
              slug={situation.slug}
              className="block aspect-video w-full transition-transform duration-300 ease-out group-hover:scale-[1.04]"
            />
          </div>
        </ViewTransition>
        <div className="pointer-events-none absolute bottom-3 left-3 right-16 origin-bottom-left translate-y-2 scale-90 opacity-0 transition-[transform,opacity] duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100">
          <div className="inline-block max-w-full rounded-[14px] rounded-bl-[4px] bg-navy px-4 py-2.5 text-white shadow-lift">
            <p className="text-xs font-bold text-sun">{situation.opener.who}</p>
            <p className="font-semibold leading-snug">„{situation.opener.text}“</p>
          </div>
        </div>
        <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-card transition-colors duration-150 group-hover:bg-sun">
          <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="flex items-center gap-2 text-sm font-bold text-mute">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: category.color }} />
          {category.label} · {situation.skills.map((id) => SKILLS[id]).join(", ")}
        </p>
        <h3 className="font-display text-[25px] font-extrabold leading-tight text-navy">{situation.title}</h3>
        <p className="text-mute">{situation.hook}</p>
        <p className="mt-auto pt-3 text-sm font-semibold text-mute">
          3 Entscheidungen · ca. {situation.minutes} Minuten
        </p>
      </div>
    </Link>
  );
}
