import { z } from "zod";

import {
  DEFAULT_SETTINGS,
  SETTINGS_SCHEMA_VERSION,
  TIME_OPTIONS,
  WORD_OPTIONS,
} from "@/types/settings";
import type { ApeTypeSettings, StoredTestResult } from "@/types";

const SETTINGS_KEY = "ape-type.settings";
const HISTORY_KEY = "ape-type.history";
const HISTORY_LIMIT = 50;

const settingsSchema = z.object({
  version: z.number().int().default(SETTINGS_SCHEMA_VERSION),
  mode: z.enum(["time", "words"]),
  duration: z
    .number()
    .refine((value): value is (typeof TIME_OPTIONS)[number] =>
      TIME_OPTIONS.includes(value as (typeof TIME_OPTIONS)[number]),
    ),
  wordCount: z
    .number()
    .refine((value): value is (typeof WORD_OPTIONS)[number] =>
      WORD_OPTIONS.includes(value as (typeof WORD_OPTIONS)[number]),
    ),
  wordList: z.enum(["english_1k", "english_5k"]),
  punctuation: z.boolean(),
  numbers: z.boolean(),
  capitalize: z.boolean(),
  stopOnWord: z.boolean(),
  sound: z.boolean(),
  theme: z.enum(["dark", "light", "system"]),
});

const sampleSchema = z.object({
  second: z.number().int().nonnegative(),
  wpm: z.number().nonnegative(),
  rawWpm: z.number().nonnegative(),
  accuracy: z.number().min(0).max(100),
});

const resultSchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().datetime(),
  mode: z.enum(["time", "words"]),
  duration: z.number().int().positive().nullable(),
  wordCount: z.number().int().positive().nullable(),
  wordList: z.enum(["english_1k", "english_5k"]),
  seed: z.string().min(1),
  wpm: z.number().nonnegative(),
  raw: z.number().nonnegative(),
  accuracy: z.number().min(0).max(100),
  errors: z.number().nonnegative(),
  correctChars: z.number().nonnegative(),
  incorrectChars: z.number().nonnegative(),
  typedChars: z.number().nonnegative(),
  samples: z.array(sampleSchema),
  settingsSnapshot: z.object({
    punctuation: z.boolean(),
    numbers: z.boolean(),
    capitalize: z.boolean(),
    stopOnWord: z.boolean(),
  }),
});

const historySchema = z.array(resultSchema);

function hasStorage(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function readRaw(key: string): unknown {
  if (!hasStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: unknown): void {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadSettings(): ApeTypeSettings {
  const parsed = settingsSchema.safeParse(readRaw(SETTINGS_KEY));
  if (!parsed.success) {
    return DEFAULT_SETTINGS;
  }

  if (parsed.data.version !== SETTINGS_SCHEMA_VERSION) {
    return {
      ...DEFAULT_SETTINGS,
      ...parsed.data,
      version: SETTINGS_SCHEMA_VERSION,
    };
  }

  return parsed.data;
}

export function saveSettings(nextSettings: ApeTypeSettings): void {
  writeRaw(SETTINGS_KEY, {
    ...nextSettings,
    version: SETTINGS_SCHEMA_VERSION,
  });
}

export function loadHistory(): StoredTestResult[] {
  const parsed = historySchema.safeParse(readRaw(HISTORY_KEY));
  if (!parsed.success) {
    return [];
  }

  return parsed.data.slice(0, HISTORY_LIMIT);
}

export function saveHistory(results: StoredTestResult[]): void {
  writeRaw(HISTORY_KEY, results.slice(0, HISTORY_LIMIT));
}

export function appendHistory(result: StoredTestResult): StoredTestResult[] {
  const next = [result, ...loadHistory()].slice(0, HISTORY_LIMIT);
  saveHistory(next);
  return next;
}

export function exportHistory(): string {
  return JSON.stringify(loadHistory(), null, 2);
}

export function importHistory(json: string): StoredTestResult[] {
  const raw: unknown = JSON.parse(json);
  const parsed = historySchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error("Invalid ApeType stats file.");
  }

  const bounded = parsed.data.slice(0, HISTORY_LIMIT);
  saveHistory(bounded);
  return bounded;
}
