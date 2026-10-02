"use client";

import { useSyncExternalStore } from "react";
import type { State } from "@/lib/engine";

// Spielstand der Serie. Liegt nur im Browser (localStorage), ohne Login und ohne Server.

export type Played = {
  // Kalendertag, an dem die Folge gespielt wurde (JJJJ-MM-TT, Ortszeit).
  day: string;
  choice: string;
  text: string;
  // Stand der Geschichte nach dieser Folge.
  state: State;
};

export type SeriesData = {
  // Gespielte Folgen der laufenden Runde.
  episodes: Played[];
  // Ende der laufenden Runde, sobald die letzte Folge gespielt ist.
  ending: string | null;
  // Bis zu welcher Folge vorzeitig freigeschaltet wurde („Nicht warten“).
  early: number;
  // Wiederholungsrunde: keine Wartezeit zwischen den Folgen.
  instant: boolean;
  // Alle je gefundenen Enden.
  album: string[];
  // Tage in Folge, an denen gespielt wurde.
  streak: { last: string; count: number };
  // Nur zur eigenen Auswertung im Prototyp.
  skips: number;
  prep: boolean;
  runs: number;
};

const KEY = "gp-serie-angebot-v1";

const EMPTY: SeriesData = {
  episodes: [],
  ending: null,
  early: 0,
  instant: false,
  album: [],
  streak: { last: "", count: 0 },
  skips: 0,
  prep: false,
  runs: 0,
};

let cache: SeriesData | null = null;
const listeners = new Set<() => void>();

function read(): SeriesData {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<SeriesData>) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

export function updateSeries(change: (data: SeriesData) => SeriesData) {
  cache = change(read());
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Privater Modus oder voller Speicher: Der Stand gilt dann nur bis zum Neuladen.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// null, solange die Seite noch auf dem Server oder beim ersten Aufbau ist.
export function useSeries(): SeriesData | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function dayString(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Zählt die Serie weiter: gestern gespielt → +1, heute schon gespielt → bleibt, sonst von vorn.
export function nextStreak(streak: SeriesData["streak"], now: Date) {
  const today = dayString(now);
  if (streak.last === today) return streak;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return { last: today, count: streak.last === dayString(yesterday) ? streak.count + 1 : 1 };
}
