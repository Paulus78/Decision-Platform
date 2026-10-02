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
- **Tabu:** Witze über Suizid, echte Gewalt, Diskriminierung. Der Konzern darf grausam sein, das Spiel nicht.
- **Anzügliche Situationen** (z. B. die Personalchefin, siehe Abschnitt 7) sind erlaubt, wenn drei Dinge gelten: Die Person mit der Macht ist die Lachnummer, nicht du. Nichts wird explizit. Und Mitmachen wird nie einfach belohnt, sondern hat Folgen.
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

### Hauptfiguren

| # | Figur | Rolle | Aussehen und Grundform | Charakter | Typischer Satz | Kapitel |
|---|---|---|---|---|---|---|
| 1 | **Du** | Spielfigur | Klein, rund, Kapuzenpulli zu groß, Ausweis am Schlüsselband. Wird mit jedem Stockwerk größer und schärfer geschnitten. | Ehrgeizig, unterschätzt, manchmal zu ehrlich | (nur Sprechblasen) | alle |
| 2 | **Maximilian Kron** | CEO, Erzfeind | Sehr groß, schmal, spitzes Kinn, Rollkragen, Sonnenbrille drinnen, goldene Uhr, grüner Smoothie. Grundform: spitzes Dreieck. | Hat die Firma geerbt, hält sich für einen Visionär, merkt sich keine Namen, schnipst statt zu reden | „Ich habe diese Firma mit meinen eigenen Händen geerbt." | alle |
| 3 | **Bernd Sauer** | Teamleiter | Rundlich, Halbglatze, Kaffeefleck auf der Krawatte. Grundform: hängendes Rechteck. | Seit 22 Jahren Teamleiter, ausgebrannt, gibt jeden Druck nach unten weiter. Später überraschend auf deiner Seite. | „Wir sind hier nicht bei Wünsch-dir-was." | 1–3 |
| 4 | **Fynn Kessler** | Rivale | Perfekte Zähne, Weste, Gel-Haare, Handy immer auf Aufnahme. Grundform: glattes Oval. | Schleimt nach oben, klaut Ideen, bedankt sich öffentlich dafür | „Ich bin so dankbar für diese Chance. Hashtag Demut." | 1–5 |
| 5 | **Renate Wolf** | Mentorin | 61, Strickjacke, Brille an Kette, strickt in jedem Meeting. Grundform: Quadrat. | Seit 1989 Vorstandssekretärin, kennt alle Leichen im Keller, spricht den Lernsatz | „Kind. Fehler vom Chef sagt man unter vier Augen. Oder in seiner Abschiedsrede." | alle |
| 6 | **Gisela Hartmann** | Personalchefin | Mitte 50, Löwenmähne, Leopardenschal, zu viel Parfüm, klimpernde Armreifen | Steht auf dich, zeigt es denkbar ungeschickt. Hat die Macht über alle Verträge und nutzt sie für ihr Liebesleben. | „Sie erinnern mich an meinen zweiten Mann. Bevor er gegangen ist." | 1–5 |
| 7 | **Lea Brück** | Mit-Praktikantin, Freundin | Kurze Haare, Doc Martens, Thermoskanne | Klüger als alle, aber zu ehrlich für die Firma. Ab Kapitel 3 in deinem Team: Freundin oder Untergebene? | „Ich hab nachgerechnet. Wir verdienen weniger als der Hund." | 1–6 |
| 8 | **Mo Schwarz** | IT-Admin | Kapuze, Energydrink, wohnt praktisch im Serverraum | Paranoid, sieht in den Protokollen alles, hilft nur, wer ihm Pizza bringt. Kann Mails verschwinden lassen. | „Ich lösche nichts. Ich verlege Dinge in die Vergangenheit." | 1–6 |
| 9 | **Viktoria Lang** | Finanzvorständin | Strenger Dutt, schwarzer Hosenanzug, lächelt nie | Eiskalt, will selbst CEO werden. Mal Verbündete, mal Falle. | „Gefühle sind ein Kostenfaktor." | 4–6 |
| 10 | **Hildegard Kron** | Aufsichtsratschefin, Krons Mutter | 82, Perlenkette, Gehstock mit Goldknauf | Die eigentliche Macht. Hält ihren Sohn für eine Enttäuschung. Entscheidet am Ende mit. | „Maximilian, setz dich. Nicht dahin. Auf den Boden." | 5–6 |

