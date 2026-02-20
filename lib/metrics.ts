import type { CharacterAnalysis, LiveMetrics } from "@/types/typing";

const MILLIS_PER_MINUTE = 60000;

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function calculateMetrics(
  analysis: CharacterAnalysis,
  elapsedMs: number,
): LiveMetrics {
  if (elapsedMs <= 0) {
    return {
      ...analysis,
      elapsedMs: 0,
      wpm: 0,
      rawWpm: 0,
      accuracy:
        analysis.typedChars > 0
          ? round((analysis.correctChars / analysis.typedChars) * 100)
          : 100,
    };
  }

  const minutes = Math.max(
    elapsedMs / MILLIS_PER_MINUTE,
    1 / MILLIS_PER_MINUTE,
  );
  const wpm = analysis.correctChars / 5 / minutes;
  const rawWpm = analysis.typedChars / 5 / minutes;
  const accuracy =
    analysis.typedChars > 0 ? analysis.correctChars / analysis.typedChars : 1;

  return {
    ...analysis,
    elapsedMs,
    wpm: round(wpm),
    rawWpm: round(rawWpm),
    accuracy: round(accuracy * 100),
  };
}

export function emptyMetrics(): LiveMetrics {
  return {
    correctChars: 0,
    incorrectChars: 0,
    typedChars: 0,
    errors: 0,
    elapsedMs: 0,
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
  };
}
