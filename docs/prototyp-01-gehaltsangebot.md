# Prototyp 01 – „Das Angebot" (Gehaltsverhandlung)

Stand: 2026-10-02 · Status: Entwurf, noch nicht gebaut

Kategorie: Work · Mechanismus-Tags: Anchoring, Scarcity (Frist) · Dauer: ca. 120 Sekunden · Sprache: Deutsch

---

## 1. Story

### Grundregel

Alles muss einfach und sofort verständlich sein: Optionen höchstens ein kurzer Satz, keine Fachwörter, pro Nachricht ein Gedanke.

### Figuren

| Figur | Rolle | Ton |
| --- | --- | --- |
| Du | 24, Studium fertig, erster richtiger Job | – |
| Frau Brandt | HR bei der Novara GmbH | freundlich, professionell, gibt nichts freiwillig her |
| Jonas | Kumpel, schreibt per Chat | meint es gut, rät schlecht |

### Dauerhaftes UI-Element

Oben läuft die Anzeige **„Zahl auf dem Tisch"**. Sie startet bei „— €" und springt bei jeder Entscheidung live mit.

### Intro (ca. 8 Sekunden, drei Karten, schneller Schnitt)

1. „Du bist 24. Studium fertig. Drittes Gespräch bei Novara: lief gut."
2. „Dein Ziel: 55.000 €. Deine Miete: 780 €. Dein Kontostand: lieber nicht."
3. „Donnerstag, 16:42 Uhr." → Handy vibriert, eingehender Anruf: *Novara GmbH*

### Beat 1 – Der Anruf

> **Brandt:** „Hallo, Brandt von Novara. Gute Nachrichten: Wir würden Sie gern im Team haben."
> **Brandt:** „Bevor ich das Angebot fertig mache: Was hatten Sie sich gehaltlich vorgestellt?"

**Entscheidung 1**

| | Du sagst | Reaktion Brandt | Zahl auf dem Tisch |
| --- | --- | --- | --- |
| A | „57.500 €." | kurze Stille. „Okay. Das liegt über dem, was wir eingeplant hatten. Ich spreche mit dem Fachbereich." | 57.500 € (deine Zahl) |
| B | „Zwischen 50.000 und 56.000 €." | „50.000, das nehme ich mal so mit." | 50.000 € (sie hört nur das untere Ende) |
| C | „Was zahlen Sie denn?" | „Wir liegen bei 46.000 bis 50.000 €, je nach Erfahrung." | 46.000–50.000 € (ihre Zahl) |

Jonas (Chat, direkt danach): „Und??? Haben sie angerufen"

### Beat 2 – Die Mail (20 Minuten später)

> **Betreff: Ihr Angebot – Novara GmbH**
> „… freuen wir uns, Ihnen ein Jahresgehalt von **{Angebot} €** anbieten zu können. Unser Budget für die Stelle ist damit leider ausgeschöpft."

Angebot je nach Entscheidung 1: **A → 51.000 € · B → 49.000 € · C → 48.000 €**

> **Jonas:** „{Angebot}?? Bro. Ich krieg 41. NIMM."

**Entscheidung 2**

| | Du schreibst | Reaktion Brandt | Wirkung |
| --- | --- | --- | --- |
| A | „Okay, passt." | „Wunderbar, dann mache ich den Vertrag fertig." | Zahl bleibt, du hast praktisch zugesagt |
| B | „Wie kommen wir näher an meine Zahl?" | „Verstehe ich. Ich frage noch mal beim Fachbereich nach." | + 1.500 € |
| C | „Okay, aber mit Gehaltserhöhung nach 6 Monaten." | „Ein Gehaltsgespräch nach 6 Monaten kann ich zusagen." | Zahl bleibt, + Gehaltsgespräch nach 6 Monaten |

### Beat 3 – Der Druck (am Abend)

> **Brandt:** „Kurzes Update: Wir bräuchten Ihre Antwort bis morgen 12 Uhr. Wir sind parallel noch mit einer zweiten Kandidatin im Gespräch."
> **Jonas:** „Die haben ne ZWEITE?? Sag zu bevor die dich ersetzen"

**Entscheidung 3**

| | Du schreibst | Reaktion Brandt |
| --- | --- | --- |
| A | „Ich sage zu." | „Schön! Der Vertrag kommt morgen." |
| B | „Ich melde mich morgen früh." | Nächster Morgen, 9:40 Uhr: Sie meldet sich von selbst. Wenn du vorher nicht zugesagt hast: + 500 €. |
| C | „Bei {Angebot + 1.000} € sage ich sofort zu." | Wenn du vorher nicht zugesagt hast: „Das kriege ich durch." (+ 1.000 €). Wenn du in Entscheidung 2 schon zugesagt hattest: „Ich dachte, wir wären uns einig?" (bleibt, Stimmung kühl) |

