import Link from "next/link";
import { CATEGORIES, SITUATIONS, inCategory, type CategoryId } from "@/stories";

// Reiter über der Übersicht: Alle, dann jede Kategorie mit Anzahl.
export default function CategoryTabs({ active }: { active?: CategoryId }) {
  const tabs = [
    { id: undefined, href: "/ueben", label: "Alle", count: SITUATIONS.length, color: null },
    ...(Object.keys(CATEGORIES) as CategoryId[]).map((id) => ({
      id,
      href: `/ueben/${id}`,
      label: CATEGORIES[id].label,
      count: inCategory(id).length,
      color: CATEGORIES[id].color,
    })),
  ];
  return (
    <nav aria-label="Kategorien" className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const on = tab.id === active;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={on ? "page" : undefined}
            className={`press flex items-center gap-2 rounded-[14px] px-4 py-2.5 font-bold transition-colors duration-150 ${
              on ? "bg-navy text-white" : "bg-white text-navy shadow-card hover:bg-navy/5"
            }`}
          >
            {tab.color && <span className="h-2.5 w-2.5 rounded-full" style={{ background: tab.color }} />}
            {tab.label}
            <span className={`text-sm font-semibold ${on ? "text-white/60" : "text-mute"}`}>{tab.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
