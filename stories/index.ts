// Zentrale Liste aller Situationen. Startseite, Übersicht, Kategorie- und
// Situations-Seiten lesen alle aus dieser einen Liste.
// Neue Situation: hier einen Eintrag ergänzen, dazu Film in components/Film.tsx
// und Vorschaubild in components/Thumb.tsx.

export type CategoryId = "job" | "geld" | "alltag" | "dating" | "freunde";
export type SkillId = "verhandeln" | "ansprechen" | "betrug" | "kennenlernen";

// color: Markierung in den Filmen. band: Farbfläche der Kategorie auf der Seite.
// dark: true = helle Schrift auf der Fläche, false = dunkle Schrift.
export const CATEGORIES: Record<
  CategoryId,
  { label: string; color: string; band: string; dark: boolean; intro: string }
> = {
  job: { label: "Job", color: "#2f9e8f", band: "#237a6e", dark: true, intro: "Gehalt, Chef, Bewerbung." },
  geld: { label: "Geld", color: "#2b3a67", band: "#2b3a67", dark: true, intro: "Kaufen, verkaufen, handeln." },
  alltag: { label: "Alltag", color: "#ef6f5e", band: "#ef6f5e", dark: false, intro: "Wohnung, Verträge, Betrugsmaschen." },
  dating: { label: "Dating", color: "#8b6fc0", band: "#6f52a8", dark: true, intro: "Kennenlernen ohne Drehbuch." },
  freunde: { label: "Freunde", color: "#f2a33a", band: "#f2a33a", dark: false, intro: "Wenn es unter Freunden unangenehm wird." },
};

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];

export const SKILLS: Record<SkillId, string> = {
  verhandeln: "Verhandeln",
  ansprechen: "Unangenehmes ansprechen",
  betrug: "Betrug erkennen",
  kennenlernen: "Ins Gespräch kommen",
};

export type Situation = {
  slug: string;
  title: string;
  category: CategoryId;
  skills: SkillId[];
  // Ein Satz, worum es geht.
  hook: string;
  // Der Satz, auf den man reagieren muss (für die Sprechblase auf der Karte).
  opener: { who: string; text: string };
  minutes: number;
  // Frühere Adresse, leitet auf /s/<slug> um.
  oldPath: string;
};

export const SITUATIONS: Situation[] = [
  {
    slug: "gehaltsangebot",
    title: "Das Angebot",
    category: "job",
    skills: ["verhandeln"],
    hook: "Du willst 55.000 €. Was sagst du, wenn sie nach deiner Zahl fragen?",
    opener: { who: "Frau Brandt", text: "Was hatten Sie sich gehaltlich vorgestellt?" },
    minutes: 3,
    oldPath: "/gehalt",
  },
  {
    slug: "jahresgespraech",
    title: "Das Jahresgespräch",
    category: "job",
    skills: ["verhandeln", "ansprechen"],
    hook: "Zwei Jahre, ein gerettetes Projekt, null Euro mehr. Heute fragst du nach einer Gehaltserhöhung.",
    opener: { who: "Herr Krüger", text: "So. Gibt es von Ihrer Seite noch etwas?" },
    minutes: 3,
    oldPath: "/erhoehung",
  },
  {
    slug: "autoverkauf",
    title: "Der Käufer ist da",
    category: "geld",
    skills: ["verhandeln"],
    hook: "Dein Auto: 6.800 € VB. Der Käufer bietet nach der Probefahrt deutlich weniger.",
    opener: { who: "Alex", text: "Ich gebe dir 5.800." },
    minutes: 3,
    oldPath: "/auto",
  },
  {
    slug: "traumwohnung",
    title: "Die Traumwohnung",
    category: "alltag",
    skills: ["betrug"],
    hook: "420 € warm, mit Balkon. Der Vermieter ist leider gerade in Dänemark.",
    opener: { who: "Markus", text: "Den Schlüssel schicke ich dir per Post." },
    minutes: 3,
    oldPath: "/wohnung",
  },
  {
    slug: "erstes-date",
    title: "Das erste Date",
    category: "dating",
    skills: ["kennenlernen"],
    hook: "Drei Wochen geschrieben. Jetzt sitzt ihr euch gegenüber, und dein Gehirn dreht durch.",
    opener: { who: "Dein Gehirn", text: "Stille. Seit vier Sekunden. Sag was." },
    minutes: 3,
    oldPath: "/date",
  },
  {
    slug: "leon",
    title: "500 € für Leon",
    category: "freunde",
    skills: ["ansprechen"],
    hook: "Drei Wochen nach dem Leihen postet er Festival-Fotos. Dein Geld hast du noch nicht.",
    opener: { who: "Leon", text: "Kriegst du nächste Woche zurück, safe." },
    minutes: 3,
    oldPath: "/leon",
  },
];

export function getSituation(slug: string) {
  return SITUATIONS.find((s) => s.slug === slug);
}

export function inCategory(category: CategoryId) {
  return SITUATIONS.filter((s) => s.category === category);
}
