import type { NextConfig } from "next";

// Frühere Adressen der Situationen (/gehalt, /wohnung, ...) leiten auf /s/<slug> um.
// Die Liste steht hier doppelt zu stories/index.ts, weil diese Datei vor dem Build geladen wird.
const OLD_PATHS: Record<string, string> = {
  "/gehalt": "gehaltsangebot",
  "/erhoehung": "jahresgespraech",
  "/auto": "autoverkauf",
  "/wohnung": "traumwohnung",
  "/date": "erstes-date",
  "/leon": "leon",
};

const nextConfig: NextConfig = {
  redirects() {
    return Object.entries(OLD_PATHS).map(([source, slug]) => ({
      source,
      destination: `/s/${slug}`,
      permanent: false,
    }));
  },
};

export default nextConfig;
