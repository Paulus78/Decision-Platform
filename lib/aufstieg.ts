"use client";

import { useSyncExternalStore } from "react";

// „Der Aufstieg“: Du fängst bei NOVARA als Praktikant an und willst den Stuhl des CEO.
// Diese Datei enthält die Ereignisse der ersten Stufe und den Spielstand im Browser.

export type Who = "ceo" | "krueger" | "brandt" | "jonas" | "erzaehler";
export type Mood = "neutral" | "happy" | "surprised" | "worried";

// a = Ansehen bei den Chefs, v = Verbündete unter den Kollegen, n = Nerven.
export type Effect = { a?: number; v?: number; n?: number };

export type Choice = {
  text: string;
  effect: Effect;
  reply: { who: Who; text: string; mood?: Mood };
  // Kommentar von deinem Gehirn.
  brain?: string;
  // Schaltet eine Bürolegende frei.
  legend?: string;
  // Nur im ersten Ereignis: der Spitzname, den du bekommst.
  nickname?: string;
};

export type Event = {
  id: string;
  who: Who;
  mood?: Mood;
  // Was passiert (Erzähler) und was die Person sagt.
  setup: string;
  line?: string;
  choices: [Choice, Choice, Choice];
  // Büro-Weisheit zu diesem Ereignis (Erfahrungswissen, keine Studie).
  lesson?: string;
};

export const NAMES: Record<Who, string> = {
  ceo: "Richard von Thalberg, CEO",
  krueger: "Herr Krüger, dein Chef",
  brandt: "Frau Brandt, Personal",
  jonas: "Jonas, Buchhaltung",
  erzaehler: "",
};

export const START = { a: 2, v: 3, n: 6 };
export const MAX = 10;
// So viel Ansehen braucht die Beförderung am Ende des Tages.
export const PROMOTION = 7;
// Ereignisse pro Tag nach der Begrüßung.
export const EVENTS_PER_DAY = 5;

// Die Karriereleiter. Spielbar ist im Prototyp nur die erste Stufe.
export const RANKS = [
  { title: "Praktikant", outfit: "Kapuzenpulli und Schlüsselband" },
  { title: "Werkstudent", outfit: "Hemd, Krawatte schief" },
  { title: "Teamleitung", outfit: "Sakko" },
  { title: "Vorstand", outfit: "Anzug" },
  { title: "CEO", outfit: "Thalbergs Stuhl" },
];

// Das erste Ereignis ist immer gleich: Der CEO gibt dir einen Spitznamen.
export const FIRST: Event = {
  id: "begruessung",
  who: "ceo",
  setup: "Dein erster Tag bei NOVARA. Der CEO rauscht durch den Flur, bleibt stehen und zeigt auf dich.",
  line: "Und was ist … das?",
  choices: [
    {
      text: "Guten Morgen! Ich bin der neue Praktikant.",
      effect: { a: 1 },
      nickname: "Ameise",
      reply: { who: "ceo", text: "Aha. Eine Ameise. Klein, fleißig und überall im Weg." },
      brain: "Tag eins. Wir haben einen Namen. Es ist nicht unserer.",
    },
    {
      text: "(Hand ausstrecken) Freut mich, Herr von Thalberg.",
      effect: { n: -1 },
      nickname: "Händchen",
      reply: {
        who: "ceo",
        text: "Ich fasse nichts an, was unter Vorstandsebene arbeitet. Merk dir das, Händchen.",
      },
      brain: "Die Hand hängt noch in der Luft. Zieh sie zurück. Langsam.",
    },
    {
      text: "(Nichts sagen und freundlich lächeln)",
      effect: { v: 1 },
      nickname: "Topfpflanze",
      reply: { who: "ceo", text: "Stellt die Topfpflanze bitte woanders hin. Sie steht im Licht.", mood: "neutral" },
      brain: "Er hält uns für Deko. Immerhin für lebende.",
    },
  ],
};

