# Design-Brief der Plattform

Stand: 2026-10-02 · Gilt für alle Seiten außerhalb der Videos. Für die Videos gilt `docs/STILGUIDE.md`.

Zweck: Jede neue Seite wird gegen diese Regeln gebaut, damit nichts in Standard-Optik zurückfällt. Akzentfarbe und Schriften sind seit dem ersten Bau der Startseite umgesetzt; Paul kann sie noch kippen.

## 1. Leitidee

Die Seite ist selbst eine Situation: Sie lässt einen erleben, was wir machen, statt es zu beschreiben.

Drei Erkennungsmerkmale:

1. **Antwortkarte:** Alles Klickbare ist mit der Antwortkarte A/B/C aus den Videos verwandt (gleiche Ecken, gleiche Reaktion beim Drücken).
2. **Sprechblase:** Situationen stellen sich mit dem Satz vor, auf den man reagieren muss (`opener` in `stories/index.ts`).
3. **Jonas und das Gehirn:** Sie kommentieren Randfälle (Fehlerseite, leere Liste, alles gespielt). Höchstens ein Auftritt pro Seite.

## 2. Farbe

Verteilung 60 / 30 / 10.

| Rolle | Farbe | Einsatz |
| --- | --- | --- |
| Fläche | `#f4f6f9` (kühles Papierweiß), Karten `#ffffff` | Hintergrund |
| Markierung | `#f2a33a` (Orange) | gewählte Antwortkarte, Play-Knopf, Stärke-Schild auf Navy |
| Tinte | `#1e294b` (Navy dunkel) | Schrift, Navigation, Fußzeile |
| Tinte leise | `#55607f` | Nebentexte. Kontrast auf Fläche mindestens 4,5:1. |
| Akzent | `#2f9e8f` (Teal) | nur Klickbares: Knöpfe, Links, aktive Filter |
| Warnung | `#ef6f5e` (Koralle) | nur Fehler und Gefahr, nie Dekoration |
| Bühne | `#f6e7cf` (Creme) | nur innerhalb der Vorschaubilder und Videos |

Kategorie-Farben (`CATEGORIES` in `stories/index.ts`) erscheinen nur als kleine Markierung an Karte und Kachel, nie als Fläche.

Neue Farbtöne sind nicht erlaubt. Abstufungen entstehen durch Aufhellen oder Abdunkeln dieser Werte.

## 3. Schrift

- Überschriften: Bricolage Grotesque, fett. Text: Hanken Grotesk. Beide kostenlos über `next/font/google`.
- Nicht verwenden: Inter, Geist, Space Grotesk, Serifen-Überschriften.
- Größen auf einer Leiter mit Faktor 1,25: 16 · 20 · 25 · 31 · 39 · 49 · 61 px. Fließtext mindestens 16 px, Zeilenlänge 60 bis 80 Zeichen.
- Keine gesperrten Großbuchstaben-Zeilen als Dekoration. Kleine Hinweise in normaler Schreibweise.
- Die Videos behalten ihre bisherige Schrift (Geist, gesetzt an der Bühne in `components/explainer/ui.tsx`), damit dort keine Zeile anders umbricht.

## 4. Formen und Abstände

- Abstände nur aus der Reihe 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 112 px.
- Ein Eckenradius für Karten (20 px), einer für Knöpfe und Antwortkarten (14 px).
- Trennen in dieser Reihenfolge: erst Abstand, dann leichter Flächenunterschied, dann ein weicher Schatten. Keine grauen Rahmenlinien um Karten.
- Ein einziger Schatten: `0 8px 24px rgb(30 41 75 / 0.08)`. Beim Überfahren `0 14px 32px rgb(30 41 75 / 0.14)`.
- Inhaltsbreite höchstens 1120 px. Layouts dürfen asymmetrisch sein; nicht jede Sektion zentrieren.

## 5. Bilder

