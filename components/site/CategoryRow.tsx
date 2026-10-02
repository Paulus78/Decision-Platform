import Link from "next/link";
import CategoryIcon from "@/components/site/CategoryIcon";
import { CATEGORIES, SITUATIONS, inCategory, type CategoryId } from "@/stories";

// Eine Kategorie als Farbstreifen über die ganze Breite: großer Name links,
// rechts ihr Bildzeichen. Ohne id: der Streifen „Alle“.
export default function CategoryRow({ id }: { id?: CategoryId }) {
  const category = id ? CATEGORIES[id] : null;
  const list = id ? inCategory(id) : SITUATIONS;
  const dark = category ? category.dark : true;

  return (
    <Link
      href={id ? `/ueben/${id}` : "/ueben"}
      className={`group block ${dark ? "text-white" : "text-navy"}`}
      style={{ background: category ? category.band : "#1e294b" }}
    >
      <div className="mx-auto flex w-full max-w-[1120px] items-center gap-6 px-5 py-7 sm:py-9">
        <div className="min-w-0 flex-1 transition-transform duration-200 ease-out group-hover:translate-x-3">
          <p className="font-display text-[clamp(56px,10vw,128px)] font-extrabold leading-[0.9] tracking-tighter">
            {category ? category.label : "Alle"}
          </p>
          <p className={`mt-3 text-lg font-semibold ${dark ? "text-white/80" : "text-navy/80"}`}>
            {category ? category.intro : "Alles auf einen Blick."}{" "}
            <span className="whitespace-nowrap">
              {list.length} {list.length === 1 ? "Situation" : "Situationen"}
            </span>
          </p>
        </div>
        <CategoryIcon
          id={id}
          className="h-20 w-20 shrink-0 transition-transform duration-200 ease-out group-hover:-rotate-6 group-hover:scale-110 sm:h-32 sm:w-32"
        />
      </div>
    </Link>
  );
}
