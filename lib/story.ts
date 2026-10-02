// Aufbau einer Story-Datei (stories/*.json). Die Datei ist die einzige Quelle
// für App und spätere Social Clips.

export type Channel = "call" | "mail" | "chat";

type Condition = { ifFlag?: string; unlessFlag?: string };

export type Line = Condition & {
  from: string;
  channel: Channel;
  text: string;
  subject?: string;
};

// set/add verändern das aktuelle Angebot, flag merkt sich etwas (z. B. "accepted").
export type Effect = Condition & {
  set?: number;
  add?: number;
  flag?: string;
};

export type Option = {
  id: string;
  text: string;
  effects?: Effect[];
  table?: string;
  replies?: Line[];
};

export type Beat =
  | { type: "scene"; title: string; time: string }
  | { type: "lines"; lines: Line[]; table?: string }
  | { type: "decision"; id: string; channel: Channel; options: Option[] };

export type Ending = {
  id: string;
  title: string;
  text: string;
  jonas: string;
  // Mindestens eine der Bedingungen muss passen.
  when: { minOffer: number; flag?: string }[];
};

export type Story = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  goal: number;
  characters: Record<string, string>;
  intro: string[];
  beats: Beat[];
  endings: Ending[];
  flagLabels: Record<string, string>;
  reveal: { title: string; text: string; strength: string; source: string }[];
  strongRun: {
    title: string;
    result: number;
    steps: { text: string; label: string }[];
  };
  disclaimer: string;
};
