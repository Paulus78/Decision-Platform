import Link from "next/link";
import CategoryTabs from "@/components/site/CategoryTabs";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import SituationCard from "@/components/site/SituationCard";
import { CATEGORIES, SITUATIONS, inCategory, type CategoryId } from "@/stories";

// Übersicht aller Situationen. Ohne active: alle, nach Kategorie gruppiert.
export default function Browse({ active }: { active?: CategoryId }) {
  const groups = (active ? [active] : (Object.keys(CATEGORIES) as CategoryId[])).filter(
    (id) => inCategory(id).length > 0,
  );
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-12">
        <h1 className="font-display text-[39px] font-extrabold leading-tight tracking-tight text-navy sm:text-[49px]">
          {active ? CATEGORIES[active].label : "Was willst du üben?"}
        </h1>
        <p className="mt-3 max-w-[38rem] text-lg text-mute">
          {active
            ? CATEGORIES[active].intro
            : `${SITUATIONS.length} Situationen aus ${groups.length} Bereichen. Jede dauert etwa drei Minuten.`}
        </p>
        <div className="mt-8">
          <CategoryTabs active={active} />
        </div>

        {active ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {inCategory(active).map((situation) => (
              <SituationCard key={situation.slug} situation={situation} />
            ))}
          </div>
        ) : (
          // Alle: pro Kategorie eine Zeile, links der Name, rechts ihre Situationen.
          groups.map((id) => (
            <section key={id} className="mt-12 grid gap-6 lg:grid-cols-[1fr_3fr]">
              <div className="lg:pt-2">
                <h2 className="flex items-center gap-3 font-display text-[31px] font-extrabold text-navy">
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: CATEGORIES[id].color }} />
                  {CATEGORIES[id].label}
                </h2>
                <p className="mt-2 text-mute">{CATEGORIES[id].intro}</p>
                <Link
                  href={`/ueben/${id}`}
                  className="mt-3 inline-block text-sm font-bold text-tealdark underline decoration-2 underline-offset-4 hover:text-navy"
                >
                  Nur {CATEGORIES[id].label} zeigen
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {inCategory(id).map((situation) => (
                  <SituationCard key={situation.slug} situation={situation} />
                ))}
              </div>
            </section>
          ))
        )}

        {active && inCategory(active).length < 3 && (
          <p className="mt-10 max-w-[38rem] text-mute">
            Hier kommen noch mehr Situationen dazu. Bis dahin lohnt sich ein Blick in die anderen Bereiche.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
