# Konzept: Die Serie (Prototyp)

Stand: 2026-10-02 · Adresse: `/serie` · Status: Prototyp mit einer Staffel („Das Angebot", drei Folgen)

## Warum

Der Katalog aus sechs Filmen gibt keinen Grund wiederzukommen und fühlt sich wie eine Schulung an. Die Serie dreht das um: klein, regelmäßig, offen am Ende.

Leitsatz: **Jeden Tag eine Minute, eine Entscheidung, ein Cliffhanger. Deine Antwort bestimmt, wie es morgen weitergeht.**

## Was eine Folge ausmacht

1. Kurzer Einstieg (Folge 1: Intro, danach: „Bisher: …" mit der eigenen letzten Antwort).
2. Eine Entscheidung mit **15 Sekunden** Bedenkzeit. Läuft die Zeit ab, entscheidet „dein Gehirn" zufällig.
3. Die Reaktion der Gegenseite.
4. Cliffhanger, gesprochen vom Erzähler, dann „Fortsetzung folgt".

## Gründe wiederzukommen (im Prototyp umgesetzt)

| Antrieb | Umsetzung |
| --- | --- |
| Neugier | Cliffhanger, nächste Folge erst am nächsten Kalendertag |
| Ritual | Zähler „X Tage in Folge" |
| Sammeln | Album mit allen Enden der Staffel, nicht gefundene als „???" |
| Wiederholen | „Neue Runde, ohne Wartezeit", um andere Enden zu finden |
| Teilen | „Ergebnis teilen" (Teilen-Dialog des Geräts oder Text in die Zwischenablage) |

## Geld (im Prototyp nur als Probe)

- **Nicht warten:** Knopf zum sofortigen Freischalten der nächsten Folge. Im Prototyp gratis, mit dem Hinweis, dass es später ein bezahltes Extra wäre.
- **Ernsthafte Vorbereitung:** Nach dem Ende die Frage „Hast du so ein Gespräch wirklich bald?" mit dem Knopf „Das würde mich interessieren".

Beide Klicks werden nur im Browser gezählt (`skips`, `prep`). Es gibt keinen Server, also auch keine Auswertung über mehrere Nutzer.

## Lernteil

Kein Rückblick mehr im Film. Nach dem Ende stehen die drei Merksätze der Story zum Aufklappen auf der Seite, mit Quelle und Stärke.

## Technik

- `components/explainer/Explainer.tsx` hat einen Folgen-Modus (`episode`): Einstieg nach der letzten Entscheidung, Stopp nach der nächsten, Cliffhanger, Rückgabe des Spielstands.
- `components/explainer/ui.tsx`: `Decision` mit `seconds` (Uhr), `Poster` mit `note`.
- `lib/series.ts`: Spielstand im `localStorage` (Schlüssel `gp-serie-angebot-v1`): gespielte Folgen mit Tag, Antwort und Stand, Ende, Album, Zähler.
- `components/series/SeriesHub.tsx`: die Seite mit Film, Wartezeit, Ende, Folgen-Liste, Album.
- Neue Sprecher-Sätze: `c1`, `c2` (Cliffhanger) in `stories/gehaltsangebot.voice.json`.
- Zum Testen der Wartezeit: im `localStorage` das Feld `day` der Folgen auf gestern setzen, oder „Nicht warten" drücken.

## Bewusst noch nicht drin

- **Vergleich mit anderen** („62 % haben auch gekniffen"): braucht eine Datenbank (z. B. Supabase kostenlos) und echte Antworten. Zahlen werden nicht erfunden.
- **Hochformat fürs Handy.** Für tägliche Nutzung wichtig, aber ein eigener Umbau der Zeichnungen.
- **Weitere Staffeln.** Die anderen fünf Filme lassen sich nach demselben Muster schneiden; jeder Film-Baustein braucht dafür den Folgen-Modus.
- **Erinnerung** (Mail oder Mitteilung), wenn die neue Folge da ist.
- **Typ-Karte** und überzeichnete Antworten: gehören in die Texte der nächsten Staffel.

## Was der Prototyp beantworten soll

1. Kommen Testpersonen am zweiten Tag von selbst zurück?
2. Drücken sie „Nicht warten"?
3. Spielen sie eine zweite Runde, um ein anderes Ende zu finden?
4. Klickt jemand auf „Das würde mich interessieren"?