- Nur eigene Zeichnungen aus `components/explainer/`. Vorschaubilder kommen aus `components/Thumb.tsx`.
- Keine Icon-Bibliothek, keine erzeugten Bilder, keine Fotos.
- Kleine Bildzeichen (Pfeil, Haken, Menü) werden im Stil der Videos selbst gezeichnet.

## 6. Bewegung

| Art | Dauer | Beispiel |
| --- | --- | --- |
| Rückmeldung | 100–150 ms | Knopf gibt beim Drücken nach |
| Überfahren | 150–200 ms | Karte hebt sich, Schatten wächst |
| Wechsel | 200–300 ms | Filter sortiert um, Menü öffnet |
| Auftritt | 300–500 ms | Sprechblase ploppt auf, Bild wächst zur Bühne |

- Jede Animation braucht einen Zweck: erklären, Rückmeldung geben, orientieren oder belohnen.
- Verläufe mit `ease-out`. Federn (`back.out`) nur bei Sprechblasen und Figuren, wie in den Videos.
- Sektionen blenden nicht alle gleich ein. Höchstens eine Scroll-Animation pro Seite.
- `prefers-reduced-motion`: alle Animationen aus, Inhalte sofort sichtbar.
- Auf Elementen, die GSAP bewegt, kein `transition-all` (friert in React Strict Mode ein). Nur `transition-colors` oder gezielte Eigenschaften.
- Seitenübergänge mit `ViewTransition` aus React (siehe `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`).

## 7. Texte

- Deutsch, Du-Form, kurze Sätze, konkrete Zahlen und Situationen statt Versprechen.
- Knöpfe sagen, was passiert: „Situation spielen", „Nochmal", „Alle Job-Situationen".
- Nicht verwenden: Entdecke, Nahtlos, Jetzt loslegen, Revolutionär, Meistere, „Level up".
- Keine erfundenen Zahlen, Nutzerstimmen oder Logos. Ausgänge heißen „ein möglicher Verlauf".

## 8. Verbotsliste (Merkmale von KI-Standard-Design)

- Verläufe in Flächen oder Überschriften, Glas-Effekte, leuchtende Ränder
- zentrierter Hero mit Pillen-Abzeichen, Überschrift, zwei Knöpfen
- drei gleiche Kästen mit Icon im abgerundeten Quadrat
- Nummern als Dekoration („01 / 02 / 03"), ein einzelnes farbiges Wort in der Überschrift
- Zähler, die hochlaufen; dieselbe Einblendung auf jeder Sektion
- Pfeil hinter jedem Knopf-Text, vierspaltige Fußzeile ohne Inhalt dafür
- fehlende Fokus-Rahmen bei Tastaturbedienung

## 9. Bedienbarkeit

- Alles mit Tastatur erreichbar, sichtbarer Fokus-Rahmen (2 px Akzent, 2 px Abstand).
- Klickflächen mindestens 44 × 44 px.
- Handy im Prototyp: Seiten funktionieren hochkant, das Video zeigt den Hinweis „Bitte Handy drehen".

## 10. Wo was liegt

- Farben, Schatten, Schriften als Tailwind-Namen (`bg-page`, `text-navy`, `text-mute`, `bg-teal`, `shadow-card`, `font-display`): `app/globals.css`.
- Bausteine: `components/site/` (Header, Footer, SituationCard, CategoryTile, CategoryTabs, Browse, HeroDemo, Reveal).
- Screenshots zum Prüfen: Edge ohne Fenster, z. B. `msedge --headless --window-size=1280,1500 --virtual-time-budget=9000 --screenshot=datei.png http://localhost:3100/`.

## 11. Prüfung vor jeder neuen Seite

- [ ] Nur Farben, Abstände, Radien und Schatten aus diesem Dokument
- [ ] Kein Punkt aus der Verbotsliste
- [ ] Jede Animation hat einen Zweck und hält die Zeiten ein
- [ ] Navigation und Fußzeile identisch zu den anderen Seiten
- [ ] Ohne Maus bedienbar, mit „weniger Bewegung" getestet

Quellen der Regeln: siehe `docs/PLAN-plattform.md`, Abschnitt Quellen.