export const POOL: Event[] = [
  {
    id: "drucker",
    who: "krueger",
    mood: "surprised",
    setup: "Der Drucker brennt. Leicht. Das ganze Büro schaut dich an.",
    line: "Sie stehen am nächsten dran!",
    choices: [
      {
        text: "Ich hole den Feuerlöscher.",
        effect: { a: 2, n: -1 },
        reply: { who: "krueger", text: "Gut reagiert, äh … Sie da.", mood: "happy" },
        brain: "Er kennt unseren Namen nicht. Aber er hat „gut“ gesagt.",
      },
      {
        text: "Das war ich nicht!",
        effect: { a: -1, v: -1 },
        reply: { who: "krueger", text: "Das hat auch niemand behauptet.", mood: "neutral" },
        brain: "Niemand hat gefragt. Jetzt denken es alle.",
      },
      {
        text: "Hat jemand Marshmallows?",
        effect: { a: -1, v: 2 },
        legend: "Hat am brennenden Drucker gegrillt",
        reply: { who: "jonas", text: "Ich hab Würstchen im Kühlschrank. Zwei Minuten.", mood: "happy" },
      },
    ],
  },
  {
    id: "kaffee",
    who: "krueger",
    setup: "Krüger drückt dir einen Zettel in die Hand. Der Zettel ist leer.",
    line: "Kaffee für vierzehn. Sie wissen ja, wer was trinkt.",
    lesson: "Kleine Aufgaben, gut gemacht, sind die Eintrittskarte für größere.",
    choices: [
      {
        text: "Ich frage alle einzeln und schreibe eine Liste.",
        effect: { a: 1, v: 1, n: -2 },
        reply: { who: "brandt", text: "Hafermilch, lauwarm. Danke, dass endlich mal jemand fragt.", mood: "happy" },
      },
      {
        text: "Vierzehnmal schwarz. Fertig.",
        effect: { a: 1, v: -2 },
        reply: { who: "brandt", text: "Ich trinke seit 2019 keinen Kaffee mehr.", mood: "neutral" },
        brain: "Effizient. Und wir essen ab heute allein zu Mittag.",
      },
      {
        text: "Ich biete Jonas mein Mittagessen an, wenn er das übernimmt.",
        effect: { a: 1, v: 1, n: -1 },
        legend: "Hat den Kaffeedienst ausgelagert",
        reply: { who: "jonas", text: "Deal. Aber ich will auch den Nachtisch.", mood: "happy" },
        brain: "Wir haben gerade delegiert. Am ersten Tag. Hungrig, aber stolz.",
      },
    ],
  },
  {
    id: "fehler",
    who: "krueger",
    mood: "happy",
    setup: "In fünf Minuten präsentiert Krüger vor dem Vorstand. Auf Folie 3 steht ein Rechenfehler. Ein großer.",
    line: "Na? Beeindruckt von meinen Folien?",
    lesson: "Fehler vom Chef sagt man ihm unter vier Augen. Vor Publikum gewinnt keiner.",
    choices: [
      {
        text: "(Leise) Auf Folie 3 stimmt eine Zahl nicht.",
        effect: { a: 3 },
        reply: { who: "krueger", text: "Das … bleibt unter uns. Gut aufgepasst.", mood: "surprised" },
        brain: "Er schuldet uns was. Er weiß es. Wir wissen es.",
      },
      {
        text: "Ich warte und melde mich im Meeting dazu.",
        effect: { a: -2, v: 2 },
        reply: { who: "krueger", text: "Vielen Dank. Für diesen Beitrag. Vor allen.", mood: "worried" },
        brain: "Die Kollegen feiern uns. Krüger hat sich unser Gesicht gemerkt.",
      },
      {
        text: "Sehr beeindruckend!",
        effect: { a: -1, n: -1 },
        reply: { who: "krueger", text: "Der Vorstand hat den Fehler gefunden. Wer hat die Folien gegengelesen?", mood: "worried" },
        brain: "Er schaut uns an. Wir haben die Folien nie gesehen. Offiziell.",
      },
    ],
  },
  {
    id: "aufzug",
    who: "ceo",
    setup: "Die Aufzugtür schließt sich. Neben dir steht von Thalberg. Es sind 34 Stockwerke.",
    line: "…",
    choices: [
      {
        text: "(Schweigen und auf die eigenen Schuhe starren)",
        effect: { n: -1 },
        reply: { who: "ceo", text: "Du atmest sehr laut für jemanden ohne Dienstwagen." },
        brain: "Noch 31 Stockwerke. Nicht atmen ist auch keine Lösung.",
      },
      {
        text: "Wie wird man eigentlich CEO?",
        effect: { a: 1 },
        reply: { who: "ceo", text: "Man wird als einer geboren. Nächste Frage. Es gibt keine nächste Frage." },
        brain: "Notiert: Er hat die Firma geerbt. Das merken wir uns für später.",
      },
      {
        text: "Schöner Anzug, Richard.",
        effect: { a: -1, v: 3 },
        legend: "Hat den CEO geduzt",
        reply: { who: "ceo", text: "Für dich immer noch Herr Doktor von Thalberg.", mood: "surprised" },
        brain: "Das weiß in zehn Minuten das ganze Haus. Wir sind eine Legende.",
      },
    ],
  },
  {
    id: "meeting",
    who: "krueger",
    setup: "Meeting, Minute 52. Alle starren auf den Tisch. Du hast eine Idee. Sie ist gut.",
    line: "Hat noch jemand etwas? Nein? Dann …",
    lesson: "Gute Ideen brauchen einen Absender. Schick sie nach dem Meeting noch einmal per Mail.",
    choices: [
      {
        text: "Doch, ich hätte einen Vorschlag.",
        effect: { a: 2 },
        reply: { who: "krueger", text: "Interessant. Genau das wollte ich auch gerade sagen.", mood: "happy" },
        brain: "Er hat unsere Idee geklaut. In Echtzeit. Vor Zeugen.",
      },
      {
        text: "Ich flüstere die Idee Jonas zu.",
        effect: { v: 2 },
        reply: { who: "jonas", text: "Die ist gut. Ich sag, sie kommt von uns beiden.", mood: "happy" },
      },
      {
        text: "(Schweigen. Ich bin nur der Praktikant.)",
        effect: { a: -1, n: 1 },
        reply: { who: "krueger", text: "Gut. Dann machen wir es wie immer.", mood: "neutral" },
        brain: "Wie immer heißt: schlecht. Aber wir waren pünktlich draußen.",
      },
    ],
  },
  {
    id: "ueberstunden",
    who: "krueger",
    setup: "17:58 Uhr. Du hast die Jacke schon an.",
    line: "Sie haben heute doch nichts mehr vor? Die Folien müssen bis morgen bunt sein.",
    lesson: "Ein Nein mit Angebot („bis 19 Uhr“) kommt besser an als ein Ja mit Zähneknirschen.",
    choices: [
      {
        text: "Klar, mach ich.",
        effect: { a: 1, n: -3 },
        reply: { who: "krueger", text: "Wusste ich. Auf Sie ist Verlass. Wie war noch der Name?", mood: "happy" },
        brain: "23:40 Uhr. Die Folien sind bunt. Wir sind es auch.",
      },
      {
        text: "Bis 19 Uhr kann ich, danach bin ich verabredet.",
        effect: { a: 1, n: -1 },
        reply: { who: "krueger", text: "Hm. Na gut. Dann eben die wichtigsten zehn.", mood: "neutral" },
        brain: "Er hat verhandelt. Mit uns. Wir existieren.",
      },
      {
        text: "(Durch den Notausgang verschwinden)",
        effect: { a: -2, n: 2 },
        legend: "Notausgang-Ninja",
        reply: { who: "erzaehler", text: "Der Alarm geht los. Die Feuerwehr kommt. Du bist schon in der Bahn." },
      },
    ],
  },
  {
    id: "geschenk",
    who: "brandt",
    mood: "happy",
    setup: "Frau Brandt geht mit einem Umschlag durchs Büro. Du verdienst 520 Euro im Monat.",
    line: "Wir sammeln für Herrn Krügers Geburtstag. Jeder gibt, was er kann!",
    choices: [
      {
        text: "Hier sind 20 Euro.",
        effect: { v: 1, n: -2 },
        reply: { who: "brandt", text: "Sehr großzügig! Herr Krüger selbst hat 5 gegeben.", mood: "surprised" },
        brain: "Das war unser Abendessen. Bis Donnerstag.",
      },
      {
        text: "2 Euro. Und ich male die Karte.",
        effect: { v: 2 },
        reply: { who: "brandt", text: "Die Karte ist das Schönste am ganzen Geschenk.", mood: "happy" },
      },
      {
        text: "Ich bin Praktikant. Ich bin das Geschenk.",
        effect: { v: 1, a: 1 },
        legend: "Hat sich selbst verschenkt",
        reply: { who: "brandt", text: "Das schreibe ich genau so auf die Karte.", mood: "happy" },
      },
    ],
  },
  {
    id: "allen-antworten",
    who: "erzaehler",
    setup:
      "Der CEO schickt eine Rundmail an 4.000 Leute: „Meine Gedanken zu Führung“. Du willst sie Jonas weiterleiten und schreibst: „haha was für ein Clown“. Du hast auf „Allen antworten“ geklickt.",
    choices: [
      {
        text: "Sofort eine Entschuldigung an alle 4.000.",
        effect: { a: -1, n: -2 },
        reply: { who: "ceo", text: "Wer ist das? Kann man das feuern?" },
        brain: "Jetzt haben es auch die gelesen, die es übersehen hatten.",
      },
      {
        text: "Zweite Mail: „Autokorrektur! Ich meinte: Was für ein Chef!“",
        effect: { a: -1, v: 2 },
        reply: { who: "jonas", text: "Niemand glaubt dir. Alle lieben dich.", mood: "happy" },
      },
      {
        text: "Laptop zuklappen. Mittagspause.",
        effect: { a: -2, v: 3, n: 1 },
        legend: "Hat 4.000 Leuten die Wahrheit gesagt",
        reply: { who: "brandt", text: "Ich habe nichts gesehen. Aber ich habe es ausgedruckt.", mood: "happy" },
        brain: "In der Kantine wird geklatscht. Für uns. Leise.",
      },
    ],
  },
  {
    id: "archiv",
    who: "krueger",
    setup: "Krüger zeigt auf eine Tür, hinter der es dunkel ist.",
    line: "Sortieren Sie das Archiv. Alphabetisch. Zurück bis 1987.",
    lesson: "Erst fragen, wofür etwas gebraucht wird. Oft erledigt sich die Aufgabe dabei.",
    choices: [
      {
        text: "Wird gemacht.",
        effect: { a: 1, n: -2 },
        reply: { who: "erzaehler", text: "Nach sechs Stunden bist du bei „B“. Es gibt 40 Regale." },
        brain: "Hier unten gibt es kein Netz. Und keinen Zeugen.",
      },
      {
        text: "Wofür wird das Archiv denn gebraucht?",
        effect: { a: 2 },
        reply: { who: "krueger", text: "Gute Frage. Eigentlich … für nichts. Lassen Sie es.", mood: "surprised" },
        brain: "Eine Frage. Sechs Stunden gespart.",
      },
      {
        text: "Ich fotografiere alles und lasse es den Computer sortieren.",
        effect: { a: 1, n: 2 },
        legend: "Hat das Archiv automatisiert",
        reply: { who: "erzaehler", text: "Nach 20 Minuten bist du fertig. Den Rest des Tages schläfst du zwischen den Ordnern." },
      },
    ],
  },
  {
    id: "lob",
    who: "brandt",
    mood: "happy",
    setup: "Frau Brandt lobt Krüger vor dem ganzen Team für „seinen“ Bericht. Den Bericht hast du geschrieben.",
    line: "Wirklich hervorragend, Herr Krüger. Jede Seite!",
    lesson: "Wer nie sagt, was er gemacht hat, wird für nichts davon erinnert.",
    choices: [
      {
        text: "Danke! Den habe übrigens ich geschrieben.",
        effect: { a: 2, v: -1 },
        reply: { who: "krueger", text: "Unter meiner Anleitung. Selbstverständlich.", mood: "worried" },
        brain: "Frau Brandt hat es gehört. Das reicht.",
      },
      {
        text: "Später bitte ich Krüger, mich beim nächsten Mal zu nennen.",
        effect: { a: 1, v: 1 },
        reply: { who: "krueger", text: "Ach, hatte ich das nicht? Beim nächsten Mal.", mood: "neutral" },
      },
      {
        text: "(Schweigen und klatschen)",
        effect: { n: -1 },
        reply: { who: "krueger", text: "Danke, danke. Es war viel Arbeit.", mood: "happy" },
        brain: "Wir klatschen für unseren eigenen Bericht. Für ihn.",
      },
    ],
  },
  {
    id: "parkplatz",
    who: "ceo",
    setup: "Der Sportwagen des CEO steht quer auf zwei Parkplätzen. Er wirft dir den Schlüssel zu.",
    line: "Umparken. Und fass das Lenkrad nicht an.",
    choices: [
      {
        text: "Ich parke ihn ordentlich um.",
        effect: { a: 1, n: -1 },
        reply: { who: "ceo", text: "Du hast das Lenkrad angefasst. Ich merke so etwas." },
      },
      {
        text: "Ich habe leider keinen Führerschein.",
        effect: { n: 1 },
        reply: { who: "ceo", text: "Natürlich nicht. Wozu auch. Gib her." },
        brain: "Wir haben einen. Aber das muss er nicht wissen.",
      },
      {
        text: "Ich parke ihn vor der Feuerwehrzufahrt.",
        effect: { a: -2, v: 3 },
        legend: "Hat den CEO abschleppen lassen",
        reply: { who: "erzaehler", text: "Um 14:10 Uhr kommt der Abschleppwagen. Das halbe Haus steht am Fenster." },
        brain: "Es gibt ein Video. Jonas hat es schon dreimal verschickt.",
      },
    ],
  },
];

