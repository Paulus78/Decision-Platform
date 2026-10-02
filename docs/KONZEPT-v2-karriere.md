# Konzept V2: KRONWERK – vom Praktikanten zum CEO

Stand: 2026-10-03 · Status: Konzept, noch nichts gebaut · Arbeitstitel des Spiels: „KRONWERK" (unter der Marke Generalprobe)

Dieses Konzept ersetzt den Katalog aus sechs Einzelfilmen und zieht in das neue Projekt um, sobald es angelegt ist.

---

## 1. Die Idee

**Eine bitterböse Konzern-Satire in kurzen, gezeichneten Videoszenen. Du fängst im Keller der KRONWERK AG als Praktikant an, den niemand für einen Menschen hält, und arbeitest dich Stockwerk für Stockwerk nach oben, bis du dem CEO seinen Stuhl wegnimmst.**

Gewichtung:
- **75 % Unterhaltung:** schwarzer Humor, Übertreibung, ein Gegner zum Hassen, eine Geschichte mit Wendungen.
- **25 % Lernen:** Jede Szene steht auf einer echten Situation aus dem Berufsleben. Am Ende sagt eine Figur in einem Satz, was man daraus mitnimmt.

Vorbilder für den Ton: „Severance" (kalter, absurder Konzern), „Stromberg" und „The Office" (Peinlichkeit, Chefs), „Succession" (Macht, Erbe, Verachtung).

---

## 2. Humor

### Die Regeln

- **Hart und schwarz, aber nach oben.** Gelacht wird über Macht, Gier, Firmensprech und Selbstüberschätzung. Nie über Herkunft, Aussehen, Krankheit oder Schwächere.
- **Tabu:** Witze über Suizid, sexuelle Übergriffe, echte Gewalt, Diskriminierung. Der Konzern darf grausam sein, das Spiel nicht.
- **Ernst gespielt.** Niemand in der Firma findet irgendetwas lustig. Das ist der Witz.
- **Running Gags** ziehen sich durch alle Kapitel.

### Beispiele für den Ton

- Der CEO zur Begrüßung: „Praktikanten sind wie Druckerpatronen. Teuer, schnell leer, und keiner merkt, wenn man sie austauscht."
- Dein Schreibtisch hat noch die Tasse deines Vorgängers. Daneben ein Zettel: „Falls du das liest: Geh nicht ins Archiv." Niemand spricht über ihn.
- Die Personalerin strahlt: „Wir sind hier wie eine Familie. Im Sinne von: Du kommst nicht mehr raus."
- „Mitarbeiter des Monats" ist seit elf Monaten der Hund des CEO.
- Die Kaffeemaschine hat einen eigenen Parkplatz. Du nicht.
- Im Aufzug hängt ein Schild: „Praktikanten bitte Treppe benutzen. Danke für Ihr Verständnis. Ihr Verständnis ist Pflicht."

### Running Gags

