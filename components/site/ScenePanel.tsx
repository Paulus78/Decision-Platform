import Link from "next/link";
import { ViewTransition } from "react";
import Thumb from "@/components/Thumb";
import { SKILLS, type Situation } from "@/stories";

// Eine Situation als große Szene: Bild, darauf die Sprechblase mit dem Satz,
// auf den man reagieren muss, daneben oder darunter Titel und Kurztext.
// dark: steht auf dunklem Grund (helle Schrift). feature: Bild und Text nebeneinander.
export default function ScenePanel({
  situation,
  dark,
  feature,
}: {
  situation: Situation;
  dark?: boolean;
  feature?: boolean;
}) {
  const skills = situation.skills.map((id) => SKILLS[id]).join(" und ");
  return (
    <Link
      href={`/s/${situation.slug}`}
      className={`group grid items-center gap-x-12 gap-y-8 ${feature ? "lg:grid-cols-[7fr_5fr]" : ""}`}
    >
      <div className="relative">
        <ViewTransition name={`film-${situation.slug}`} share="morph" default="none">
          <div className="overflow-clip rounded-[20px] shadow-paper transition-shadow duration-200 group-hover:shadow-paper-lg">
            <Thumb slug={situation.slug} className="block aspect-video w-full" />
          </div>
        </ViewTransition>
        <div className="absolute -bottom-5 left-4 max-w-[78%] origin-bottom-left -rotate-2 rounded-[18px] rounded-bl-[4px] bg-white px-4 py-3 text-navy shadow-paper transition-transform duration-200 ease-out group-hover:rotate-0 group-hover:scale-105">
          <p className="text-sm font-bold text-tealdark">{situation.opener.who}</p>
          <p className={`font-display font-bold leading-snug ${feature ? "text-xl" : "text-lg"}`}>
            „{situation.opener.text}“
          </p>
        </div>
        <span className="absolute -right-3 -top-3 flex h-14 w-14 items-center justify-center rounded-full bg-sun text-navy shadow-paper transition-transform duration-200 ease-out group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
      <div className={feature ? "" : "pt-1"}>
        <h3
          className={`font-display font-extrabold leading-[1.02] tracking-tight ${
            feature ? "text-[39px] sm:text-[49px]" : "text-[31px] sm:text-[39px]"
          }`}
        >
          {situation.title}
        </h3>
        <p className={`mt-3 text-lg leading-relaxed ${dark ? "text-white/85" : "text-navy/85"}`}>
          {situation.hook}
        </p>
        <p className={`mt-3 font-semibold ${dark ? "text-white/70" : "text-navy/70"}`}>
          Du übst: {skills}. Drei Entscheidungen, etwa {situation.minutes} Minuten.
        </p>
        <span
          className={`press mt-5 inline-block rounded-[14px] px-5 py-3 font-bold ${
            dark ? "bg-white text-navy group-hover:bg-sun" : "bg-navy text-white group-hover:bg-[#2b3a67]"
          }`}
        >
          Situation spielen
        </span>
      </div>
    </Link>
  );
}
