export type TestMode = "time" | "words";

export type WordListName = "english_1k" | "english_5k" | "vietnamese_core";

export type ThemeMode = "dark" | "light" | "system";

export const SETTINGS_SCHEMA_VERSION = 1;

export const TIME_OPTIONS = [15, 30, 60, 120] as const;

export const WORD_OPTIONS = [10, 25, 50, 100] as const;

export interface ApeTypeSettings {
  version: number;
  mode: TestMode;
  duration: (typeof TIME_OPTIONS)[number];
  wordCount: (typeof WORD_OPTIONS)[number];
  wordList: WordListName;
  punctuation: boolean;
  numbers: boolean;
  capitalize: boolean;
  stopOnWord: boolean;
  sound: boolean;
  theme: ThemeMode;
}

export const DEFAULT_SETTINGS: ApeTypeSettings = {
  version: SETTINGS_SCHEMA_VERSION,
  mode: "time",
  duration: 30,
  wordCount: 25,
  wordList: "english_1k",
  punctuation: false,
  numbers: false,
  capitalize: false,
  stopOnWord: false,
  sound: false,
  theme: "dark",
};