| Gag | Wie er sich entwickelt |
|---|---|
| Dein Spitzname | Der CEO gibt ihn dir in Szene 1. Er benutzt ihn bis Kapitel 6. Im Finale nennst du ihn bei seinem. |
| Der verschwundene Vorgänger | Hinweise in jedem Kapitel. Im Vorstand findest du heraus, was mit ihm passiert ist. |
| Die Aufzug-Anzeige | Zeigt in jeder Szene dein Stockwerk. Sie ist die Fortschrittsanzeige des Spiels. |
| Der Hund des CEO | Steigt schneller auf als du. |
| Firmensprech-Plakate | Jedes Stockwerk hat eigene, immer zynischer („Fehler sind Chancen. Für die Konkurrenz."). |

---

## 3. Aufbau: Stockwerke statt Kapitel

Jedes Kapitel spielt auf einem Stockwerk der Firmenzentrale. Je höher, desto heller, teurer und gefährlicher.

| Kapitel | Stockwerk | Position | Gegner im Kapitel | Thema dahinter (Lernanteil) |
|---|---|---|---|---|
| 1 | **Ebene −1:** Keller, Kopierraum, Serverraum | Praktikant | Teamleiter Bernd Sauer | Auffallen, Aufgaben klären, Fehler ansprechen |
| 2 | **Etage 3:** Großraumbüro | Junior | Rivale Fynn Kessler | Ideen verteidigen, erstes Gehaltsgespräch, Grenzen setzen |
| 3 | **Etage 12:** Glasbüros | Teamleitung | Das eigene Team | Führen, schlechte Nachrichten überbringen, Konflikte |
| 4 | **Etage 27:** Bereich | Bereichsleitung | Die anderen Bereichsleiter | Verbündete, Budget, wer ist schuld |
| 5 | **Etage 40:** Vorstand | Vorstand | Der CEO direkt | Macht, Gewissen, schmutzige Deals |
| 6 | **Dach:** Hauptversammlung | Der Stuhl | Der CEO im Endkampf | Alles zusammen |

Jedes Kapitel hat **fünf Szenen und ein Finale** (das Beförderungsgespräch). Zusammen etwa sechs Minuten, spielbar Szene für Szene. Zwischen den Kapiteln fährt der Aufzug ein Stockwerk höher.

---

## 4. Wie die Videos gemacht werden

### Was gleich bleibt wie bei den bisherigen Filmen

- **Gezeichnet im Browser:** Alles ist SVG-Grafik, die React und GSAP (Animations-Bibliothek) in Echtzeit bewegen. Kein Videoschnitt, keine fertige Videodatei. Deshalb kann die Geschichte je nach Antwort anders weiterlaufen.
- **Erzähler, Figurenstimmen, Untertitel:** Stimmen kommen wie bisher vorab erzeugt von ElevenLabs (bzw. Gemini als Ausweich), liegen als MP3 im Projekt und werden Satz für Satz abgespielt. Untertitel laufen mit.
- **Pause mit drei Antworten:** Der Film hält an, „Was machst du?", drei Karten. Danach läuft die passende Fortsetzung.
- **Gemeinsame Bausteine:** ein Szenen-Format (Datei pro Szene), ein Abspieler, ein Test, der alle Wege durchprüft.

### Was neu ist

| Bereich | Bisher | Neu |
|---|---|---|
| **Figuren** | Brustbilder, starr, nur Gesicht bewegt sich | **Ganze Figuren mit Gelenken** (Kopf, Oberkörper, Arme, Hände getrennt). Dadurch echte Gesten: Arme verschränken, Kopf schütteln, mit dem Finger zeigen, schnipsen. |
| **Gesichter** | Vier Stimmungen | **Acht Ausdrücke** (u. a. verächtlich, panisch, falsches Lächeln, Augenrollen) plus Lippenbewegung beim Sprechen |
| **Kamera** | Fest | **Kamerafahrten:** Zoom auf ein Gesicht, Schwenk durch den Raum, harter Schnitt. Technisch: Der sichtbare Ausschnitt der Grafik wird animiert. |
| **Räume** | Flache Hintergründe | **Drei Ebenen:** Vordergrund, Figuren, Hintergrund. Beim Schwenken verschieben sie sich unterschiedlich schnell, das gibt Tiefe. |
| **Licht** | Keins | Neonröhren im Keller, Abendlicht oben, Bildschirmlicht nachts. Einfache Farbflächen über der Szene. |
| **Ton** | Stimmen und Plopp | **Geräusche** (Kopierer, Aufzug-Gong, Tastaturen, Telefon) und **leise Musik** pro Stockwerk. Herkunft noch offen (siehe Fragen). |
| **Format** | Querformat 16:9 | **Empfehlung: Hochformat 9:16** für Handy und für Clips auf TikTok und Instagram. Desktop zeigt das Hochformat mittig mit Rand. |
| **Länge** | 2 bis 3 Minuten | **30 bis 60 Sekunden** pro Szene |

### Ablauf einer Produktion (pro Szene)

1. **Drehbuch** als Szenen-Datei: Einstellungen, Sätze, Antworten, Folgen, Werte.
2. **Stimmen erzeugen** mit dem Skript, Prüfung per Gemini-Abschrift.
3. **Raum** aus dem Baukasten des Stockwerks zusammenstellen (wird pro Stockwerk einmal gezeichnet).
4. **Regie:** Wer steht wo, welche Geste, welcher Ausdruck, wohin fährt die Kamera, wann.
5. **Automatischer Test** aller Wege.
6. **Sichtung im Browser** und Abnahme durch Paul.

### Zeitplan einer Szene (Beispiel, etwa 45 Sekunden)

| Sekunde | Bild | Ton |
|---|---|---|
| 0–4 | Schwarz, dann flackernde Neonröhre. Aufzug-Anzeige „−1". Titel: „Montag, 8:57" | Gong, Brummen der Röhre |
| 4–10 | Kamera fährt durch den Kopierraum zu dir, winzig neben dem Kopierer | Erzähler: Ein Satz zur Lage |
| 10–20 | Teamleiter Sauer kommt ins Bild, zeigt auf dich, Großaufnahme seines Gesichts | Sauer spricht |
| 20–24 | Dein Gehirn ploppt auf | Gehirn: ein panischer Satz |
| 24 | **Pause.** Drei Antworten. | Stille, leises Ticken |
| 25–38 | Die Folge deiner Antwort: Reaktion, Geste, Werte springen | Stimmen, Geräusch |
| 38–45 | Renate Wolf (Mentorin) kommentiert trocken in einem Satz, was man daraus lernt | Renate, dann Gong |

---

## 5. Stil

**Richtung: kalte Konzern-Satire mit warmen Figuren.** Die Firma ist sauber, grau und unmenschlich. Die Figuren sind farbig, übertrieben und lebendig. Dieser Kontrast trägt den Humor.

- **Linien:** kräftige dunkle Umrisslinien (statt der bisherigen randlosen Flächen). Das wirkt erwachsener und eher wie moderne Zeichentrickserien.
- **Schatten:** eine Schattenfarbe pro Fläche, hart abgesetzt.
- **Proportionen:** etwa vier Kopfhöhen. Große Köpfe für Ausdruck, aber keine Kindchen-Optik.
- **Formsprache:** Jede Figur hat eine Grundform, an der man sie sofort erkennt (siehe Figuren).
- **Farbe:** Firma in Betongrau, Bürogrün, Neonweiß. Jedes Stockwerk bekommt eine eigene Akzentfarbe, die nach oben hin edler wird (Keller: Giftgrün, Vorstand: Gold).
- **Oberfläche:** dunkel, schmale Grotesk-Schrift, Antwortkarten wie Akten- oder Ausweiskarten. Eher Handyspiel als Lernplattform.
- **Leichte Körnung** über dem Bild, damit es nicht steril wirkt.

Weil die Zeichnungen von Hand in Code entstehen, ist die Qualität meine größte Unsicherheit. Deshalb kommen **vor** dem Bauen Stil-Entwürfe und ein Figuren-Blatt zur Abnahme.

---

## 6. Die Figuren

| Figur | Rolle | Aussehen und Grundform | Charakter | Typischer Satz | Stimme (Vorschlag) |
|---|---|---|---|---|---|
| **Du** | Spielfigur | Klein, rund, Kapuzenpulli zu groß, Ausweis am Schlüsselband, Rucksack. Wird mit jedem Stockwerk größer und schärfer geschnitten. | Ehrgeizig, unterschätzt, manchmal zu ehrlich | (spricht nur in Sprechblasen) | keine |
| **Maximilian Kron, CEO** | Erzfeind | Sehr groß, schmal, spitzes Kinn, Rollkragen unter Sakko, Sonnenbrille drinnen, goldene Uhr, immer ein grüner Smoothie. Grundform: langes, spitzes Dreieck. | Hat die Firma von seinem Vater geerbt und hält sich für einen Visionär. Merkt sich keine Namen, schaut niemanden an, schnipst statt zu reden. | „Ich habe diese Firma mit meinen eigenen Händen geerbt." | arrogant, gedehnt, gelangweilt |
| **Bernd Sauer** | Teamleiter in Kapitel 1 | Rundlich, Halbglatze, Kaffeefleck auf der Krawatte, Schweißflecken. Grundform: hängendes Rechteck. | Seit 22 Jahren Teamleiter, ausgebrannt, gibt jeden Druck nach unten weiter | „Wir sind hier nicht bei Wünsch-dir-was." | müde, genervt |
| **Fynn Kessler** | Rivale | Perfekte Zähne, Weste, Haare mit Gel, filmt alles fürs Netz. Grundform: glattes Oval. | Schleimt nach oben, tritt nach unten, klaut Ideen und bedankt sich öffentlich dafür | „Ich bin so dankbar für diese Chance. Hashtag Demut." | zu freundlich |
| **Renate Wolf** | Mentorin | 61, Strickjacke, Brille an Kette, strickt in jedem Meeting. Grundform: stabiles Quadrat. | Seit 1989 Vorstandssekretärin, weiß, wo alle Leichen liegen. Trocken, schwarzhumorig, auf deiner Seite, wenn du es verdienst. **Sie spricht den Lernsatz.** | „Kind. Fehler vom Chef sagt man unter vier Augen. Oder gar nicht. Oder in seiner Abschiedsrede." | ruhig, knapp |
| **Chantal** | Personal („People & Culture") | Strahlendes Lächeln, Blazer in Pastell, Klemmbrett. | Zwanghaft positiv, verkündet Kündigungen mit Emojis | „Wir sind hier wie eine Familie!" | hoch, übermotiviert |
| **Dein Gehirn** | Kommentator | Neu gezeichnet: neonpink, nervös zuckend, schwebt über dir | Panisch, sarkastisch, ehrlich | „Lauf. Nein, warte. Lauf trotzdem." | wie bisher (Liam) |
| **Jonas** | Bester Freund, nur per Chat | Profilbild, Nachrichten auf dem Handy | Gibt schlechte Ratschläge mit voller Überzeugung | „Sag einfach, du hast ein Angebot von Google. Klappt immer." | nur Text |
| **Der Hund** | Running Gag | Windhund mit Firmenausweis | Steigt schneller auf als du | (bellt) | Geräusch |

Stimmen werden vor der Vertonung per Hörprobe ausgewählt, wie bei den alten Filmen.

---

## 7. Kapitel 1 im Detail: „Ebene −1"

**Ziel des Kapitels:** genug Ansehen, um aus dem Keller zu kommen. **Finale:** Sauer muss entscheiden, ob du bleibst.

| Szene | Was passiert | Die drei Antworten (klug · naheliegend · verrückt) | Renates Satz am Ende (Lernanteil) |
|---|---|---|---|
| **1. Der Name** | Kron fährt im Aufzug an dir vorbei, die Tür geht wieder auf. „Was ist das?" Er gibt dir deinen Spitznamen. | Dich vorstellen · nichts sagen · ihm die Hand hinhalten (er desinfiziert sie danach demonstrativ) | „Er wird sich deinen Namen nie merken. Sorg dafür, dass sich jemand anderes ihn merkt." (Erfahrungswissen) |
| **2. Die Aufgabe** | Sauer: „Machen Sie das mit den Ordnern." Mehr sagt er nicht. Es gibt 4.000 Ordner. | Nachfragen, was genau und bis wann · einfach anfangen · alles in den Reißwolf („Ist doch digital, oder?") | „Wer nicht fragt, sortiert bis Weihnachten." (Erfahrungswissen) |
| **3. Der Fehler** | In fünf Minuten präsentiert Sauer vor dem Vorstand. Auf Folie 3 ist ein Rechenfehler, der die Firma Millionen kosten würde. | Ihm leise sagen · im Meeting vor allen korrigieren · die Folie heimlich austauschen und gegen Kron lenken | „Fehler vom Chef sagt man unter vier Augen." (Erfahrungswissen, Bezug: Forschung zu „Voice" am Arbeitsplatz, vor dem Schreiben zu prüfen) |
| **4. Fynn** | Der neue Trainee Fynn stellt sich vor und filmt dabei. Am nächsten Tag steht dein Ordner-System auf seinem Profil, mit dem Satz „Stolz auf mein Projekt". | Ihn direkt und ruhig ansprechen · nichts tun · öffentlich kommentieren: „Schön, dass dir meine Arbeit gefällt" | „Wer nie sagt, was er gemacht hat, wird für nichts davon erinnert." (Erfahrungswissen) |
| **5. 19:58 Uhr** | Sauer will Folien „bis morgen, bunt". Du hast seit 6 Uhr nichts gegessen. Kron geht gerade mit seinem Hund in den Feierabend. | Klare Grenze mit Angebot („bis 21 Uhr") · ja sagen · den Hund als Assistenten eintragen | „Ein Nein mit Angebot ist besser als ein Ja mit Hass." (Erfahrungswissen) |
| **Finale: Die Entscheidung** | Sauer und Chantal entscheiden, ob du bleibst. Chantal hat Emojis vorbereitet, für beide Fälle. | hängt von deinen Werten ab. Bei genug Ansehen: Aufzug nach Etage 3. Sonst: „Probezeit verlängert", eine Wiederholungsszene. | Kurze Übersicht der fünf Sätze, aufklappbar mit Quellen |

