# Situation 03 – „Das erste Date"

Stand: 2026-10-02 · Kategorie: Dating · Dauer: ca. 2–3 Minuten · Seite: `/date`

## Idee

Drei Wochen geschrieben, jetzt sitzt ihr euch in einer Bar gegenüber. Dein Gehirn sitzt als kleine Figur im Bild und kommentiert in Panik. Oben läuft das „Awkward-Meter" (Start: 50 %).

Beim Dating gibt es kein Richtig oder Falsch: Die Enden sind mögliche Verläufe, kein Urteil.

| # | Was passiert | A | B | C |
| --- | --- | --- | --- | --- |
| 1 | Lena erzählt vom Papagei, dann Stille. | „Krass. Also bei mir im Büro …" (+15) | „Was hat der Papagei gesagt?" (−20) | „Ganz schön kalt geworden, oder?" (+10) |
| 2 | Dein Handy vibriert, Jonas schreibt. | „Sorry, ganz kurz." (+15) | „Das kann warten." (−10) | „Mein Kumpel fragt, ob du in echt auch so cool bist." (−10) |
| 3 | Der Abschied vor der Tür. | „Ich meld mich." (+10) | „Ich würde dich gern wiedersehen." (−20) | „Komm gut nach Hause!" (0) |

Zahlen = Veränderung des Awkward-Meters. In der Story-Datei wird die Stimmung gezählt (100 − Awkward).

Enden: Zweites Date (Awkward bis 25 %) · Mal sehen (bis 55 %) · Die Anekdote (darüber).

## Evidence Sheet

| Feld | Inhalt |
| --- | --- |
| Core Claim | Wer im Gespräch nachfragt, wird eher gemocht. |
| Evidence Strength | Zwei Studien (Nachfragen, Liking Gap) · eine umstrittene Studienlage (Handy) |
| Claim Boundary | Nicht behauptet: dass ein Handy auf dem Tisch allein das Gespräch verschlechtert (Replikationen uneinheitlich). Nicht behauptet: dass es beim Dating richtige und falsche Antworten gibt. |
| Ausgangs-Hinweis | Lena, ihre Reaktionen, die Prozentwerte und alle Enden sind erfunden. |

Quellen (am 2026-10-02 per Websuche geprüft, nur Zusammenfassungen gelesen):

| Aussage | Quelle | Stärke |
| --- | --- | --- |
| Speed-Dater, die mehr Nachfragen stellten, bekamen häufiger ein zweites Date | Huang, Yeomans, Brooks, Minson & Gino (2017), *Journal of Personality and Social Psychology*, 113(3) | Belegt |
| Die bloße Anwesenheit eines Handys kann Nähe und Gesprächsqualität senken | Przybylski & Weinstein (2013); Misra u. a. (2016). Zwei spätere Studien (Allred & Crowley 2017; Crowley u. a. 2018) fanden den Effekt nicht | Gemischt |
| Menschen unterschätzen nach Gesprächen, wie sehr das Gegenüber sie mochte | Boothby, Cooney, Sandstrom & Clark (2018), *Psychological Science*, 29(11) | Belegt |

## Dateien

| Was | Wo |
| --- | --- |
| Story | `stories/erstesdate.json` |
| Sprechertexte und Stimmen | `stories/erstesdate.voice.json` |
| Ablauf | `components/explainer/DateFilm.tsx` |
| Zeichnungen (Bar, Straße, Lena, Gehirn) | `components/explainer/date-art.tsx` |
| Audio | `public/audio/erstesdate/*.mp3` |

Stimmen (ElevenLabs): Erzähler = George, Lena = Lily, Gehirn = Liam.
