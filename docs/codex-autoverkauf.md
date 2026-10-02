# Codex-Situation: Der Käufer ist schon da

Stand: 2. Oktober 2026. Eigene Umsetzung auf `codex/situation`, Route `/codex`.
Arbeitsordner: `Decision-Platform-Codex`, auf Basis von `origin/main` (`9ed3b41`).
Claudes Dateien in `components/explainer/` wurden weder gelesen noch geändert.

## Story

Du verkaufst einen gebrauchten Wagen für 6.800 € VB. Du hoffst auf 6.500 €.
Alex kommt zur Probefahrt, spricht die bald fälligen Reifen an und bietet 5.800 €.
Eine vergleichbare Anzeige hat deutlich mehr Kilometer. Eine weitere Interessentin
meldet sich unverbindlich. Alex muss seine Tochter abholen.

Die kurze gesprochene Einleitung führt direkt in diese Situation. Keine Bedienungsbelehrung.
Der Film pausiert genau dreimal bei „Was sagst du?“:

1. Eigene Zahl nennen, nach den Kosten fragen oder die Inspektion begründen.
2. Autos genauer vergleichen, bei den Reifen entgegenkommen oder Tempo anbieten.
3. Das tatsächliche Angebot akzeptieren, 6.400 € vorschlagen oder auf eine andere Käuferin warten.

Jede Wahl hat einen eigenen gesprochenen Dialog und eine sichtbare Reaktion.
Danach treffen die Wege wieder zusammen. Die ersten beiden Entscheidungen verändern
das spätere Angebot (5.900–6.400 €). Das letzte Gegenangebot kann auch scheitern.
Kein Punktestand und keine allgemein „richtige“ Antwort.

Ergebnis → drei Erklärungen → optionales Beispiel „So hätte es auch laufen können“
(ca. 21 Sekunden, bereits vorhandene Stimmen werden wiederverwendet).
Die Geschichte einschließlich Reveal dauert mit den tatsächlichen Tonspuren
ca. 143–149 Sekunden, ohne Denkpausen.
Alle Beträge und Ausgänge sind erfunden: **ein möglicher Verlauf**, keine Erfolgsgarantie.

## Gestaltung und Bedienung

- Eigene SVG-Zeichnungen: blauer Kleinwagen, zwei Figuren, Parkplatz, Stadt,
  Probefahrt, Reifen, Service-Rechnung, Angebotsvergleich, Handy und Uhr.
- Querformat 16:9, warme Papierfarben, klarer Schnitt zwischen Totalen und Nahaufnahmen.
- GSAP mit `@gsap/react`: Einblendungen, Gesten, Ankunft, Abfahrt und fahrendes Auto.
- Drei Figurenstimmen, zeitlich passende Satz-Untertitel, lokal erzeugte Soundeffekte.
- Start, Pause/Fortsetzen, Ton, nächster Satz und Vollbild. „Weiter“ überspringt
  Sätze; Entscheidungen lassen sich damit nicht überspringen.
- Auf schmalen Handys stehen die Antwortkarten unter dem 16:9-Bild, damit sie lesbar bleiben.
- Tastaturbedienung und Fokus an Entscheidungen/Ergebnissen; beim Verlassen des Tabs pausiert der Film.

## Quellen und Aussagegrenzen

