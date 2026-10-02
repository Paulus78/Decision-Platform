# Plan: Die Plattform (Webseite um die Situationen herum)

Stand: 2026-10-02 · Status: Plan V2, noch nichts gebaut

V2 ersetzt V1: Statt auf gesammelte Vorbilder zu warten, legt Claude die Design-Richtung anhand von Recherche selbst fest. Paul entscheidet an zwei Stellen (Entwürfe, Handy).

## 1. Was die Recherche ergeben hat

| Erkenntnis | Folge für uns |
| --- | --- |
| „KI-Look" hat zwei Wellen: (1) lila Verlauf, Inter-Schrift, zentrierter Hero, drei Kästen. (2) die „geschmackvolle" Variante: Creme mit Terrakotta, Serifen-Überschrift, „01 / 02 / 03", gesperrte Großbuchstaben-Zeilen, überall dieselbe Einblend-Animation. | Unsere Video-Palette (Creme, Koralle) liegt nah an Welle 2. Die Seite darf nicht einfach „Creme plus Koralle" sein. Siehe Abschnitt 3. |
| Gutes Design leitet sich aus dem Produkt ab, nicht aus einer Stilvorlage. | Unser Material: gezeichnete Figuren, Sprechblasen, Antwortkarten A/B/C, Jonas' Chat, das Gehirn. Daraus bauen wir die Seite. |
| Besucher verbringen die meiste Zeit im ersten Bildschirm. Am besten erklärt sich ein Produkt, wenn man es dort direkt benutzt. | Der erste Bildschirm ist eine spielbare Mini-Entscheidung, kein Werbetext. |
| Animationen: Rückmeldung 100–150 ms, Überfahren 150–200 ms, größere Wechsel 200–300 ms, nie über 500 ms. | Feste Zeiten im Design-Brief. |
| Karten sind zum Stöbern da: ein Bild, ein Titel, ein Satz, eine Aktion. Filter müssen ohne Fachwörter auskommen. | Karten bleiben schlank. Filter heißen so, wie Nutzer denken („Verhandeln", „Nein sagen"). |
| Next.js 16 bringt Seitenübergänge mit (`ViewTransition`, in den Docs im Projekt nachgelesen). Ohne Browser-Unterstützung läuft die Seite normal, nur ohne Animation. | Vorschaubild wächst beim Klick zur Videobühne. Kein Zusatzpaket nötig. |
| Scroll-Animationen rein per CSS: Unterstützung in Firefox ist unklar (Quellen widersprechen sich). | Wir nehmen GSAP, das ist schon installiert und kostenlos. |

Lernplattformen wie Brilliant lösen dieselbe Aufgabe (ernster Inhalt, verspielte Form) mit einer festen Figur, die die Hürde senkt. Das haben wir schon: Jonas und das Gehirn.

## 2. Leitidee

**Die Seite ist selbst eine Situation.** Sie erklärt nicht, was wir machen. Sie lässt es einen in zehn Sekunden erleben.

Drei Erkennungsmerkmale, die sich durch alle Seiten ziehen:

1. **Die Antwortkarte (A/B/C)** ist unser wichtigstes Bedienelement. Kategorien, Filter und Knöpfe sehen aus wie Verwandte davon.
2. **Die Sprechblase** ersetzt Werbezeilen: Jede Situation stellt sich mit dem Satz vor, auf den man reagieren muss.
3. **Jonas und das Gehirn** kommentieren am Rand: leere Zustände, Fehlerseite, „schon alles gespielt".

## 3. Aussehen

