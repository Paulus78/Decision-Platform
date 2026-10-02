import ScenePanel from "@/components/site/ScenePanel";
import { CATEGORIES, inCategory, type CategoryId } from "@/stories";

// Eine Kategorie ausgeklappt: Farbfläche über die ganze Breite mit all ihren Situationen.
export default function CategoryBand({ id, heading = true }: { id: CategoryId; heading?: boolean }) {
  const category = CATEGORIES[id];
  const list = inCategory(id);
  return (
    <section
      id={id}
      className={`scroll-mt-[72px] ${category.dark ? "text-white" : "text-navy"}`}
      style={{ background: category.band }}
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-14">
        {heading && (
          <div className="mb-12 flex flex-wrap items-end gap-x-6 gap-y-2">
            <h2 className="font-display text-[clamp(56px,10vw,128px)] font-extrabold leading-[0.9] tracking-tighter">
              {category.label}
            </h2>
            <p className={`pb-2 text-xl font-semibold ${category.dark ? "text-white/80" : "text-navy/80"}`}>
              {category.intro}
            </p>
          </div>
        )}
        {list.length === 1 ? (
          <ScenePanel situation={list[0]} dark={category.dark} feature />
        ) : (
          <div className="grid gap-x-12 gap-y-16 md:grid-cols-2">
            {list.map((situation) => (
              <ScenePanel key={situation.slug} situation={situation} dark={category.dark} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