### Feste Nebenfiguren

| Figur | Rolle |
|---|---|
| **Dein Gehirn** | Kommentator, neonpink, panisch und sarkastisch |
| **Jonas** | Bester Freund, nur per Chat, schlechte Ratschläge mit voller Überzeugung |
| **Chantal** | „People & Culture", Giselas Assistentin, verkündet Kündigungen mit Emojis |

### Randfiguren (für alle Kapitel)

| Figur | Running Gag |
|---|---|
| **Dividende**, der Windhund des CEO | Hat einen Firmenausweis und steigt schneller auf als du |
| **Günther**, Hausmeister | Repariert seit 2011 dieselbe Neonröhre. Weiß, welche Türen nicht abgeschlossen sind. |
| **Elke**, Kantine | Das Gerüchte-Barometer: Wie groß deine Portion ist, verrät, was das Haus über dich denkt |
| **Herr Pohl**, Betriebsrat | Immer im Urlaub. Taucht nur auf, wenn alles vorbei ist. |
| **Tim und Tom**, Unternehmensberater | Zwillinge im gleichen Anzug, sagen „Synergien" und streichen dabei Stellen |
| **Dirk**, Sicherheitsdienst | Lässt dich jeden Morgen nicht rein. Kennt dich trotzdem seit Monaten. |
| **Sebastian**, Krons persönlicher Assistent | Trägt den Smoothie, den Hund und alle Schuld |
| **Patrick**, dein verschwundener Vorgänger | Nur Spuren: Tasse, Zettel, eine Kündigung ohne Unterschrift. Taucht in Kapitel 5 auf. |
| **Kai-Uwe**, Motivations-Coach | Hält zu jedem Anlass eine Rede über Löwen und Gazellen |

Stimmen werden vor der Vertonung per Hörprobe ausgewählt, wie bei den alten Filmen.

---

## 7. Wendungen und verrückte Situationen

Kein Kapitel läuft geradeaus. In jedem gibt es mindestens **eine Wendung, die alles umwirft**, und Ereignisse, die mal gegen dich, mal überraschend für dich laufen.

### Die große Geschichte

| Kapitel | Wendung |
|---|---|
| 1 | Nach der „Allen antworten"-Katastrophe lässt Mo die Mail verschwinden. Ab jetzt schuldest du der IT eine Pizza pro Woche. **(gut)** |
| 2 | Fynn präsentiert deine Idee als seine. Die Idee floppt vor dem Vorstand, und Fynn bekommt die ganze Schuld. **(gut, aber du darfst nichts sagen)** |
| 3 | **Das unmoralische Angebot** (siehe unten). Außerdem wird Lea deine Mitarbeiterin, und Tim und Tom wollen dein Team halbieren. |
| 4 | Viktoria Lang bietet dir ein Bündnis gegen Kron an. Gleichzeitig wird Fynn plötzlich nett. Einer von beiden lügt. |
| 5 | Du findest Patrick, deinen Vorgänger. Er hatte Krons Bilanztricks entdeckt und wurde „befördert": Leiter der Niederlassung Helgoland, allein. Renate verrät, dass sie seit 1989 Ordner über alles führt. |
| 6 | Bei der Hauptversammlung stimmt Hildegard Kron gegen ihren eigenen Sohn, wenn du sie vorher gewonnen hast. Und am Ende kommt die Frage, ob du ein besserer CEO wirst oder nur ein neuer Kron. |

### Das unmoralische Angebot (Kapitel 3)

Gisela Hartmann flirtet seit Kapitel 1 denkbar ungeschickt: Komplimente über deine Krawatte, Kekse nur für dich, „zufällige" Treffen am Kopierer. In Kapitel 3 bittet sie dich in ihr Büro, Kerzen auf dem Schreibtisch.

> „Die Teamleiter-Stelle. Sie wäre Ihre. Ich bräuchte nur eine Kleinigkeit: Ein Wochenende in meinem Ferienhaus auf Sylt. Nur wir zwei. Und die Möwen."

