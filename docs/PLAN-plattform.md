# Plan: Die Plattform (Webseite um die Situationen herum)

Stand: 2026-10-02 · Status: Plan, noch nichts gebaut

## Grundlage

Vorbild für die Vorgehensweise: Chase AI, „Turn Claude Into A Design Genius In 3 Simple Steps" (https://www.youtube.com/watch?v=7FU98O0JLHs).

Das Transkript ließ sich nicht abrufen. Die folgenden Punkte stammen aus Titel, Kapiteln und zwei schriftlichen Zusammenfassungen des Videos:

1. **Geschmack vorgeben:** 20 bis 30 Screenshots von Seiten sammeln, die einem gefallen (Dribbble, Pinterest, X). KI allein landet beim Durchschnitt („sieht nach KI aus": dieselben Farben, dieselbe Schrift).
2. **Werkzeuge ergänzen:** ein Design-Skill (im Video „Impeccable", alternativ „Taste"), 21st.dev für einzelne Bausteine, Higgsfield für Bilder.
3. **In Runden bauen:** nicht alles in einem Wurf. Fünf Richtungen entwerfen, drei behalten, nebeneinander vergleichen, dann feinschleifen. Nie „mach es hochwertiger" ohne Vorlage sagen.

## Was die Plattform leisten muss

- Man versteht in fünf Sekunden, was das ist, und kann sofort eine Situation starten.
- Jede Situation ist schnell zu finden: nach Kategorie, nach Thema, per Suche.
- Die Seite sieht aus wie die Videos (gleiche Farben, gleiche Figuren), nur ruhiger und erwachsener.
- Wenige, gezielte Animationen, vor allem beim Überfahren mit der Maus.
- Alles bleibt kostenlos: kein Login, keine Datenbank, keine bezahlten Bild-Tools in dieser Phase.

## Phase 1 – Geschmack festlegen (du + Claude)

1. **Du sammelst 10 bis 20 Vorbilder:** Screenshots oder Links von Seiten, die dir gefallen. Dazu je ein Satz, was genau (Farben, Schrift, Aufbau, eine Animation). Ablage: `design/inspiration/`.
2. **Claude sortiert und beschriftet** sie nach Startseite, Karten, Navigation, Schrift, Bewegung.
3. **Ergebnis ist ein Design-Brief** (`docs/DESIGN.md`): Farben, Schriften, Abstände, Ecken, Schatten, Tonfall, Regeln für Bewegung, und was ausdrücklich nicht gewollt ist.

Ausgangspunkt für die Farben ist die Palette der Videos (Creme, Navy, Teal, Koralle, Orange).

## Phase 2 – Werkzeuge (Claude prüft, du entscheidest)

| Werkzeug | Wofür | Plan |
| --- | --- | --- |
| Design-Skill („Impeccable" oder „Taste") | bessere Typografie, Abstände, Details | Verfügbarkeit und Kosten prüfen, dann einbinden |
| 21st.dev | fertige Bausteine als Vorlage (Navigation, Karten, Filter) | als Ideenquelle nutzen |
| Higgsfield | erzeugte Bilder | vorerst nicht: Kosten ungeprüft, und unsere eigenen Zeichnungen sind das Erkennungsmerkmal |

Bilder kommen aus den vorhandenen Szenen: Jede Situation bekommt ein Vorschaubild aus ihrer eigenen Zeichnung.

## Phase 3 – Aufbau der Seite (Struktur)

### Seiten

| Seite | Adresse | Inhalt |
| --- | --- | --- |
| Startseite | `/` | Claim, eine Situation direkt startbar, „So funktioniert's" in drei Schritten, Auswahl nach Kategorie, „Woher wissen wir das?", Fußzeile |
| Alle Situationen | `/situationen` | Raster mit Filter (Kategorie, Thema) und Suche |
| Eine Situation | `/s/<name>` | Video, darunter: worum es geht, was man mitnimmt, Quellen, nächste Situation |
| Kategorie | `/kategorie/<name>` | Situationen einer Kategorie mit kurzer Einleitung |
| Wissen | `/wissen` und `/wissen/<thema>` | die Prinzipien einzeln erklärt (z. B. „Die erste Zahl"), mit passenden Situationen. Wichtig für Suchmaschinen. |
| Über | `/ueber` | Idee, Arbeitsweise, Umgang mit Quellen, „ein möglicher Verlauf" |
| Rechtliches | `/impressum`, `/datenschutz` | Pflicht, sobald die Seite öffentlich ist |

### Navigation

- Oben: Logo, Situationen, Kategorien, Wissen, Über, rechts ein Knopf „Zufällige Situation".
- Auf dem Handy: dasselbe als ausklappbares Menü.
- Auf jeder Situations-Seite: „Zurück zur Übersicht" und „Nächste Situation".

### Auffindbarkeit

- Eine zentrale Liste aller Situationen (`stories/index.ts`) mit Titel, Kategorie, Hook, Dauer, Themen, Farbe und Vorschaubild. Startseite, Übersicht, Kategorie- und Wissensseiten lesen alle aus dieser einen Liste.
- „Schon gespielt" und das eigene Ergebnis merkt sich der Browser (ohne Login).
- Die bisherigen Adressen (`/gehalt`, `/wohnung`, `/date`, `/leon`, `/auto`, `/erhoehung`) leiten auf die neuen um.

## Phase 4 – Design in Runden

1. **Fünf Richtungen für die Startseite**, jeweils mit echtem Inhalt, unter `/entwurf/1` bis `/entwurf/5`. Dazu eine Vergleichsseite, die alle nebeneinander zeigt.
2. **Du wählst drei.** Claude verfeinert sie nach deinen Anmerkungen.
3. **Du wählst eine.** Daraus entstehen die festen Bausteine (Navigation, Karte, Knopf, Filter, Fußzeile).
4. **Ausrollen** auf die übrigen Seiten, Entwürfe löschen.

## Phase 5 – Bewegung (sparsam)

- Karten heben sich beim Überfahren leicht an; die Figur im Vorschaubild blinzelt oder schaut auf.
- Knöpfe reagieren beim Drücken.
- Abschnitte blenden beim Scrollen einmal dezent ein.
- Der Filter sortiert sichtbar um, statt hart zu springen.
- Wer im System „weniger Bewegung" eingestellt hat, bekommt keine Animationen.

## Phase 6 – Qualität

- Handy, Tablet, Desktop. Offene Frage: Die Videos sind Querformat; auf dem Handy entweder Hinweis „bitte drehen" oder eine angepasste Darstellung.
- Ladezeit: Ton und Zeichnungen einer Situation erst laden, wenn sie gestartet wird.
- Bedienbar mit Tastatur, lesbare Kontraste.
- Titel, Beschreibung und Vorschaubild für jede Seite (Suchmaschinen, Teilen).
- `npm run test:stories`, Typprüfung, Lint und Build bleiben grün.

## Phase 7 – Veröffentlichen

- Vercel (kostenlos). Eigene Adresse später.
- Vor dem Veröffentlichen: Impressum und Datenschutz, Hinweis „Stimmen: ElevenLabs" bleibt.
- Der kostenlose ElevenLabs-Tarif erlaubt keine kommerzielle Nutzung. Solange nichts verkauft wird, ist das unkritisch; vor einem Prep Pack müsste der Tarif gewechselt oder neu vertont werden.

## Bewusst nicht in dieser Runde

Login, Bezahlung, Vergleich mit anderen Spielern, Statistik, Newsletter, Social Clips.

## Reihenfolge

1. Du: Vorbilder sammeln, offene Fragen beantworten.
2. Claude: Design-Brief, zentrale Situations-Liste, neue Adressen (ohne sichtbare Änderung).
3. Claude: fünf Startseiten-Entwürfe. Du: Auswahl in zwei Runden.
4. Claude: Bausteine, alle Seiten, Bewegung.
5. Gemeinsam: Handy-Test, Texte, Rechtliches. Dann veröffentlichen.

Codex prüft nach Schritt 4: Struktur, Fehler, Bedienbarkeit.

## Offene Fragen an dich

1. Name der Plattform (bisher „Decision Platform") und Claim („Make the mistake here. Not in real life." oder deutsch)?
2. Hell wie die Videos oder dunkel?
3. Nur Deutsch?
4. Wie wichtig ist das Handy zum Start?
5. Hast du schon konkrete Seiten im Kopf, die dir gefallen?