export const ALL_LEGENDS = [...FIRST.choices, ...POOL.flatMap((e) => e.choices)]
  .map((c) => c.legend)
  .filter((l): l is string => Boolean(l));

// card: die Zeile auf deiner Visitenkarte. {nick} im Zitat wird durch deinen Spitznamen ersetzt.
export type Outcome = {
  id: string;
  title: string;
  text: string;
  who: Who;
  quote: string;
  card: string;
  promoted?: boolean;
};

// Wie der Tag endet. Fällt eine Anzeige auf null, ist sofort Schluss.
export function outcome(values: { a: number; v: number; n: number }, finishedDay: boolean): Outcome | null {
  if (values.n <= 0) {
    return {
      id: "kopierraum",
      title: "Im Kopierraum eingeschlafen",
      text: "Man findet dich schlafend auf dem Kopierer. Er lief. Es gibt 200 Kopien von deinem Gesicht.",
      who: "krueger",
      quote: "Hängen Sie die bitte nicht alle auf.",
      card: "Praktikant, schläft gerade",
    };
  }
  if (values.v <= 0) {
    return {
      id: "unsichtbar",
      title: "Unsichtbar",
      text: "Niemand sagt dir, dass Feierabend ist. Um 22 Uhr schaltet der Hausmeister das Licht aus. Du sitzt noch da.",
      who: "jonas",
      quote: "Ach, du arbeitest hier?",
      card: "Praktikant (vermutlich)",
    };
  }
  if (values.a <= 0) {
    return {
      id: "keller",
      title: "Ab ins Archiv",
      text: "Du wirst versetzt. In den Keller. Zu den Ordnern von 1987. Dein neuer Kollege ist ein Luftentfeuchter.",
      who: "ceo",
      quote: "Schickt {nick} dahin, wo ich nicht hinsehen muss.",
      card: "Archiv, Untergeschoss 2",
    };
  }
  if (!finishedDay) return null;
  if (values.a >= PROMOTION) {
    return {
      id: "befoerdert",
      title: "Befördert!",
      text: "Du bist ab morgen Werkstudent. Du bekommst einen eigenen Stuhl. Mit Rollen.",
      who: "ceo",
      quote: "{nick} darf bleiben. Aber {nick} bleibt {nick}.",
      card: "Werkstudent, ab morgen",
      promoted: true,
    };
  }
  if (values.a >= 4) {
    return {
      id: "verlaengert",
      title: "Praktikum verlängert",
      text: "Nicht gefeuert, nicht befördert. Du darfst morgen wiederkommen und es noch einmal versuchen.",
      who: "krueger",
      quote: "Solide. Wie hießen Sie noch gleich?",
      card: "Praktikant, verlängert",
    };
  }
  return {
    id: "kaffee",
    title: "Kaffee-Beauftragter auf Lebenszeit",
    text: "Du hast jetzt eine feste Aufgabe. Sie hat mit Kaffee zu tun. Nur mit Kaffee.",
    who: "krueger",
    quote: "Vierzehnmal. Sie wissen ja, wer was trinkt.",
    card: "Kaffee-Beauftragter",
  };
}

// ---------- Spielstand im Browser ----------

export type Save = {
  runs: number;
  promoted: boolean;
  legends: string[];
  outcomes: string[];
};

const KEY = "gp-aufstieg-v1";
const EMPTY: Save = { runs: 0, promoted: false, legends: [], outcomes: [] };

let cache: Save | null = null;
const listeners = new Set<() => void>();

function read(): Save {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<Save>) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

export function updateSave(change: (save: Save) => Save) {
  cache = change(read());
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Ohne Speicher gilt der Stand nur bis zum Neuladen.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSave(): Save | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