### Enden (jeweils markiert als „Ein möglicher Verlauf")

| Ende | Bedingung | Text |
| --- | --- | --- |
| Der Schnellabschluss | bis 49.000 € | „Du hast den Job. Und das Gefühl, dass da mehr drin war." |
| Solide | 49.500–51.500 € | „Guter Einstieg. Du hast nicht alles liegen lassen." |
| Stark verhandelt | ab 52.000 € oder ab 51.000 € mit Gehaltsgespräch | „Du hast den Rahmen gesetzt, nicht sie." |

Spanne der Ergebnisse: 48.000 € bis 53.500 €. Schluss-Nachricht Jonas passend zum Ende, z. B. „53,5?! Ich kündige und bewerb mich da."

Ergebnis-Screen: „Dein Ergebnis: {Zahl} € · Dein Ziel war: 55.000 €"

### Reveal – „Was ist gerade passiert?"

Drei Karten, je 2 Sätze:

1. **Die erste Zahl setzt den Rahmen.** Wer zuerst eine Zahl nennt, zieht die ganze Verhandlung in ihre Richtung. Hast du gefragt statt genannt, hat Frau Brandt den Anker gesetzt.
2. **Bei einer Spanne zählt das untere Ende.** „50 bis 56" wird zu „50". Stärker: Spanne über dem Ziel („55 bis 60") oder eine konkrete Zahl wie 57.500.
3. **Fragen statt Nein sagen.** „Wie kommen wir näher an meine Zahl?" lässt die Gegenseite an deiner Lösung arbeiten, ohne dass du das Angebot ablehnst.

Badge: „Belegt durch Forschung" → „Explore the science" öffnet das Evidence Sheet.

### „So hätte es auch laufen können" (optional, Button, ca. 15 Sekunden)

Schnelldurchlauf mit Etiketten, Zähler läuft mit:

1. „Ich hatte mir 57.500 € vorgestellt." → *Anker gesetzt*
2. „Wie kommen wir näher an meine Zahl?" → *Frage statt Nein*
3. „Bei 53.500 € sage ich sofort zu." → *Klare Zahl, klare Zusage*

Vergleich: „Starker Verlauf: 53.500 € · Du: {Zahl} €" → Buttons „Nochmal spielen" / „Nächste Situation"

---

## 2. Evidence Sheet

| Feld | Inhalt |
| --- | --- |
| Core Claim | Die erste genannte Zahl beeinflusst das Endergebnis einer Verhandlung stark (Anchoring). |
| Evidence Strength | Strong (Anker) · Moderate (Spanne, präzise Zahl) · Expert Framework (Wie-Frage, Paket, Frist) |
| Claim Boundary | Nicht behauptet: dass man immer zuerst eine Zahl nennen soll. Wer den Markt nicht kennt, kann sich mit einem zu niedrigen Anker selbst schaden. Nicht behauptet: dass Fristen immer Taktik sind. |
| Ausgangs-Hinweis | Alle Euro-Beträge, Reaktionen und Enden sind erfunden. Sie zeigen einen möglichen Verlauf, keinen garantierten. |

**Quellen (am 2026-10-02 per Websuche geprüft: Existenz, Autoren, Journal, Kernaussage)**

| Aussage | Quelle | Stärke |
| --- | --- | --- |
| Erste Angebote wirken als Anker | Galinsky & Mussweiler (2001), *Journal of Personality and Social Psychology*, 81, 657–669; bestätigt u. a. durch Gunia et al. (2013), „The Remarkable Robustness of the First-Offer Effect" | Strong |
| Spanne über dem Ziel („bolstering range") bringt bessere Ergebnisse, ohne die Beziehung zu belasten | Ames & Mason (2015), „Tandem Anchoring", *JPSP* | Moderate |
| Präzise Zahlen ankern stärker als runde | Mason, Lee, Wiley & Ames (2013), *Journal of Experimental Social Psychology*, 49(4), 759–763 | Moderate |
| Wer beim Einstiegsgehalt verhandelt, bekommt im Schnitt mehr (ca. 5.000 $, 149 Befragte, USA) | Marks & Harold (2011), *Journal of Organizational Behavior*, 32(3), 371–394 | Moderate (Befragung, kein Experiment) |
| Offene „Wie"-Fragen | Chris Voss, *Never Split the Difference* | Expert Framework |
| Paket statt nur Zahl, Interessen statt Positionen | Fisher & Ury, *Getting to Yes* (Harvard-Konzept) | Expert Framework |

Noch offen: Originalstudien einmal selbst lesen (bisher nur Abstracts und Zusammenfassungen geprüft).

---

## 3. Umsetzung

### Ziel des Prototyps

Eine spielbare Szene im Browser, optimiert fürs Handy, die man jemandem als Link schicken kann. Kein Login, keine Datenbank, keine Kosten.

### Technik

| Bereich | Entscheidung | Warum |
| --- | --- | --- |
| Framework | Next.js + TypeScript + Tailwind | wie im Konzept, kostenlos |
| Story | `stories/gehaltsangebot.json` als einzige Quelle | später liest HyperFrames dieselbe Datei für Clips |
| Engine | kleine eigene Logik: Beats abspielen, Entscheidung speichern, Zahl berechnen, Ende wählen | bewusst generisch, damit Situation 2 nur eine neue JSON-Datei ist |
| Animation | CSS + Framer Motion (Open Source) | Tipp-Indikator, Zähler, Karten |
| Hosting | Vercel Free | Link zum Teilen |
| Sound | Klingelton, Nachricht-Pop, Zähler-Tick (abschaltbar) | viel Wirkung für wenig Aufwand |

### Look

Ein Handy mit drei Ansichten: Anruf, Mail, Chat. Sieht aus wie ein echtes Handy, ist aber ein eigenes Design (keine 1:1-Kopie von WhatsApp oder iOS, keine fremden Logos).

### Bausteine (wiederverwendbar)

Handy-Rahmen · Intro-Karten · Eingehender Anruf · Anruf-Ansicht mit Sprechblasen · Mail-Ansicht · Chat (Jonas) mit Tipp-Indikator · Entscheidungskarte · Zähler „Zahl auf dem Tisch" · Ergebnis-Screen · Reveal-Karten · Schnelldurchlauf

### Bewusst nicht im Prototyp

- **Community-Vergleich** („62 % wählten B"): Regel aus dem Konzept ist „nur echte Daten". Kommt in Schritt 2 mit Supabase.
- PostHog, Login, Payment, Social Clip (HyperFrames), Share-Karte.

### Reihenfolge

1. Projekt aufsetzen, Story-JSON schreiben, Engine ohne Design (klickbar, nur Text)
2. Bausteine und Design (Handy-Rahmen, Chat, Anruf, Mail, Zähler)
3. Ergebnis, Reveal, Schnelldurchlauf
4. Sound, Feinschliff, selbst durchspielen, auf Vercel stellen
5. Danach: Supabase (Entscheidungen zählen), dann Clip mit HyperFrames

### Offene Entscheidungen

- Arbeitsteilung mit Codex (z. B. Claude baut, Codex prüft und spielt gegen)

---

## 4. Stand der Umsetzung (2026-10-02)

Format-Entscheidung: Die Situation läuft als **animiertes Video im Browser** (Hochformat 9:16), das an drei Stellen pausiert und eine Entscheidung verlangt. Es ist keine Videodatei, sondern live animiert (GSAP), damit Texte und Beträge ohne neues Rendern änderbar bleiben.

| Was | Wo |
| --- | --- |
| Story (einzige Quelle) | `stories/gehaltsangebot.json` |
| Logik (Beträge, Bedingungen, Enden) | `lib/engine.ts`, `lib/story.ts` |
| Video-Player (Ablauf, Pausen, Entscheidungen) | `components/video/VideoPlayer.tsx` |
| Szenen und Animationen | `components/video/scenes.tsx` |
| Textversion zum Testen | `/text` (`components/TextPlayer.tsx`) |

Bedienung: Ein Tipp aufs Bild springt zur nächsten Einstellung.

Noch offen: Sound, Feinschliff am Timing, Veröffentlichung (Vercel), Community-Vergleich (Supabase), Social Clip (HyperFrames – nutzt ebenfalls GSAP, die Animationen lassen sich deshalb später übernehmen).

---

## 5. Richtungswechsel: gezeichnetes Erklärvideo (2026-10-02)

Vorbild: „Test 3: Erklärvideos" aus https://youtu.be/Vc0lLq3SVlw (ab 14:31). Gewünscht ist ein illustriertes 2D-Erklärvideo mit Sprecher, das an drei Stellen pausiert und fragt „Was sagst du?".

Stand: **Stil-Test** der ersten Szene (Intro → Anruf → Entscheidung 1 → Reaktion) unter `/`.

| Was | Wo |
| --- | --- |
| Ablauf des Stil-Tests | `components/explainer/Explainer.tsx` |
| Zeichnungen (SVG, selbst gezeichnet) | `components/explainer/art.tsx` |
| Soundeffekte (im Browser erzeugt) | `components/explainer/sfx.ts` |
| Sprechertexte und Stimmen | `stories/gehaltsangebot.voice.json` |
| Audio erzeugen (Gemini TTS, Free Tier) | `node scripts/tts.mjs` → `public/audio/*.wav` |
| Erste Version (Text-Video) zum Vergleich | `/v1` |

Hinweise:
- Format 16:9, Stimmen: Erzähler „Puck", Frau Brandt „Kore" (Gemini 3.8 Flash TTS).
- Gemini Free Tier: 10 TTS-Anfragen pro Tag und Modell. Ausweichmodell per `TTS_MODEL=gemini-3.8-flash-lite-tts`. Für das ganze Video mehrere Sätze pro Anfrage bündeln und per ffmpeg schneiden.
- Der API-Key liegt in `.env.local` (wird nicht committet).
- Port 3000 ist oft von der Codex-Kopie belegt; die Vorschau hier läuft auf 3100.

---

## 6. Ganzes Video gebaut (2026-10-02)

Das gezeichnete Erklärvideo läuft jetzt komplett durch: Intro → Anruf → Entscheidung 1 → Mail → Entscheidung 2 → Frist am Abend → Entscheidung 3 → Ergebnis → drei Erklär-Karten → „So hätte es auch laufen können".

- Der Ablauf kommt aus `stories/gehaltsangebot.json`. Neu darin: `voice` an Zeilen (welche Audiodatei), `prompt` an Entscheidungen (Erzähler-Satz vor der Pause), `voice`/`night` an Szenen.
- Neue Zeichnungen in `components/explainer/scenes2.tsx`: Mail-Szene (Tag/Nacht), Wecker, Jonas, Icons für die Erklär-Karten.
- `stories/gehaltsangebot.audio.json` listet, welche Sätze schon eine Audiodatei haben (wird von `scripts/tts.mjs` geschrieben). Fehlt eine Datei, bleibt der Untertitel in Lesezeit stehen.
- Stand Stimmen: 10 von 37 Sätzen vertont (Gemini). Die restlichen 27 (ca. 1.900 Zeichen) fehlen noch.
- `scripts/tts.mjs` kann ElevenLabs (wenn `ELEVENLABS_API_KEY` in `.env.local` steht und die Stimme in der voice.json eine `elevenlabs`-ID hat), sonst Gemini. Der ElevenLabs-Weg ist noch ungetestet.
- Frau Brandts Mails nennen bei Nachbesserungen jetzt den Aufschlag („Wir legen 1.500 € drauf") statt der Endsumme. So braucht es weniger Sprach-Varianten.

---

## 7. Zweite Situation und Stimmen (2026-10-02)

- Neue Situation **„Die Traumwohnung"** (WG-Zimmer-Betrug), eigene Doku: `docs/situation-02-traumwohnung.md`.
- Startseite `/` ist jetzt eine Auswahl. Die Situationen liegen unter `/gehalt` und `/wohnung`.
- Gemeinsame Bausteine (Abspiel-Steuerung, Untertitel, Entscheidung, Erklär-Karten, Vergleich) liegen in `components/explainer/ui.tsx`. Jede Situation hat ihren eigenen Ablauf (`Explainer.tsx` = Gehalt, `Wohnung.tsx`) und ihre eigenen Zeichnungen.
- Stimmen: komplett **ElevenLabs** (kostenloser Tarif, Modell `eleven_multilingual_v2`). Erzähler = George, Frau Brandt = Sarah, Markus = Charlie. Beide Situationen sind vollständig vertont (37 + 36 Sätze, zusammen ca. 5.200 Zeichen, dazu ca. 650 Zeichen für Hörproben).
- Aufruf: `node scripts/tts.mjs --story traumwohnung` (ohne `--story` ist `gehaltsangebot` gemeint). Das Skript erzeugt nur fehlende Dateien.
- Der kostenlose ElevenLabs-Tarif verlangt einen Hinweis: Auf der Schlusskarte steht „Stimmen: ElevenLabs". Kommerzielle Nutzung ist damit nicht erlaubt.
