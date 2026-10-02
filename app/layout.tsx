import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Hanken_Grotesk } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

// Seite: Bricolage Grotesque (Überschriften) und Hanken Grotesk (Text).
// Die Filme behalten Geist, damit dort keine Zeile anders umbricht.
const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"] });
const text = Hanken_Grotesk({ variable: "--font-text", subsets: ["latin"] });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${SITE.name} · ${SITE.claim}`,
  description: SITE.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${display.variable} ${text.variable} ${geistSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
