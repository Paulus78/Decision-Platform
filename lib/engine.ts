import type { Beat, Ending, Line, Option, Story } from "./story";

export type State = {
  offer: number;
  flags: string[];
  // Vorlage für die Anzeige "Zahl auf dem Tisch", z. B. "{offer} € · ihr Angebot"
  table: string;
  choices: Record<string, string>;
};

export type LogEntry =
  | { kind: "scene"; title: string; time: string }
  | { kind: "line"; line: Line };

export const initialState: State = {
  offer: 0,
  flags: [],
  table: "— €",
  choices: {},
};

export function euro(n: number): string {
  return n.toLocaleString("de-DE");
}

// Ersetzt {offer} und {offer+1000} durch den aktuellen Betrag.
export function fill(text: string, state: State): string {
  return text.replace(/\{offer(?:\+(\d+))?\}/g, (_, plus) =>
    euro(state.offer + Number(plus ?? 0)),
  );
}

function matches(
  cond: { ifFlag?: string; unlessFlag?: string },
  state: State,
): boolean {
  if (cond.ifFlag && !state.flags.includes(cond.ifFlag)) return false;
  if (cond.unlessFlag && state.flags.includes(cond.unlessFlag)) return false;
  return true;
}

function toEntry(line: Line, state: State): LogEntry {
  return { kind: "line", line: { ...line, text: fill(line.text, state) } };
}

// Spielt Beats ab `from` ab, bis eine Entscheidung kommt oder die Story endet.
export function advance(
  beats: Beat[],
  from: number,
  state: State,
): { index: number; state: State; entries: LogEntry[] } {
  const entries: LogEntry[] = [];
  let index = from;
  for (; index < beats.length; index++) {
    const beat = beats[index];
    if (beat.type === "decision") break;
    if (beat.type === "scene") {
      entries.push({ kind: "scene", title: beat.title, time: beat.time });
      continue;
    }
    if (beat.table) state = { ...state, table: beat.table };
    for (const line of beat.lines) {
      if (matches(line, state)) entries.push(toEntry(line, state));
    }
  }
  return { index, state, entries };
}

export function choose(
  state: State,
  decision: Extract<Beat, { type: "decision" }>,
  option: Option,
): { state: State; entries: LogEntry[] } {
  // Die eigene Antwort wird mit dem Stand VOR der Entscheidung gefüllt.
  const own = toEntry(
    { from: "du", channel: decision.channel, text: option.text },
    state,
  );
  // Bedingungen prüfen wir gegen den Stand vor der Entscheidung.
  const before = state;
  let offer = state.offer;
  const flags = [...state.flags];
  for (const effect of option.effects ?? []) {
    if (!matches(effect, before)) continue;
    if (effect.set !== undefined) offer = effect.set;
    if (effect.add !== undefined) offer += effect.add;
    if (effect.flag && !flags.includes(effect.flag)) flags.push(effect.flag);
  }
  const next: State = {
    offer,
    flags,
    table: option.table ?? state.table,
    choices: { ...state.choices, [decision.id]: option.id },
  };
  const replies = (option.replies ?? [])
    .filter((line) => matches(line, before))
    .map((line) => toEntry(line, next));
  return { state: next, entries: [own, ...replies] };
}

export function pickEnding(story: Story, state: State): Ending {
  const found = story.endings.find((ending) =>
    ending.when.some(
      (w) =>
        state.offer >= w.minOffer && (!w.flag || state.flags.includes(w.flag)),
    ),
  );
  return found ?? story.endings[story.endings.length - 1];
}