| Antwort | Folge |
|---|---|
| **Klar Nein sagen** und das Gespräch danach schriftlich festhalten | Gisela ist beleidigt und macht dir das Leben schwer. Aber Renate hat ab jetzt einen Ordner mehr, und der wird in Kapitel 5 Gold wert. |
| **Ausweichen** („Ich bin allergisch gegen Möwen") | Gisela hält das für ein Vielleicht. Das Problem kommt zurück, größer. |
| **Zusagen** | Wendung: Auf Sylt wartet nicht Gisela allein, sondern ihr Ex-Mann. Sie wollte ihn eifersüchtig machen, du bist nur die Requisite. Die Beförderung gibt es nie, dafür ein Foto, mit dem sie dich erpressen kann. |

Renates Satz danach: „Wer mit Beförderung lockt, will nicht dich, sondern Macht über dich. Schreib alles auf." Lernbezug: Machtmissbrauch am Arbeitsplatz erkennen und dokumentieren.

### Weitere verrückte Situationen

- **Teambuilding im Hochseilgarten:** Kron hängt fest. Du entscheidest, ob du ihn rettest, filmst oder den Betriebsrat rufst (der im Urlaub ist).
- **Die Weihnachtsfeier:** Chantal hat ein Wichteln organisiert. Du hast Kron gezogen.
- **Der Hund ist weg.** Kron macht dich verantwortlich. Dividende sitzt im Vorstandssessel.
- **Kai-Uwe** lässt alle über glühende Kohlen laufen. Fynn läuft zweimal, für die Kamera.
- **Der Stromausfall:** Zwei Stunden im Dunkeln mit Viktoria Lang im Aufzug. Sie erzählt dir zum ersten Mal etwas Persönliches.

### Zufallsereignisse (in jedem Kapitel möglich)

Zwischen den festen Szenen kann eins davon auftauchen. Dadurch spielt sich jede Runde etwas anders.

| Ereignis | Wirkung |
|---|---|
| **Feueralarm** | Alle stehen auf dem Parkplatz, auch Kron. Zehn Minuten, um mit ihm zu reden. |
| **Elke gibt dir eine doppelte Portion** | Im Haus wird gut über dich geredet. Verbündete steigen. |
| **Krons LinkedIn-Post** über „Demut" | Du kannst ihn liken, kommentieren oder ignorieren. Alle drei haben Folgen. |
| **Mo hat etwas gesehen** | Ein Geheimnis aus den Protokollen, wenn du ihm noch Pizza schuldest, nicht. |
| **Dividende mag dich** | Der Hund folgt dir einen Tag lang. Kron bemerkt dich zum ersten Mal. |
| **Herr Pohl ist zurück** | Für genau eine Szene. Danach wieder Urlaub. |
| **Tim und Tom zählen Stellen** | Eine falsche Antwort, und deine steht auf der Liste. |

---

## 8. Kapitel 1 im Detail: „Ebene −1"

**Ziel des Kapitels:** genug Ansehen, um aus dem Keller zu kommen. **Finale:** Sauer muss entscheiden, ob du bleibst.

**Wendung des Kapitels:** Nach Szene 3 schickst du aus Versehen eine Lästermail über Kron an alle 4.000 Mitarbeitenden. Mo aus der IT lässt sie verschwinden, bevor Kron sie liest. Von da an hast du einen Verbündeten im Serverraum und eine Pizza-Schuld. Gisela schaut beim Kopierer zum ersten Mal „zufällig" vorbei.

| Szene | Was passiert | Die drei Antworten (klug · naheliegend · verrückt) | Renates Satz am Ende (Lernanteil) |
|---|---|---|---|
| **1. Der Name** | Kron fährt im Aufzug an dir vorbei, die Tür geht wieder auf. „Was ist das?" Er gibt dir deinen Spitznamen. | Dich vorstellen · nichts sagen · ihm die Hand hinhalten (er desinfiziert sie danach demonstrativ) | „Er wird sich deinen Namen nie merken. Sorg dafür, dass sich jemand anderes ihn merkt." (Erfahrungswissen) |
| **2. Die Aufgabe** | Sauer: „Machen Sie das mit den Ordnern." Mehr sagt er nicht. Es gibt 4.000 Ordner. | Nachfragen, was genau und bis wann · einfach anfangen · alles in den Reißwolf („Ist doch digital, oder?") | „Wer nicht fragt, sortiert bis Weihnachten." (Erfahrungswissen) |
| **3. Der Fehler** | In fünf Minuten präsentiert Sauer vor dem Vorstand. Auf Folie 3 ist ein Rechenfehler, der die Firma Millionen kosten würde. | Ihm leise sagen · im Meeting vor allen korrigieren · die Folie heimlich austauschen und gegen Kron lenken | „Fehler vom Chef sagt man unter vier Augen." (Erfahrungswissen, Bezug: Forschung zu „Voice" am Arbeitsplatz, vor dem Schreiben zu prüfen) |
| **4. Fynn** | Der neue Trainee Fynn stellt sich vor und filmt dabei. Am nächsten Tag steht dein Ordner-System auf seinem Profil, mit dem Satz „Stolz auf mein Projekt". | Ihn direkt und ruhig ansprechen · nichts tun · öffentlich kommentieren: „Schön, dass dir meine Arbeit gefällt" | „Wer nie sagt, was er gemacht hat, wird für nichts davon erinnert." (Erfahrungswissen) |
| **Zufall** | Eines der Zufallsereignisse aus Abschnitt 7, z. B. Feueralarm mit Kron auf dem Parkplatz | je nach Ereignis | |
| **5. 19:58 Uhr** | Sauer will Folien „bis morgen, bunt". Du hast seit 6 Uhr nichts gegessen. Kron geht gerade mit seinem Hund in den Feierabend. | Klare Grenze mit Angebot („bis 21 Uhr") · ja sagen · den Hund als Assistenten eintragen | „Ein Nein mit Angebot ist besser als ein Ja mit Hass." (Erfahrungswissen) |
| **Finale: Die Entscheidung** | Sauer und Chantal entscheiden, ob du bleibst. Chantal hat Emojis vorbereitet, für beide Fälle. | hängt von deinen Werten ab. Bei genug Ansehen: Aufzug nach Etage 3. Sonst: „Probezeit verlängert", eine Wiederholungsszene. | Kurze Übersicht der fünf Sätze, aufklappbar mit Quellen |