Die Sätze sind Entwürfe. Vor dem Vertonen wird jeder einzeln geprüft und gekennzeichnet. Was keine Quelle hat, bleibt „Erfahrungswissen".

---

## 8. Spielwerte

| Wert | Bedeutung | Bei null |
|---|---|---|
| **Ansehen** | Was die Chefs von dir halten. Entscheidet über die Beförderung. | Versetzung ins Archiv, zu den Ordnern deines Vorgängers |
| **Verbündete** | Was die Kollegen von dir halten. Ab Kapitel 4 entscheidend (Abstimmungen, Hilfe im Finale). | Niemand sagt dir, dass Feierabend ist |
| **Nerven** | Was du noch aushältst | Du schläfst auf dem Kopierer ein. Er läuft. |

- Die Werte wandern von Kapitel zu Kapitel mit.
- Die verrückte Antwort kostet meist Ansehen, bringt aber Verbündete und eine **Bürolegende** zum Sammeln.
- Fällt ein Wert auf null: kurze, böse Schluss-Szene, dann Neustart der Szene (nicht des Kapitels).

---

## 9. Lernen (25 %)

- **Ein Satz pro Szene**, gesprochen von Renate, mit kleinem Schild: Studie, Fachbuch oder Erfahrungswissen.
- **Kapitel-Ende:** die fünf Sätze als Übersicht, aufklappbar mit Quelle.
- **Kein Rückblick im Film**, keine Lernkarten, kein Erzähler, der erklärt.
- Die kluge Antwort ist nicht immer die, die am meisten Punkte bringt. Manchmal gewinnt die gemeine. Renate sagt dann, warum das langfristig teuer wird.

