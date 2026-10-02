import Link from "next/link";

const SITUATIONS = [
  {
    href: "/gehalt",
    category: "Work",
    title: "Das Angebot",
    hook: "Du willst 55.000 €. Was sagst du, wenn sie nach deiner Zahl fragen?",
    color: "#2f9e8f",
  },
  {
    href: "/wohnung",
    category: "Alltag",
    title: "Die Traumwohnung",
    hook: "420 € warm, mit Balkon. Der Vermieter ist leider gerade in Dänemark.",
    color: "#ef6f5e",
  },
  {
    href: "/date",
    category: "Dating",
    title: "Das erste Date",
    hook: "Drei Wochen geschrieben. Jetzt sitzt ihr euch gegenüber, und dein Gehirn dreht durch.",
    color: "#8b6fc0",
  },
  {
    href: "/leon",
    category: "Freunde",
    title: "500 € für Leon",
    hook: "„Kriegst du nächste Woche zurück, safe.“ Drei Wochen später postet er Festival-Fotos.",
    color: "#f2a33a",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center gap-10 bg-[#1e294b] p-8 text-white">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f2a33a]">
          Make the mistake here. Not in real life.
        </p>
        <h1 className="mt-2 text-5xl font-black">Was würdest du tun?</h1>
      </div>
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {SITUATIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex flex-1 flex-col gap-3 rounded-3xl bg-white p-8 text-[#1e294b] transition-transform hover:-translate-y-1"
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em]" style={{ color: s.color }}>
              {s.category} · 3 Entscheidungen
            </p>
            <h2 className="text-4xl font-black leading-none">{s.title}</h2>
            <p className="text-lg text-[#2b3a67]/80">{s.hook}</p>
            <span
              className="mt-2 self-start rounded-full px-6 py-3 font-bold text-white"
              style={{ background: s.color }}
            >
              Abspielen
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
