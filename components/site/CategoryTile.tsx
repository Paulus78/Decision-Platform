import Link from "next/link";
import Thumb from "@/components/Thumb";
import { CATEGORIES, SITUATIONS, inCategory, type CategoryId } from "@/stories";

// Kachel einer Kategorie: ein kleiner Stapel aus den Szenen ihrer Situationen.
// Beim Überfahren fächert sich der Stapel auf. Ohne id: die Kachel „Alle“.
export default function CategoryTile({ id }: { id?: CategoryId }) {
  const list = id ? inCategory(id) : SITUATIONS;
  const pile = (id ? list : [list[4], list[2], list[0]]).slice(0, 3);
  const category = id ? CATEGORIES[id] : null;
  const dark = !id;

  return (
    <Link
      href={id ? `/ueben/${id}` : "/ueben"}
      className={`group flex flex-col rounded-[20px] p-6 shadow-card transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1.5 hover:shadow-lift ${
        dark ? "bg-navy text-white" : "bg-white text-navy"
      }`}
    >
      <div className="relative mx-auto mb-6 mt-2 aspect-video w-[78%]">
        {pile.map((situation, i) => {
          const back = pile.length - 1 - i;
          return (
            <div
              key={situation.slug}
              className="pile absolute inset-0 overflow-clip rounded-[14px] shadow-card transition-transform duration-300 ease-out"
              style={{ "--r": `${back * 5 - (pile.length - 1) * 2.5}deg`, "--x": `${back * 9}%`, zIndex: i } as React.CSSProperties}
            >
              <Thumb slug={situation.slug} className="block h-full w-full" />
            </div>
          );
        })}
      </div>
      <p className="flex items-center gap-2.5 font-display text-[31px] font-extrabold leading-none">
        {category && <span className="h-3.5 w-3.5 rounded-full" style={{ background: category.color }} />}
        {category ? category.label : "Alle"}
      </p>
      <p className={`mt-2 ${dark ? "text-white/70" : "text-mute"}`}>
        {category ? category.intro : "Alles auf einen Blick, nach Bereich sortiert."}
      </p>
      <p className={`mt-4 text-sm font-bold ${dark ? "text-sun" : "text-tealdark"}`}>
        {list.length} {list.length === 1 ? "Situation" : "Situationen"}
      </p>
    </Link>
  );
}
