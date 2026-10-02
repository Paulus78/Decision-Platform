# Situation 04 – „500 € für Leon"

Stand: 2026-10-02 · Kategorie: Freunde & Familie · Dauer: ca. 2 Minuten · Seite: `/leon`

## Idee

Leon, dein Freund seit der siebten Klasse, will 500 € leihen: „Kriegst du nächste Woche zurück, safe." Drei Wochen später postet er Festival-Fotos.

Oben laufen zwei Anzeigen: „Leon schuldet dir" und „Freundschaft" (Start: 80 %). Dein Gehirn kommentiert wie im Date-Video. Leon schreibt nur im Chat und hat keine Stimme.

| # | Was passiert | A | B | C |
| --- | --- | --- | --- | --- |
| 1 | Leon fragt nach 500 €. | „Klar, schick ich dir." (500 €, Freundschaft +5) | „Wofür brauchst du es, und bis wann genau?" (500 €, Datum ausgemacht) | „Ich kann dir 200 leihen." (200 €, −5) |
| 2 | Kein Geld, aber Festival-Story. | Nichts schreiben (−10) | „Hey, wie sieht's mit dem Geld aus?" (0) | „Schönes Festival. Von meinem Geld?" (−25) |
| 3 | „Kann dir gerade nur 100 geben. Brauchst du es echt so dringend?" | „Passt schon, vergiss es." (Geld weg, +5) | „100 jetzt, der Rest in Raten. Deal?" (+10) | „Ich will alles bis Freitag." (−25, mit ausgemachtem Datum nur −10) |

Enden: Geld weg, Freund noch da (verziehen) · Geld zurück, Freund behalten (Freundschaft ab 50 %) · Geld zurück, Funkstille.

## Evidence Sheet

| Feld | Inhalt |
| --- | --- |
| Core Claim | Wer Geld leiht und wer es schuldet, erinnert sich unterschiedlich an denselben Kredit; verspätete Rückzahlung belastet die Beziehung. |
| Evidence Strength | Eine Befragungsstudie (971 Personen) · der Rest ist Erfahrungswissen |
| Claim Boundary | Nicht belegt: dass ein festes Datum oder Ratenzahlung die Freundschaft schützt. Diese Karten sind als „Erfahrungswissen" bzw. „Teils belegt" markiert. |
| Ausgangs-Hinweis | Leon, die Prozentwerte und alle Enden sind erfunden. |

Quelle (am 2026-10-02 per Websuche geprüft, nur Zusammenfassung gelesen): Dezső & Loewenstein (2012), „Lenders' blind trust and borrowers' blind spots", *Journal of Economic Psychology*, 33(5), 996–1011. https://ideas.repec.org/a/eee/joepsy/v33y2012i5p996-1011.html

## Stimmen

ElevenLabs war aufgebraucht (Monatslimit 10.000 Zeichen). Diese Situation nutzt deshalb **Gemini TTS** (Erzähler „Puck", Gehirn „Fenrir"), also andere Stimmen als die ersten drei Videos.

Erzeugt mit `node scripts/tts-bundle.mjs --story leon --model gemini-3.8-flash-lite-tts`: mehrere Sätze pro Anfrage, danach per ffmpeg an den längsten Pausen geschnitten. Die Schnitte wurden per Gemini-Transkription geprüft; ein abgeschnittener Satz wurde einzeln neu erzeugt.

## Dateien

| Was | Wo |
| --- | --- |
| Story | `stories/leon.json` |
| Sprechertexte | `stories/leon.voice.json` |
| Ablauf | `components/explainer/LeonFilm.tsx` |
| Zeichnungen (Chat, Leon, Story-Karte) | `components/explainer/leon-art.tsx` |
| Audio | `public/audio/leon/*.mp3` |