---

## 10. Warum man wiederkommt

- **Das nächste Stockwerk:** neue Räume, neues Outfit, neue Gegner.
- **Die Geschichte:** Was ist mit dem Vorgänger passiert? Wann fliegt Fynn auf? Wie stürzt man Kron?
- **Nachwirkende Entscheidungen:** Wer Fynn in Kapitel 1 bloßstellt, hat ihn in Kapitel 4 als Feind.
- **Sammeln:** Bürolegenden, verschiedene Enden pro Kapitel.
- **Teilen:** Visitenkarte mit Spitzname, Position, Stockwerk. Kurze Szenen-Clips im Hochformat für soziale Netzwerke.

---

## 11. Geld (später)

Noch nicht im Prototyp. Mögliche Modelle:
- Kapitel 1 und 2 kostenlos, der Rest als einmaliger Kauf.
- Bezahlte „Ernstfall-Vorbereitung" zu einzelnen Themen (Gehaltsgespräch, erstes Führungsgespräch).
- Spätere Erweiterungen mit anderen Firmen (Start-up, Krankenhaus, Politik).

Vorher zu klären: kommerzielle Rechte an den Stimmen, Impressum, Gewerbe, Zahlungsanbieter.

---

## 12. Technik und Kosten

- **Neues Projekt:** eigener Ordner, eigenes GitHub-Repository, Next.js wie bisher.
- **Übernommen:** Stimmen-Skripte, `.env.local`, Abspieler-Prinzip, Wege-Test, Lektionen aus dem alten Stil-Leitfaden.
- **Neu zu bauen:** Figuren mit Gelenken und acht Ausdrücken, Kamera, Räume in drei Ebenen, Geräusche und Musik, Spielwerte über Kapitel, Spielstand im Browser.
- **Stimmen:** etwa 500 Zeichen pro Szene, rund 3.500 pro Kapitel. Das kostenlose ElevenLabs-Kontingent (10.000 Zeichen im Monat) reicht für zwei bis drei Kapitel im Monat und erlaubt keine kommerzielle Nutzung.
- **Kosten** bleiben in der Prototyp-Phase bei null.