**Farbe** (Verteilung 60 / 30 / 10):
- 60 % ruhige helle Fläche. Kein Creme über die ganze Seite, sondern ein kühles Papierweiß; Creme bleibt den Videos vorbehalten.
- 30 % Navy für Schrift, Navigation und die Fußzeile.
- 10 % ein Akzent für alles Klickbare. Kandidat: Teal (Koralle ist in den Videos „Gefahr").
- Jede Kategorie hat ihre Farbe, aber nur als kleine Markierung und im Vorschaubild.

**Schrift:** eine Überschriften-Schrift mit Charakter plus eine gut lesbare Textschrift, beide kostenlos über Google Fonts. Kandidaten: Bricolage Grotesque (Überschrift) und Hanken Grotesk (Text). Ausgeschlossen, weil KI-Standard: Inter, Geist, Space Grotesk, Serifen-Überschriften. Entscheidung fällt in der Entwurfsrunde. Zu prüfen: Die Videos erben die Schrift der Seite und müssen danach noch passen.

**Formen:** Trennung durch Abstand und leichte Flächenunterschiede, keine grauen Rahmen um jede Karte. Ein einziger Eckenradius, ein einziger Schatten.

**Bilder:** nur unsere eigenen Zeichnungen. Jede Situation bekommt ein Vorschaubild aus ihrer Szene (die Figur, der entscheidende Moment). Keine Icon-Sammlung, keine erzeugten Bilder.

**Texte:** deutsch, konkret, wie in den Videos. Verboten: „Entdecke", „Nahtlos", „Jetzt loslegen".

**Bewusst nicht:** Verläufe, Glas-Effekte, Zähler, die hochlaufen, erfundene Nutzerstimmen, Zahlen wie „10.000 Nutzer".

## 4. Aufbau

### Startseite (von oben nach unten)

1. **Erster Bildschirm:** links ein Satz, was das ist („Üb den schwierigen Moment, bevor er echt ist."), rechts eine echte Szene: Frau Brandt fragt nach deiner Gehaltsvorstellung, drei Antwortkarten. Klick → die Figur reagiert, das Gehirn kommentiert, Knopf „Ganze Situation spielen".
2. **So läuft es ab:** drei Schritte mit je einer kleinen Zeichnung: Schauen · Entscheiden · Verstehen, warum.
3. **Was willst du üben?** Die Kategorien als große Kacheln mit Figur und Anzahl der Situationen.
4. **Neu / Empfohlen:** drei Situationskarten.
5. **Woher wissen wir das?** Ehrlich in drei Sätzen: Studien und Fachbücher, Ausgänge sind „ein möglicher Verlauf". Link zu „Wissen".
6. Fußzeile.

### Seiten

| Seite | Adresse | Inhalt |
| --- | --- | --- |
| Startseite | `/` | siehe oben |
| Üben | `/ueben` | alle Kategorien untereinander, jede mit ihren Situationen. Oben Filter-Karten nach Fähigkeit. |
| Kategorie | `/ueben/<kategorie>` | kurze Einleitung, Situationen, dazu passende Prinzipien |
| Situation | `/s/<name>` | Video groß, darunter: „Das übst du hier", Dauer, Quellen, nächste Situation |
| Wissen | `/wissen`, `/wissen/<thema>` | jedes Prinzip einzeln, mit Quelle, Stärke und Grenze, und den Situationen dazu |
| Über | `/ueber` | Idee, Umgang mit Quellen |
| Rechtliches | `/impressum`, `/datenschutz` | Pflicht vor Veröffentlichung |

### Zwei Wege zum Ziel

- **Nach Lebensbereich:** Job · Geld · Alltag · Dating · Freunde.
- **Nach Fähigkeit:** Verhandeln · Unangenehmes ansprechen · Betrug erkennen · Ins Gespräch kommen.

Jede Karte zeigt beides plus Dauer und, falls gespielt, einen Haken mit dem eigenen Ergebnis (im Browser gespeichert, ohne Login).

### Navigation

Logo · Üben · Wissen · Über · rechts „Zufällige Situation". Auf dem Handy als Leiste unten. Auf Unterseiten eine Pfadzeile („Üben › Job › Das Jahresgespräch").

### Technische Grundlage

Eine zentrale Liste `stories/index.ts`: pro Situation Titel, Kategorie, Fähigkeiten, Einstiegssatz, Dauer, Farbe, Vorschaubild, Prinzipien. Alle Seiten lesen daraus. Eine neue Situation heißt dann: ein Eintrag, und sie erscheint überall. Alte Adressen (`/gehalt` usw.) leiten um.

## 5. Animationen

| Wo | Was passiert | Zweck |
| --- | --- | --- |
| Erster Bildschirm | spielbare Mini-Entscheidung, Figur reagiert | erklärt das Produkt |
| Situationskarte, Maus darüber | Figur schaut auf und blinzelt, die Sprechblase mit dem Einstiegssatz ploppt auf, Karte hebt sich leicht | macht neugierig |
| Klick auf Karte | Vorschaubild wächst zur Videobühne | zeigt: gleiche Sache, jetzt groß |
| Filter wechseln | Karten gleiten an ihren neuen Platz | Orientierung |
| „So läuft es ab" | die drei Schritte spielen beim Scrollen einmal nacheinander ab | Erklärung |
| Knöpfe, Antwortkarten | geben beim Drücken kurz nach | Rückmeldung |
| Situation beendet | Haken wird auf die Karte „gestempelt" | Belohnung |
| Fehlerseite, leere Liste | Jonas schreibt eine Chat-Nachricht | Humor |

Regeln: Jede Animation hat einen Zweck aus der rechten Spalte. Nicht jede Sektion blendet gleich ein. Wer im System „weniger Bewegung" eingestellt hat, bekommt keine.

## 6. Werkzeuge und Kosten

Alles kostenlos: Next.js, Tailwind, GSAP (vorhanden), Google Fonts, Vercel für die Veröffentlichung. Keine Bild-KI. Optional: der kostenlose Vercel-Skill für Seitenübergänge. Der Design-Skill „Impeccable" aus dem Video ist ungeprüft und nicht nötig.

## 7. Reihenfolge

1. **Fundament** (unsichtbar): zentrale Liste, neue Adressen, Umleitungen, Vorschaubilder aus den Szenen.
2. **Design-Brief** `docs/DESIGN.md`: Farben, Schrift, Abstände, Animations-Zeiten, Verbotsliste. Schutz davor, dass spätere Seiten wieder nach Standard aussehen.
3. **Drei Entwürfe** des ersten Bildschirms plus Karte, mit echtem Inhalt, nebeneinander auf einer Vergleichsseite. Paul wählt einen.
4. **Startseite** komplett.
5. **Üben, Kategorie, Situation.**
6. **Wissen, Über.**
7. **Animationen** aus Abschnitt 5.
8. **Prüfung:** Handy, Tastatur, Kontraste, Ladezeit, Codex liest gegen.
9. **Rechtliches, Veröffentlichung.**

## Stand 2026-10-02

Erledigt: Schritte 1, 2, 4 und 5 (Startseite, `/ueben`, `/ueben/<kategorie>`, `/s/<slug>`, Fehlerseite) sowie die Animationen Mini-Entscheidung, Karten-Sprechblase, Stapel-Fächer, Ablauf beim Scrollen, Knopfdruck, Übergang Karte zu Bühne. Schritt 3 (drei Entwürfe) wurde auf Pauls Wunsch übersprungen: eine Richtung direkt gebaut. Name: Generalprobe.

Offen: Wissen- und Über-Seite, „schon gespielt"-Haken, Filter nach Fähigkeit, Rechtliches, Veröffentlichung, Gegenlesen durch Codex.

## 8. Risiken

- **Zu wenig Inhalt:** Mit sechs Situationen hat fast jede Kategorie nur eine. Kategorien wirken dann leer. Vor Veröffentlichung zwei bis drei pro Kategorie anpeilen; bis dahin zeigt `/ueben` alles auf einer Seite.
- **Handy:** Die Videos sind Querformat. Günstig: Hinweis „Handy drehen". Aufwendig: eigene Hochkant-Darstellung.
- **ElevenLabs kostenlos** erlaubt keine kommerzielle Nutzung. Solange nichts verkauft wird, unkritisch.

## 9. Bewusst nicht in dieser Runde

Login, Bezahlung, Vergleich mit anderen Spielern, Statistik, Newsletter, Suche (lohnt erst ab etwa 20 Situationen).

## 10. Offene Fragen an Paul

1. Handy: reicht zum Start „bitte drehen"?
2. Name: bleibt „Decision Platform" als Arbeitstitel? Der Claim wird deutsch.

## Quellen

- https://github.com/funboy322/avoid-ai-design (Merkmale von KI-Design)
- https://www.925studios.co/blog/ai-slop-web-design-guide
- https://unbounce.com/landing-page-articles/landing-page-best-practices/
- https://www.nngroup.com/articles/filter-categories-values/
- https://rive.app/blog/how-brilliant-org-motivates-learners-with-rive-animations
- https://ustwo.com/work/brilliant/
- `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`
- https://www.youtube.com/watch?v=7FU98O0JLHs (Vorgehen in Runden)

Die Web-Quellen wurden nur als Such-Zusammenfassung gelesen, nicht vollständig.
