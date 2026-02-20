import type { TestMode } from "@/types/settings";

export interface CharacterAnalysis {
  correctChars: number;
  incorrectChars: number;
  typedChars: number;
  errors: number;
}

export interface LiveMetrics extends CharacterAnalysis {
  elapsedMs: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
}

export interface WpmSample {
  second: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
}

export interface FinalResult extends LiveMetrics {
  mode: TestMode;
  duration: number | null;
  wordCount: number | null;
  timestamp: string;
  samples: WpmSample[];
}

export type CharacterVisualState =
  | "pending"
  | "current"
  | "correct"
  | "incorrect"
  | "missed"
  | "extra";

export interface RenderedCharacter {
  value: string;
  state: CharacterVisualState;
  index: number;
}

export interface RenderedWord {
  index: number;
  target: string;
  typed: string;
  isCurrent: boolean;
  isCompleted: boolean;
  chars: RenderedCharacter[];
}

export interface WordGenerationOptions {
  punctuation: boolean;
  numbers: boolean;
  capitalize: boolean;
  count: number;
  seed: string | number;
}

export interface TestSeed {
  seed: string;
  createdAt: number;
}
