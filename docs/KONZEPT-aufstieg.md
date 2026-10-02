# Konzept: Der Aufstieg (Prototyp)

Stand: 2026-10-02 · Adresse: `/aufstieg` · Status: Stufe 1 (Praktikant) spielbar

## Idee

Du fängst bei NOVARA ganz unten an und kämpfst dich bis zum CEO hoch. Humor steht vorn, das Lernen läuft nebenbei mit.

- **Am Anfang bist du nichts.** Deine Figur ist winzig. Sie wächst mit deinem Ansehen.
- **Der CEO ist der Gegner.** Richard von Thalberg hat die Firma geerbt, ist hochnäsig und gibt dir im ersten Moment einen Spitznamen („Ameise", „Händchen" oder „Topfpflanze"). Ziel des ganzen Spiels: sein Stuhl.
- **Aufstieg sieht man.** Jede Stufe hat ein eigenes Outfit: Kapuzenpulli mit Schlüsselband, Hemd mit schiefer Krawatte, Sakko, Anzug, CEO.

## So spielt sich ein Tag

1. Begrüßung durch den CEO (immer gleich, ergibt den Spitznamen).
2. Fünf Ereignisse, zufällig aus einem Stapel von elf gezogen.
3. Jedes Ereignis: kurze Lage, drei Antworten, sofort eine Reaktion und ein Kommentar vom Gehirn.
4. Drei Anzeigen von 0 bis 10: **Ansehen** (Start 2), **Verbündete** (Start 3), **Nerven** (Start 6).
5. Fällt eine Anzeige auf null, endet der Tag sofort (Kopierraum, Unsichtbar, Archiv).
6. Am Feierabend: ab 7 Ansehen Beförderung, ab 4 „Praktikum verlängert", darunter „Kaffee-Beauftragter".

In jedem Ereignis gibt es eine vernünftige, eine schwache und eine verrückte Antwort. Die verrückte kostet oft Ansehen, bringt aber Verbündete und eine **Bürolegende** zum Sammeln (acht Stück).

## Lernteil

Sechs Ereignisse haben eine „Büro-Weisheit" (z. B. Fehler vom Chef unter vier Augen ansprechen). Am Ende wird genau eine gezeigt: die zu dem Ereignis, das am meisten Ansehen gekostet hat. Sie ist als **Erfahrungswissen, keine Studie** gekennzeichnet. Belegt ist davon bisher nichts.

## Gründe wiederzukommen

Andere Ereignisse bei jedem Durchgang, sechs verschiedene Tagesenden, acht Bürolegenden, die Visitenkarte zum Teilen und später die nächsten Stufen.

## Technik

- `lib/aufstieg.ts`: Ereignisse, Startwerte, Tagesenden, Spielstand im `localStorage` (`gp-aufstieg-v1`).
- `components/aufstieg/Game.tsx`: Spielablauf und Oberfläche.
- `components/aufstieg/art.tsx`: Spielfigur mit fünf Outfits, CEO, Jonas, Büro. Krüger und Frau Brandt kommen aus den Filmen.
- Kein Ton außer dem Plopp, keine Stimmen, kein Server.

Ein neues Ereignis ist ein Eintrag in `POOL` in `lib/aufstieg.ts`.

## Offen

- Stufen 2 bis 5 mit eigenen Ereignissen (oben: Entlassungen, Vorstand, Übernahme) und dem Endkampf um Thalbergs Stuhl.
- Die Outfits im Spiel wechseln (bisher nur in der Leiter zu sehen).
- Balance: bisher nur von Claude per Skript durchgespielt, nicht von Menschen.
- Stimmen für den CEO, mehr Soundeffekte.
- Die vorhandenen Filme als große Momente einbauen („Das Jahresgespräch" als Beförderungsgespräch).
