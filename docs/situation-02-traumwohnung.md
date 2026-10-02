# Situation 02 – „Die Traumwohnung" (WG-Zimmer-Betrug)

Stand: 2026-10-02 · Kategorie: Alltag & Fremde · Dauer: ca. 2–3 Minuten · Seite: `/wohnung`

## Story

Du suchst seit zwei Monaten ein WG-Zimmer. Dann taucht ein Inserat auf: 18 m², Altbau, Balkon, 420 € warm. Der Vermieter „Markus" antwortet sofort, ist aber „beruflich in Dänemark".

| # | Was passiert | A | B | C |
| --- | --- | --- | --- | --- |
| 1 | Besichtigung geht nicht, der Schlüssel kommt per Post. | „Klingt gut, wie läuft das?" | „Kann mir jemand anderes die Wohnung zeigen?" | „Ohne Besichtigung mache ich nichts." |
| 2 | Drei weitere Interessenten; wer heute 1.260 € Kaution per PayPal an Freunde schickt, bekommt das Zimmer. | „Ich überweise jetzt." (1.260 € weg) | „Ich zahle bei der Schlüsselübergabe." | „Schick mir erst den Mietvertrag." |
| 3 | Markus schickt ein Ausweisfoto und will deinen Ausweis. | „Hier ist mein Ausweis." | „Ich prüfe erst die Fotos und die Adresse." | „Ich breche ab und melde das Inserat." |

Anzeige oben: „An Markus überwiesen" (0 € oder 1.260 €).

Enden: Geld und Daten weg · Geld weg · Daten weg · Heil rausgekommen. Alle als „ein möglicher Verlauf".

Entscheidung 1 verändert nur Markus' Antwort, nicht das Ende. Entscheidend sind Entscheidung 2 (Geld) und 3 (Ausweis).

## Evidence Sheet

| Feld | Inhalt |
| --- | --- |
| Core Claim | Vermieter im Ausland, keine Besichtigung, Schlüssel per Post und Vorkasse sind typische Zeichen für ein Fake-Inserat. |
| Evidence Strength | Offizielle Warnungen (Polizei, Verbraucherzentrale) · Fachbuch (Knappheit) |
| Claim Boundary | Nicht behauptet: dass jeder Vermieter im Ausland ein Betrüger ist. Nicht behauptet: Aussagen zum Käuferschutz einzelner Zahlungsdienste. |
| Ausgangs-Hinweis | Markus, das Inserat, die Beträge und alle Verläufe sind erfunden. |

Quellen (am 2026-10-02 per Websuche geprüft, nur Zusammenfassungen gelesen):

| Aussage | Quelle |
| --- | --- |
| Angebliche Eigentümer im Ausland, keine Besichtigung, Vorkasse, Schlüssel per Post, der nie kommt | Polizei Hamburg, „Betrügerische Wohnungsanzeigen": https://www.polizei.hamburg/betruegerische-wohnungsanzeigen-792186 |
| Warnzeichen bei Fake-Inseraten; Ausweiskopien können für Identitätsmissbrauch genutzt werden | Verbraucherzentrale, „Fake-Wohnungen im Internet": https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/abzocke/fakewohnungen-im-internet-so-erkennen-sie-falsche-immobilienanzeigen-27576 |
| Knappheit und Zeitdruck erhöhen die Bereitschaft, schnell zuzusagen | Robert Cialdini, *Influence* (Fachbuch, nicht nachgeschlagen) |

## Dateien

| Was | Wo |
| --- | --- |
| Story | `stories/traumwohnung.json` |
| Sprechertexte und Stimmen | `stories/traumwohnung.voice.json` |
| Ablauf | `components/explainer/Wohnung.tsx` |
| Zeichnungen (Sofa mit Kartons, Inserat, Chat, Markus-Postkarte, Bildersuche) | `components/explainer/wohnung-art.tsx` |
| Audio | `public/audio/traumwohnung/*.mp3` |
