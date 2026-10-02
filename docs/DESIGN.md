# Design-Brief der Plattform (V2)

Stand: 2026-10-02 · Gilt für alle Seiten außerhalb der Videos. Für die Videos gilt `docs/STILGUIDE.md`.

V2 ersetzt den ersten Entwurf. Der war ein Standard-Baukasten: geteilter Hero (Text links, Produkt rechts), neutrale helle Fläche, lauter gleiche weiße Karten mit weichem Schatten, Zeichnungen nur als kleine Bildchen. Geprüft gegen:

- Anthropic, Skill „frontend-design" (https://github.com/anthropics/skills/tree/main/skills/frontend-design)
- Impeccable, Referenztexte bolder, colorize, layout, typeset, animate, delight, mode-persuade (https://github.com/pbakaus/impeccable). Nur gelesen, nicht installiert.
- The Evolution of Trust (https://ncase.me/trust/): beginnt nach wenigen Sätzen mit „let's play a game" und kommentiert jede Wahl sofort.

## 1. Leitidee

**Die Seite fängt mitten in einer Situation an.** Der erste Bildschirm ist kein Werbetext, sondern der Moment, um den es geht: Der Film hält an, „Was sagst du?", drei Antworten. Nach dem Klick kommt sofort die Reaktion und die Auflösung mit Quelle. Damit ist der Ablauf erklärt, ohne eigenen Erklär-Abschnitt.

**Die Welt der Filme trägt die Seite.** Ihre Farben sind die Flächen, ihre Szenen sind die Bilder, ihre Sprechblasen und Antwortkarten sind die Bedienelemente. Eine neutrale Seite mit bunten Bildchen darauf ist nicht erlaubt.

**Mut an einer Stelle.** Laut sind: die Szene oben und die Farbflächen der Kategorien mit ihren riesigen Namen. Alles andere bleibt ruhig.

## 2. Farbe

Jede Farbe besitzt eine Fläche oder eine Rolle. Keine verstreuten Akzente.

| Rolle | Farbe | Tailwind |
| --- | --- | --- |
| Grund | Creme `#fbf3e4` | `bg-page` |
| Bühne, Kopfzeile, Entscheidungs-Fläche | Navy `#1e294b` | `bg-navy` |
| Fußzeile | `#151d38` | |
| Markierung: gewählte Antwort, Play, Knöpfe auf Navy | Orange `#f2a33a` | `bg-sun` |
| Kategorie Job | `#237a6e`, helle Schrift | `CATEGORIES.job.band` |
| Kategorie Geld | `#2b3a67`, helle Schrift | |
| Kategorie Alltag | `#ef6f5e`, dunkle Schrift | |
| Kategorie Dating | `#6f52a8`, helle Schrift | |
| Kategorie Freunde | `#f2a33a`, dunkle Schrift | |

Schrift auf Farbflächen ist Weiß oder Navy, je nach `dark` in `stories/index.ts`, nie Grau. Nebentexte entstehen durch Deckkraft (`text-white/80`, `text-navy/80`). Kontrast für Fließtext mindestens 4,5:1.

## 3. Schrift

- Überschriften: Bricolage Grotesque, 800, eng gesetzt (`font-display tracking-tighter`). Text: Hanken Grotesk.
- Drei Größen für Überschriften:
  - Riesig: `text-[clamp(56px,10vw,128px)]`, Zeilenhöhe 0,9. Nur Kategorie-Namen.
  - Groß: `text-[clamp(48px,8vw,96px)]`. Seitentitel, „Was sagst du?".
  - Mittel: `text-[clamp(39px,5.4vw,61px)]` und Titel der Situationen (31 bis 49 px).
- Fließtext 18 bis 20 px, höchstens 42rem breit.
- Keine Großbuchstaben-Zeilen, keine Mittelpunkt-Ketten („A · B · C") als Dekoration. Angaben als Satz: „Drei Entscheidungen, etwa 3 Minuten."
- Die Videos behalten ihre Schrift (Geist), gesetzt an der Bühne in `components/explainer/ui.tsx`.

## 4. Formen

- Keine weißen Karten als Behälter. Inhalte stehen direkt auf der Farbfläche.
- Weiß sind nur Dinge, die in den Filmen auch weiß sind: Sprechblasen und Antwortkarten.
- Schatten: flach und versetzt wie ausgeschnittenes Papier (`shadow-paper`, beim Überfahren `shadow-paper-lg`). Keine weichen Schatten.
- Radien: 20 px Bilder, 18 px Sprechblasen und Antwortkarten (Sprechblasen mit einer spitzen Ecke), 14 px Knöpfe.
- Sprechblasen dürfen leicht gedreht sein und über Bildränder ragen.
- Inhaltsbreite 1120 px. Farbflächen gehen immer über die volle Breite.

## 5. Aufbau

| Seite | Aufbau |
| --- | --- |
| `/` | Spielbare Szene → „Was willst du üben?" mit Jonas → je Kategorie ein Farbstreifen (Klick führt in die Kategorie) plus „Alle" → Quellen |
| `/ueben` | Titel, Reiter (Alle und Kategorien), darunter jede Kategorie als ausgeklappte Farbfläche mit ihren Situationen |
| `/ueben/<kategorie>` | dieselben Reiter, nur diese Farbfläche |
| `/s/<slug>` | Film, Pfad, Titel, Kurztext, „Danach vielleicht" |

Eine Situation erscheint überall als `ScenePanel`: großes Szenenbild, darauf die Sprechblase mit dem Satz, auf den man reagieren muss, daneben oder darunter Titel und ein Knopf. Hat eine Kategorie nur eine Situation, bekommt diese das breite Layout.

## 6. Bewegung

- Ein inszenierter Moment: die Entscheidung im ersten Bildschirm (Antwort → Sprechblase → Reaktion → Auflösung).
- Sonst nur Antworten auf Handlungen: Sprechblase richtet sich beim Überfahren auf, Play-Knopf wächst, Kategorie-Name rückt ein Stück, Knöpfe geben nach, Vorschaubild wächst zur Bühne (`ViewTransition`).
- Keine Einblendungen beim Scrollen, kein Anheben von Karten.
- Dauern: 100–150 ms Rückmeldung, 200–300 ms Zustandswechsel, 400 ms Auftritt einer Sprechblase.
- `prefers-reduced-motion`: alles aus.
- Auf Elementen, die GSAP bewegt, kein `transition-all`.

## 7. Texte

- Deutsch, Du-Form, kurz, konkret. Die Seite spricht wie die Filme.
- Knöpfe sagen, was passiert: „Situation spielen", „Andere Antwort probieren".
- Keine Werbesprache, keine erfundenen Zahlen oder Nutzerstimmen. Ausgänge heißen „ein möglicher Verlauf".
- Jonas und das Gehirn treten höchstens einmal pro Seite auf.

## 8. Nicht erlaubt

Verläufe, Glas-Effekte, weiche Schatten, gleichförmige Karten-Raster, zentrierter Hero mit zwei Knöpfen, Icon im abgerundeten Quadrat, Nummern als Dekoration, graue Schrift auf Farbe, Pfeile an Links, Icon-Bibliotheken, erzeugte Bilder.

## 9. Bedienbarkeit

Alles mit Tastatur erreichbar, Fokus-Rahmen 3 px Orange. Klickflächen mindestens 44 px. Handy: Seiten funktionieren hochkant, beim Film steht der Hinweis, das Handy zu drehen.

## 10. Wo was liegt

- Farben, Schatten, Schriften: `app/globals.css`. Kategorie-Farben: `stories/index.ts`.
- Bausteine in `components/site/`: `HeroDemo`, `CategoryRow` (Streifen auf der Startseite), `CategoryBand` (ausgeklappte Kategorie), `ScenePanel`, `CategoryTabs`, `Browse`, `Header`, `Footer`.
- Screenshots zum Prüfen: `msedge --headless --window-size=1280,800 --virtual-time-budget=12000 --screenshot=datei.png http://localhost:3100/`. Achtung: Szenen mit Einfahr-Animation (erster Bildschirm) erscheinen dabei manchmal leer; im echten Browser gegenprüfen.

## 11. Prüfung vor jeder neuen Seite

- [ ] Steht der Inhalt auf einer Farbfläche der Film-Welt, nicht in weißen Karten?
- [ ] Gibt es genau eine laute Stelle?
- [ ] Nur Farben, Radien und Schatten aus diesem Dokument
- [ ] Jede Bewegung antwortet auf eine Handlung
- [ ] Ohne Maus bedienbar, mit „weniger Bewegung" getestet, in Handy-Breite ohne Querscrollen