**Studie:** Galinsky, A. D. & Mussweiler, T. (2001), _First offers as anchors:
The role of perspective-taking and negotiator focus_, JPSP 81(4), 657–669.
[Originalabstract bei PubMed](https://pubmed.ncbi.nlm.nih.gov/11642352/),
[Publikationsnachweis bei Columbia](https://business.columbia.edu/faculty/research/first-offers-anchors-role-perspective-taking-and-negotiator-focus).
Drei Experimente zu ersten Angeboten und Verhandlungsergebnissen. Ein Fokus auf
eigene Ziele oder Alternativen kann den untersuchten Vorteil abschwächen.
Die Anzeige in unserer Geschichte hat bereits einen Preis gesetzt; Alex’ späteres
Angebot ist keine identische Versuchssituation. Kein Beleg für unsere Euro-Beträge.
Geprüft: Originalabstract und bibliografische Angaben, nicht der vollständige Versuchstext.

**Buchwissen:** Fisher, Ury & Patton, _Getting to Yes_ (2011).
[Verlagsnachweis](https://www.penguinrandomhouse.com/books/324551/getting-to-yes-by-roger-fisher-and-william-ury/9781101539545/).
Sachliche Maßstäbe und die tatsächliche Alternative zu einer Einigung stammen aus
diesem Praxisrahmen. Grundlage der Umsetzung ist die
[öffentliche Zusammenfassung von Harvard-Ombudsperson Melissa Brodrick](https://www.bumc.bu.edu/facdev-medicine/files/2014/09/Elements-of-Principled-Negotiations.pdf).
Kilometer, Service und Reifen sind unsere konkreten Beispiele; sie bestimmen keinen
wissenschaftlich bewiesenen Marktwert. Ein Inserat ist kein belegter Verkaufspreis.
Eine mögliche weitere Käuferin ist noch kein bestätigtes Angebot.

Die drei Tipps zeigen im Reveal „Studie“ bzw. „Buchwissen“. Quellen und Grenzen
lassen sich dort aufklappen. Forschung und Buchrahmen wurden am 2. Oktober 2026 nachgeschlagen.

## Stimmen und Budget

`node scripts/codex-tts.mjs` zählt nur Zeichen und greift auf keine API zu.
`--voices` listet Stimmen mit deutschem Sprachlabel;
`--voices-all` zeigt zusätzlich die multilingualen Standardstimmen des Kontos.
`--generate` erzeugt ausschließlich fehlende Dateien und prüft vorhandene Text-/Stimmen-Hashes.

Erzeugt: **35 MP3-Dateien, 2.449 Zeichen**. Modell `eleven_multilingual_v2`:
[1 Credit je Zeichen laut ElevenLabs](https://help.elevenlabs.io/hc/en-us/articles/27562116787345-Have-characters-changed).
Erzähler: Daniel; Alex: Eric; Verkäufer: Liam. Alle drei stammen aus der Kontoliste,
sind Standardstimmen und haben dort bestätigte Deutsch-Unterstützung. Gesprochen wird Deutsch.
Ihre ursprünglichen Sprachlabels sind Englisch; sie sind keine deutschen Muttersprachler-Aufnahmen.
Rob und Clemens wurden zunächst gelistet, sind aber Bibliotheksstimmen, die
[im Free-Tier nicht per API nutzbar sind](https://elevenlabs.io/docs/overview/capabilities/voices).
Die eine Anfrage für das Intro mit Rob wurde vor der Erzeugung mit HTTP 402 abgewiesen.

Das Manifest dokumentiert 2.449 erfolgreich erzeugte Zeichen und 2.580 versuchte
Zeichen einschließlich dieser Ablehnung. Auch dieses konservative Gesamtmaß bleibt
unter 3.000. Keine automatische Wiederholung, keine kostenpflichtigen Funktionen,
keine Abos, keine Rechnungsendpunkte. Einmalige Umstellung auf verfügbare Standardstimmen.
Ungeklärte Anfragen werden gesperrt; eine ausdrücklich abgewiesene Anfrage kann
nur mit geändertem Text/Stimme neu versucht werden. Erfolgreiche Dateien werden nie neu erzeugt.
Eine lokale Dateisperre verhindert gleichzeitige Codex-TTS-Läufe.

Die optionale Kontostandsprüfung benötigt `User: Read`; der verwendete eingeschränkte
Key erlaubt diese Prüfung nicht. Deshalb bleibt der lokale Zeichen-Zähler aktiv;
eine ausgeschöpfte Quote beendet den Lauf. Der Nutzer hat den Free-Tier vorgegeben.
Der Key liegt ausschließlich in `.env.local`, die durch die bestehende `.gitignore` ausgeschlossen ist.

Audio und Zeitmarken entstehen in derselben
[TTS-Anfrage mit Zeitmarken](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps/).
Das Browser-Video spielt fertige MP3s und die gespeicherten Untertitel-Zeitmarken ab.
Es enthält keinen API-Key und stellt keine ElevenLabs-Anfragen.
Am Ende und im Footer steht „Stimmen: ElevenLabs“.

## Dateien und Prüfung

- `stories/codex-autoverkauf.json`: Dialog, Varianten, Preisregeln, Quellen.
- `stories/codex-autoverkauf.voices.json`: Stimmen-IDs und Einstellungen, keine Secrets.
- `components/codex/`: Zeichnungen, Filmsteuerung, Preislogik, lokal begrenztes CSS.
- `app/codex/page.tsx`: eigene Seite und Laden vorhandener Audio-Dateien/Zeitmarken.
- `scripts/codex-tts.mjs`: einmalige Vertonung.
- `public/audio/codex/`: 35 fertige MP3s und Manifest.
- `scripts/codex-story.test.mjs`: alle 27 Wege, Enden, genau drei Pausen, Laufzeit,
  vollständige Tonspuren/Zeitmarken, Zeichenbudget und optionales Beispiel.

Tests: `node --experimental-strip-types scripts/codex-story.test.mjs` (Node 22.17).
TypeScript: `npx tsc --noEmit`. Lint auf den eigenen Dateien. Produktion: `npm run build`.

Noch offen: Veröffentlichung auf einem Hosting-Dienst und dein kreatives Feedback.
Keine Datenbank, Anmeldung oder laufenden KI-Aufrufe erforderlich.

Abschlussprüfung: Produktions-Build, TypeScript, Lint auf eigenen Dateien und drei
Story-/Asset-Tests bestanden. Alle 35 MP3s mit FFmpeg erfolgreich dekodiert.
Erneuter TTS-Skriptstart: vorhandene Dateien übersprungen, **0 neue Zeichen**.
Im Browser durchgespielt: B→A→B (Verkauf 6.400 €), C→C→B (Gegenangebot abgelehnt,
letztes Angebot 6.100 €) und A→B→C (Warten, kein Verkauf). Im ersten Durchlauf
liefen die Dialoge automatisch; weitere Durchläufe prüften zusätzlich „Weiter“.
Reveal, Quellen, Beispiel und Vergleich mit eigenem Verlauf geprüft.
Handyansicht bei 390×844: kein horizontaler Überlauf, alle Antwortkarten erreichbar.
Audio-Pause/Fortsetzen geprüft. Vorschau der Produktionsversion: `http://127.0.0.1:3200/codex`.
