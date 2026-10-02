import CategoryBand from "@/components/site/CategoryBand";
import CategoryTabs from "@/components/site/CategoryTabs";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { CATEGORIES, CATEGORY_IDS, SITUATIONS, inCategory, type CategoryId } from "@/stories";

// Übersicht aller Situationen. Ohne active: jede Kategorie als eigene Farbfläche untereinander.
// Mit active: nur diese Kategorie.
export default function Browse({ active }: { active?: CategoryId }) {
  const shown = (active ? [active] : CATEGORY_IDS).filter((id) => inCategory(id).length > 0);
  return (
    <>
      <Header />
      <main>
        <div className="mx-auto w-full max-w-[1120px] px-5 pb-12 pt-14">
          <h1 className="font-display text-[clamp(48px,8vw,96px)] font-extrabold leading-[0.95] tracking-tighter text-navy">
            {active ? CATEGORIES[active].label : "Was willst du üben?"}
          </h1>
          <p className="mt-4 max-w-[38rem] text-xl text-navy/80">
            {active
              ? CATEGORIES[active].intro
              : `${SITUATIONS.length} Situationen aus ${shown.length} Bereichen. Jede dauert etwa drei Minuten.`}
          </p>
          <div className="mt-8">
            <CategoryTabs active={active} />
          </div>
        </div>

        {shown.map((id) => (
          <CategoryBand key={id} id={id} heading={!active} />
        ))}

        {active && inCategory(active).length < 3 && (
          <p className="mx-auto w-full max-w-[1120px] px-5 py-12 text-lg text-navy/80">
            Hier kommen noch mehr Situationen dazu. Bis dahin lohnt sich ein Blick in die anderen Bereiche.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
