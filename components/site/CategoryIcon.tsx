import type { CategoryId } from "@/stories";

// Selbst gezeichnete Bildzeichen der Kategorien, im flachen Stil der Filme.
// Ohne id: das Zeichen für „Alle“ (ein Stapel Szenen).

const NAVY = "#1e294b";
const SUN = "#f2a33a";
const WHITE = "#ffffff";
const CORAL = "#ef6f5e";
const TEAL = "#2f9e8f";

function Shape({ id }: { id?: CategoryId }) {
  switch (id) {
    // Aktentasche
    case "job":
      return (
        <>
          <path d="M44 34 V26 a8 8 0 0 1 8 -8 h16 a8 8 0 0 1 8 8 V34" fill="none" stroke={NAVY} strokeWidth="8" />
          <rect x="14" y="32" width="92" height="66" rx="12" fill={SUN} />
          <path d="M14 58 H106" stroke={NAVY} strokeWidth="6" />
          <rect x="50" y="50" width="20" height="18" rx="5" fill={WHITE} stroke={NAVY} strokeWidth="5" />
        </>
      );
    // Münzen
    case "geld":
      return (
        <>
          <ellipse cx="46" cy="88" rx="32" ry="12" fill="#c9821f" />
          <ellipse cx="46" cy="80" rx="32" ry="12" fill={SUN} />
          <ellipse cx="46" cy="70" rx="32" ry="12" fill="#c9821f" />
          <ellipse cx="46" cy="62" rx="32" ry="12" fill={SUN} />
          <circle cx="82" cy="46" r="28" fill={SUN} stroke="#c9821f" strokeWidth="6" />
          <text x="82" y="58" textAnchor="middle" fontSize="34" fontWeight="900" fill={NAVY}>
            €
          </text>
        </>
      );
    // Haus mit Schlüssel
    case "alltag":
      return (
        <>
          <path d="M12 56 L56 18 L100 56 Z" fill={NAVY} />
          <rect x="24" y="54" width="64" height="48" rx="6" fill={WHITE} />
          <rect x="46" y="70" width="20" height="32" rx="4" fill={NAVY} />
          <circle cx="92" cy="80" r="13" fill="none" stroke="#ffd66b" strokeWidth="8" />
          <path d="M92 93 V112 M92 104 H102" stroke="#ffd66b" strokeWidth="8" strokeLinecap="round" />
        </>
      );
    // Zwei Gläser, die anstoßen, mit Herz
    case "dating":
      return (
        <>
          <path d="M60 30 C54 16 34 22 40 38 C44 48 60 56 60 56 C60 56 76 48 80 38 C86 22 66 16 60 30 Z" fill={CORAL} />
          <g transform="rotate(-12 36 84)">
            <path d="M20 62 H52 L46 88 H26 Z" fill={WHITE} />
            <path d="M23 74 H49 L46 88 H26 Z" fill={SUN} />
            <rect x="33" y="88" width="6" height="14" fill={WHITE} />
            <rect x="24" y="100" width="24" height="6" rx="3" fill={WHITE} />
          </g>
          <g transform="rotate(12 84 84)">
            <path d="M68 62 H100 L94 88 H74 Z" fill={WHITE} />
            <path d="M71 74 H97 L94 88 H74 Z" fill={SUN} />
            <rect x="81" y="88" width="6" height="14" fill={WHITE} />
            <rect x="72" y="100" width="24" height="6" rx="3" fill={WHITE} />
          </g>
        </>
      );
    // Zwei Sprechblasen
    case "freunde":
      return (
        <>
          <path d="M18 18 H74 a10 10 0 0 1 10 10 V56 a10 10 0 0 1 -10 10 H44 L28 82 V66 H18 a10 10 0 0 1 -10 -10 V28 a10 10 0 0 1 10 -10 Z" fill={NAVY} />
          <circle cx="30" cy="42" r="5" fill={WHITE} />
          <circle cx="46" cy="42" r="5" fill={WHITE} />
          <circle cx="62" cy="42" r="5" fill={WHITE} />
          <path d="M58 54 H102 a10 10 0 0 1 10 10 V90 a10 10 0 0 1 -10 10 H96 V114 L80 100 H58 a10 10 0 0 1 -10 -10 V64 a10 10 0 0 1 10 -10 Z" fill={WHITE} />
          <path d="M66 74 Q80 88 94 74" fill="none" stroke={NAVY} strokeWidth="6" strokeLinecap="round" />
        </>
      );
    // Stapel aus drei Szenen
    default:
      return (
        <>
          <rect x="30" y="18" width="76" height="52" rx="9" fill={CORAL} transform="rotate(8 68 44)" />
          <rect x="20" y="34" width="76" height="52" rx="9" fill={TEAL} transform="rotate(-4 58 60)" />
          <rect x="14" y="52" width="76" height="52" rx="9" fill={SUN} />
          <path d="M44 66 V90 L64 78 Z" fill={NAVY} />
        </>
      );
  }
}

export default function CategoryIcon({ id, className }: { id?: CategoryId; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <Shape id={id} />
    </svg>
  );
}
