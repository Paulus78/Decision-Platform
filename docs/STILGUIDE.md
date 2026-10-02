# Stil-Leitfaden für alle Situationen

Stand: 2026-10-02. Gilt für jede neue Situation, egal wer sie baut (Claude oder Codex).
Ziel: Alle Videos sehen aus und fühlen sich an wie eine Serie.

## 1. Ablauf (immer gleich)

1. **Startbild** mit Kategorie, Titel, einem Satz und Play-Knopf.
2. **Intro**, höchstens 15 Sekunden: Wer bist du, was steht auf dem Spiel.
3. **Drei Pausen** mit „Was sagst du?" bzw. „Was schreibst du?" und drei Antwortkarten.
4. Nach jeder Antwort: deine Antwort als Sprechblase, dann die Reaktion, dann springt die Anzeige oben.
5. **Ergebnis** als „Ein möglicher Verlauf".
6. **Rückblick**: drei Karten. Jede zeigt, was du selbst gesagt hast, und was man probieren könnte.
7. **„So hätte es auch laufen können"** mit Vergleich zum eigenen Ergebnis.
8. **Schlusskarte**: Nochmal spielen / Andere Situation, Hinweis auf die Stimmen.

Gesamtlänge: 2 bis 3 Minuten.

## 2. Texte

- Antwortkarten: höchstens ein kurzer Satz, keine Fachwörter.
- Alle drei Antworten müssen plausibel sein. Keine offensichtlich richtige.
- Pro Sprechblase oder Untertitel ein Gedanke.
- Humor kommt von einer **Nebenfigur**: Jonas (Chat-Nachricht) oder dein Gehirn (Gedankenblase mit Stimme). Mindestens ein Kommentar pro Entscheidung.
- Der Erzähler ist locker und nie belehrend.
- Ausgänge heißen „ein möglicher Verlauf". Im Rückblick steht nur, was eine Quelle trägt; sonst „Erfahrungswissen" oder „Studienlage gemischt".

## 3. Bild

- Bühne 16:9, gezeichnet auf 1600 x 900. Alle Größen der Bedienelemente in `cqw`.
- Farben nur aus der Palette `C` in `components/explainer/art.tsx` (Creme, Navy, Teal, Koralle, Orange).
- Figuren als Brustbild aus dem Bausatz: `You` (Spielfigur), `Face` (Gesicht mit Stimmung und Sprechen). Neue Figuren bekommen eigene Haare und Kleidung, aber dasselbe Gesicht.
- Stimmungen: `neutral`, `happy`, `surprised`, `worried`. Die Figur reagiert sichtbar auf jede Entscheidung.
- Feste Plätze: Anzeige oben Mitte (oder oben rechts, wenn Sprechblasen im Weg sind), Untertitel unten Mitte, Bedienknöpfe unten rechts, Fortschritt ganz unten.
- Nichts Wichtiges in die untersten 20 Prozent zeichnen: Dort liegen Untertitel und Antwortkarten.
- Keine fremden Logos, keine echten Marken-Oberflächen.
- Eigene Animationsnamen im CSS eindeutig benennen (`wheel-spin` statt `spin`): Tailwind bringt `spin`, `bounce`, `ping` und `pulse` schon mit.

## 4. Technik

Jede Situation besteht aus genau diesen Teilen:

| Teil | Datei |
| --- | --- |
| Story (Dialoge, Antworten, Folgen, Enden, Rückblick) | `stories/<name>.json` |
| Sprechertexte und Stimmen | `stories/<name>.voice.json` |
| Ablauf | `components/explainer/<Name>Film.tsx` |
| Zeichnungen der Szenen | `components/explainer/<name>-art.tsx` |
| Seite | Eintrag in `stories/index.ts` (Adresse `/s/<slug>`), Film in `components/Film.tsx`, Vorschaubild in `components/Thumb.tsx` |
| Kurz-Doku mit Evidence Sheet | `docs/situation-NN-<name>.md` |

Gemeinsam genutzt und nicht kopiert: `lib/engine.ts` (Logik), `lib/story.ts` (Format), `components/explainer/ui.tsx` (Bühne, Bedienleiste, Untertitel, Entscheidung, Rückblick, Vergleich, Schlusskarte), `sfx.ts` (Soundeffekte).

Im Rückblick braucht jede Karte `decision` (zu welcher Entscheidung sie gehört) und `best` (welche Antworten dazu passen). Gibt es keine beste Antwort: `best: []` und ein `tip`.

## 5. Stimmen

- Erzähler ist in allen Videos dieselbe Stimme: ElevenLabs „George".
- Freigegebene Figurenstimmen (ElevenLabs, Modell `eleven_multilingual_v2`): Sarah (Frau Brandt), Lily (Lena), Charlie (Markus), Liam (dein Gehirn), Will (Alex), Daniel (Herr Krüger).
- Zahlen im Sprechtext ausschreiben (`say`), im Untertitel als Ziffern (`text`).
- Erzeugen: `node scripts/tts.mjs --story <name>`. Ist ElevenLabs aufgebraucht: `node scripts/tts-bundle.mjs --story <name>` (Gemini, mehrere Sätze pro Anfrage).
- Die Spielfigur hat keine Stimme, nur Sprechblasen.

## 6. Checkliste vor dem Abgeben

- [ ] `npm run test:stories` ist grün (alle 27 Wege, jedes Ende erreichbar, kein Sprechertext fehlt).
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` ohne Fehler.
- [ ] Mindestens zwei Wege im Browser komplett gespielt, davon einer bis zur Schlusskarte.
- [ ] Sprechblasen, Anzeige, Untertitel und Antwortkarten verdecken sich nicht.
- [ ] Quellen nachgeschlagen und in der Doku mit Stärke und Grenze eingetragen.
- [ ] Kein Key, kein Token im Repo.

## 7. Ideen für später

- Leise Hintergrundmusik und mehr Soundeffekte (Türklingel, Motor, Kasse).
- Figuren mit kleinen Gesten bei Reaktionen (Kopfschütteln, Jubel, Schulterzucken).
- Untertitel, die Satz für Satz zum Ton mitlaufen.
- „500 € für Leon" mit ElevenLabs neu vertonen, damit der Erzähler überall gleich klingt.
- Teilen-Karte mit dem eigenen Ergebnis.
- Vergleich mit anderen Spielern („62 % wählten B"), sobald echte Daten da sind.
- Hochformat-Clips für Social Media aus denselben Szenen.
