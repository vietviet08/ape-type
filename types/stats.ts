import type { ApeTypeSettings, TestMode, WordListName } from "@/types/settings";
import type { WpmSample } from "@/types/typing";

export interface StoredTestResult {
  id: string;
  timestamp: string;
  mode: TestMode;
  duration: number | null;
  wordCount: number | null;
  wordList: WordListName;
  seed: string;
  wpm: number;
  raw: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  incorrectChars: number;
  typedChars: number;
  samples: WpmSample[];
  settingsSnapshot: Pick<
    ApeTypeSettings,
    "punctuation" | "numbers" | "capitalize" | "stopOnWord"
  >;
}