---

## 13. Fahrplan

| Schritt | Was | Abnahme |
|---|---|---|
| 0 | Neues Projekt und Repository | Paul legt das Repository an |
| 1 | **Stil-Entwürfe:** Szene 3 („Der Fehler") als Standbild in drei Varianten des Stils aus Abschnitt 5 | Paul wählt |
| 2 | **Figuren-Blatt:** Du, Kron, Sauer, Renate, Fynn, Chantal, Gehirn, je mit Ausdrücken und zwei Gesten | Paul gibt frei |
| 3 | **Eine Testszene** komplett mit Kamera, Stimmen, Geräuschen | Paul gibt frei: Fühlt sich das an wie gewollt? |
| 4 | **Drehbuch Kapitel 1** ausformuliert | Paul gibt frei |
| 5 | Kapitel 1 bauen | |
| 6 | Test mit drei bis fünf Leuten | Lachen sie? Spielen sie weiter? |
| 7 | Kapitel 2 und folgende, Startseite, Rechtliches | |

---

## 14. Offene Fragen

**Projekt**
1. Wie soll der neue Ordner heißen? Legst du das GitHub-Repository an, oder darf ich es über deinen GitHub-Zugang erstellen?
2. Arbeitet Codex wieder mit, nur zum Prüfen?
3. Name: „KRONWERK" als Spieltitel unter der Marke Generalprobe, oder ein anderer?

**Format und Stil**
4. **Hochformat 9:16** (meine Empfehlung) oder Querformat wie bisher?
5. Gibt es eine Serie, ein Spiel oder eine App, deren Look du dir vorstellst? Name oder Screenshot reicht.
6. Darf ich ein KI-Bildmodell nur für **Entwürfe** der Figuren nutzen (als Vorlage, nicht im Spiel)? Ob das kostenlos geht, prüfe ich vorher.
7. Musik und Geräusche: aus freien Sammlungen mit passender Lizenz, selbst im Browser erzeugt, oder vorerst ohne Musik?

**Figuren und Welt**
8. Passen die Namen (Maximilian Kron, Bernd Sauer, Fynn Kessler, Renate Wolf, Chantal)?
9. Feste Spielfigur, oder Auswahl aus zwei bis drei Aussehen?
10. Bleiben Gehirn und Jonas als Nebenfiguren?

**Humor**
11. Passt die Härte der Beispiele in Abschnitt 2, oder soll es noch böser oder etwas milder werden?
12. Einverstanden mit den Tabus (kein Suizid, keine sexuellen Übergriffe, keine Diskriminierung)?

**Spiel**
13. Drei Werte wie beschrieben, oder einfacher?
14. Zeitdruck bei den Antworten: ja oder nein?
15. Was soll passieren, wenn man ein Kapitel nicht schafft: Wiederholungsszene (Vorschlag) oder Kapitel neu?

**Inhalt und Geld**
16. Sollen die sechs alten Filme irgendwo weiterleben, oder bleiben sie im alten Projekt?
17. Ab wann soll Geld eine Rolle spielen?
18. Bezahlter Stimmen-Tarif, sobald es öffentlich wird?
