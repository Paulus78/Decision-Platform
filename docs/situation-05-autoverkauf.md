# Situation 05 – „Der Käufer ist da" (Autoverkauf)

Stand: 2026-10-02 · Kategorie: Money & Deals · Seite: `/auto`

Idee, Story-Gerüst und Quellen stammen von Codex (Branch `codex/situation`, `docs/codex-autoverkauf.md`). Diese Fassung ist im Serien-Stil neu gebaut (siehe `docs/STILGUIDE.md`).

## Story

Dein Auto steht für 6.800 € VB online, du hoffst auf 6.500 €. Alex kommt zur Probefahrt und bietet 5.800 €.

| # | Was passiert | A | B | C |
| --- | --- | --- | --- | --- |
| 1 | „Ich gebe dir 5.800." | „Ich dachte eher an 6.500." (Alex: 6.200) | „Wie kommst du auf 5.800?" (6.000) | „Die Inspektion ist frisch gemacht." (6.100) |
| 2 | Alex zeigt ein ähnliches Auto für 6.200 €, das aber 40.000 km mehr hat. | „Der hat 40.000 Kilometer mehr." (+200) | „Bei den Reifen komme ich dir entgegen." (0) | „Hauptsache, er ist heute weg." (−100) |
| 3 | Lisa schreibt „Vielleicht morgen". Alex muss los. | „Gut, machen wir es." (verkauft) | „Leg noch 200 drauf, dann gehört er dir." (klappt ab 6.200, sonst geht Alex) | „Ich warte lieber noch." (kein Verkauf) |

Enden: Stark verkauft (ab 6.300 €) · Verkauft · Geplatzt · Alles offen. Nebenfigur: Jonas („Ich kenn mich aus, ich hab mal ein Fahrrad verkauft.").

Unterschied zur Codex-Fassung: Die eigene Zahl (A) bringt bei Entscheidung 1 am meisten, damit Story und Rückblick-Karte „Die erste Zahl bleibt hängen" zusammenpassen. Bei Codex brachte die Inspektion am meisten.

## Evidence Sheet

| Feld | Inhalt |
| --- | --- |
| Core Claim | Erste Angebote beeinflussen das Ergebnis; eine eigene Zahl wirkt dem entgegen. |
| Evidence Strength | Studien (Anker) · Fachbuch (sachliche Vergleiche, eigene Alternative) |
| Claim Boundary | Die Anzeige hatte schon einen Preis gesetzt; die Szene ist keine exakte Versuchssituation. Kilometer und Service bestimmen keinen bewiesenen Marktwert. Ein „Vielleicht" ist kein Angebot. |
| Ausgangs-Hinweis | Alle Beträge, Reaktionen und Enden sind erfunden. |

Quellen (von Codex am 2026-10-02 nachgeschlagen; die Anker-Studie hat Claude für die Gehalts-Situation ebenfalls geprüft):

- Galinsky & Mussweiler (2001), *JPSP* 81(4), 657–669: https://pubmed.ncbi.nlm.nih.gov/11642352/
- Fisher, Ury & Patton, *Getting to Yes* (2011): sachliche Kriterien und die beste Alternative zu einer Einigung. Nicht im Original nachgelesen.

## Stimmen

Erzähler = George, Alex = Will (ElevenLabs). 33 Sätze, ca. 2.300 Zeichen. Alle 33 Sätze sind erzeugt (`node scripts/tts.mjs --story autoverkauf`).

## Dateien

`stories/autoverkauf.json` · `stories/autoverkauf.voice.json` · `components/explainer/AutoFilm.tsx` · `components/explainer/auto-art.tsx` · `app/auto/page.tsx`
