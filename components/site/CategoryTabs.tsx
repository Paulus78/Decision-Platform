import Link from "next/link";
import { CATEGORIES, CATEGORY_IDS, SITUATIONS, inCategory, type CategoryId } from "@/stories";

// Reiter über der Übersicht: Alle, dann jede Kategorie mit Anzahl.
// Der aktive Reiter trägt die Farbe seiner Kategorie.
export default function CategoryTabs({ active }: { active?: CategoryId }) {
  const tabs = [
    { id: undefined as CategoryId | undefined, href: "/ueben", label: "Alle", count: SITUATIONS.length },
    ...CATEGORY_IDS.map((id) => ({
      id: id as CategoryId | undefined,
      href: `/ueben/${id}`,
      label: CATEGORIES[id].label,
      count: inCategory(id).length,
    })),
  ];
  return (
    <nav aria-label="Kategorien" className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const on = tab.id === active;
        const category = tab.id ? CATEGORIES[tab.id] : null;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={on ? "page" : undefined}
            className={`press flex items-baseline gap-2 rounded-[14px] px-5 py-3 font-display text-xl font-extrabold ${
              on ? (category && !category.dark ? "text-navy" : "text-white") : "bg-white text-navy hover:bg-sun"
            }`}
            style={on ? { background: category ? category.band : "#1e294b" } : undefined}
          >
            {tab.label}
            <span className="text-sm font-bold opacity-60">{tab.count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