Die Sätze sind Entwürfe. Vor dem Vertonen wird jeder einzeln geprüft und gekennzeichnet. Was keine Quelle hat, bleibt „Erfahrungswissen".

---

## 9. Spielwerte

| Wert | Bedeutung | Bei null |
|---|---|---|
| **Ansehen** | Was die Chefs von dir halten. Entscheidet über die Beförderung. | Versetzung ins Archiv, zu den Ordnern deines Vorgängers |
| **Verbündete** | Was die Kollegen von dir halten. Ab Kapitel 4 entscheidend (Abstimmungen, Hilfe im Finale). | Niemand sagt dir, dass Feierabend ist |
| **Nerven** | Was du noch aushältst | Du schläfst auf dem Kopierer ein. Er läuft. |

- Die Werte wandern von Kapitel zu Kapitel mit.
- Die verrückte Antwort kostet meist Ansehen, bringt aber Verbündete und eine **Bürolegende** zum Sammeln.
- Fällt ein Wert auf null: kurze, böse Schluss-Szene, dann Neustart der Szene (nicht des Kapitels).

---

## 10. Lernen (25 %)

- **Ein Satz pro Szene**, gesprochen von Renate, mit kleinem Schild: Studie, Fachbuch oder Erfahrungswissen.
- **Kapitel-Ende:** die fünf Sätze als Übersicht, aufklappbar mit Quelle.
- **Kein Rückblick im Film**, keine Lernkarten, kein Erzähler, der erklärt.
- Die kluge Antwort ist nicht immer die, die am meisten Punkte bringt. Manchmal gewinnt die gemeine. Renate sagt dann, warum das langfristig teuer wird.

---

## 11. Warum man wiederkommt

- **Das nächste Stockwerk:** neue Räume, neues Outfit, neue Gegner.
- **Die Geschichte:** Was ist mit dem Vorgänger passiert? Wann fliegt Fynn auf? Wie stürzt man Kron?
- **Nachwirkende Entscheidungen:** Wer Fynn in Kapitel 1 bloßstellt, hat ihn in Kapitel 4 als Feind.
- **Sammeln:** Bürolegenden, verschiedene Enden pro Kapitel.
- **Teilen:** Visitenkarte mit Spitzname, Position, Stockwerk. Kurze Szenen-Clips im Hochformat für soziale Netzwerke.

---

## 12. Geld (später)

Noch nicht im Prototyp. Mögliche Modelle:
- Kapitel 1 und 2 kostenlos, der Rest als einmaliger Kauf.
- Bezahlte „Ernstfall-Vorbereitung" zu einzelnen Themen (Gehaltsgespräch, erstes Führungsgespräch).
- Spätere Erweiterungen mit anderen Firmen (Start-up, Krankenhaus, Politik).

Vorher zu klären: kommerzielle Rechte an den Stimmen, Impressum, Gewerbe, Zahlungsanbieter.

---

## 13. Technik und Kosten

- **Neues Projekt:** eigener Ordner, eigenes GitHub-Repository, Next.js wie bisher.
- **Übernommen:** Stimmen-Skripte, `.env.local`, Abspieler-Prinzip, Wege-Test, Lektionen aus dem alten Stil-Leitfaden.
- **Neu zu bauen:** Figuren mit Gelenken und acht Ausdrücken, Kamera, Räume in drei Ebenen, Geräusche und Musik, Spielwerte über Kapitel, Spielstand im Browser.
- **Stimmen:** etwa 500 Zeichen pro Szene, rund 3.500 pro Kapitel. Das kostenlose ElevenLabs-Kontingent (10.000 Zeichen im Monat) reicht für zwei bis drei Kapitel im Monat und erlaubt keine kommerzielle Nutzung.
- **Kosten** bleiben in der Prototyp-Phase bei null.

---

## 14. Fahrplan

| Schritt | Was | Abnahme |
|---|---|---|
| 0 | Neues Projekt und Repository | Paul legt das Repository an |
| 1 | **Stil-Entwürfe:** Szene 3 („Der Fehler") als Standbild in drei Varianten des Stils aus Abschnitt 5 | Paul wählt |
| 2 | **Figuren-Blatt:** die zehn Hauptfiguren, je mit Ausdrücken und zwei Gesten. Randfiguren folgen pro Kapitel. | Paul gibt frei |
| 3 | **Eine Testszene** komplett mit Kamera, Stimmen, Geräuschen | Paul gibt frei: Fühlt sich das an wie gewollt? |
| 4 | **Drehbuch Kapitel 1** ausformuliert | Paul gibt frei |
| 5 | Kapitel 1 bauen | |
| 6 | Test mit drei bis fünf Leuten | Lachen sie? Spielen sie weiter? |
| 7 | Kapitel 2 und folgende, Startseite, Rechtliches | |

---

## 15. Offene Fragen

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
8. Passen die zehn Hauptfiguren und ihre Namen? Fehlt eine Rolle?
9. Feste Spielfigur, oder Auswahl aus zwei bis drei Aussehen?
10. Bleiben Gehirn und Jonas als Nebenfiguren?

**Humor**
11. Passt die Härte der Beispiele in Abschnitt 2, oder soll es noch böser oder etwas milder werden?
12. Einverstanden mit den Regeln für anzügliche Situationen (Abschnitt 2) und mit der Auflösung des Angebots von Gisela (Abschnitt 7)?
13. Wie viele Zufallsereignisse pro Kapitel: eins (Vorschlag) oder mehr?

**Spiel**
14. Drei Werte wie beschrieben, oder einfacher?
15. Zeitdruck bei den Antworten: ja oder nein?
16. Was soll passieren, wenn man ein Kapitel nicht schafft: Wiederholungsszene (Vorschlag) oder Kapitel neu?

**Inhalt und Geld**
17. Sollen die sechs alten Filme irgendwo weiterleben, oder bleiben sie im alten Projekt?
18. Ab wann soll Geld eine Rolle spielen?
19. Bezahlter Stimmen-Tarif, sobald es öffentlich wird?
