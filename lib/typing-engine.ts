import english1k from "@/lib/wordlists/english_1k.json";
import english5k from "@/lib/wordlists/english_5k.json";
import { pickRandomWords, createSeededRng, randomInt } from "@/lib/rng";
import type {
  ApeTypeSettings,
  CharacterAnalysis,
  RenderedCharacter,
  RenderedWord,
  WordListName,
} from "@/types";

const PUNCTUATION_SUFFIX = [".", ",", "!", "?", ";", ":"] as const;

const WORDLISTS: Record<WordListName, readonly string[]> = {
  english_1k: english1k,
  english_5k: english5k,
};

export function getWordList(name: WordListName): readonly string[] {
  return WORDLISTS[name] ?? WORDLISTS.english_1k;
}

function estimateWordPoolSize(settings: ApeTypeSettings): number {
  if (settings.mode === "words") {
    return settings.wordCount;
  }

  const wordsPerSecond = 8;
  return Math.max(Math.ceil(settings.duration * wordsPerSecond), 200);
}

function applyWordModifiers(
  words: string[],
  settings: Pick<ApeTypeSettings, "punctuation" | "numbers" | "capitalize">,
  rng: () => number,
): string[] {
  const withModifiers: string[] = [];

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    let next = word;

    if (settings.numbers && rng() < 0.12) {
      const numberLength = randomInt(rng, 1, 4);
      let digits = "";
      for (let i = 0; i < numberLength; i += 1) {
        digits += String(randomInt(rng, 0, 10));
      }
      next = rng() > 0.5 ? `${next}${digits}` : `${digits}${next}`;
    }

    if (settings.punctuation && rng() < 0.18) {
      next = `${next}${PUNCTUATION_SUFFIX[randomInt(rng, 0, PUNCTUATION_SUFFIX.length)]}`;
    }

    if (settings.capitalize) {
      const shouldUppercase =
        index === 0 || /[.!?]$/.test(withModifiers[index - 1] ?? "");
      if (shouldUppercase) {
        next = next.charAt(0).toUpperCase() + next.slice(1);
      }
    }

    withModifiers.push(next);
  }

  return withModifiers;
}

export function createWordSequence(
  settings: ApeTypeSettings,
  seed: string,
): string[] {
  const rng = createSeededRng(seed);
  const baseWords = getWordList(settings.wordList);
  const selectedWords = pickRandomWords(
    baseWords,
    estimateWordPoolSize(settings),
    rng,
  );

  return applyWordModifiers(selectedWords, settings, rng);
}

function analyzeWord(
  target: string,
  typed: string,
  isCompletedWord: boolean,
): CharacterAnalysis {
  let correctChars = 0;
  let incorrectChars = 0;

  for (let index = 0; index < typed.length; index += 1) {
    if (typed[index] === target[index]) {
      correctChars += 1;
    } else {
      incorrectChars += 1;
    }
  }

  const missedChars = isCompletedWord
    ? Math.max(target.length - typed.length, 0)
    : 0;

  return {
    correctChars,
    incorrectChars,
    typedChars: typed.length,
    errors: incorrectChars + missedChars,
  };
}

export function analyzeCharacters(
  targetWords: readonly string[],
  committedWords: readonly string[],
  currentWordIndex: number,
  currentInput: string,
): CharacterAnalysis {
  const aggregate: CharacterAnalysis = {
    correctChars: 0,
    incorrectChars: 0,
    typedChars: 0,
    errors: 0,
  };

  for (let index = 0; index < committedWords.length; index += 1) {
    const result = analyzeWord(
      targetWords[index] ?? "",
      committedWords[index] ?? "",
      true,
    );
    aggregate.correctChars += result.correctChars;
    aggregate.incorrectChars += result.incorrectChars;
    aggregate.typedChars += result.typedChars;
    aggregate.errors += result.errors;
  }

  const activeWord = analyzeWord(
    targetWords[currentWordIndex] ?? "",
    currentInput,
    false,
  );
  aggregate.correctChars += activeWord.correctChars;
  aggregate.incorrectChars += activeWord.incorrectChars;
  aggregate.typedChars += activeWord.typedChars;
  aggregate.errors += activeWord.errors;

  return aggregate;
}

export function isWordCorrect(targetWord: string, typedWord: string): boolean {
  return targetWord === typedWord;
}

export function canAdvanceWord(
  targetWord: string,
  typedWord: string,
  stopOnWord: boolean,
): boolean {
  if (!stopOnWord) {
    return true;
  }

  return isWordCorrect(targetWord, typedWord);
}

function getCharacterState(
  index: number,
  targetWord: string,
  typedWord: string,
  wordIndex: number,
  currentWordIndex: number,
): RenderedCharacter["state"] {
  const isPastWord = wordIndex < currentWordIndex;
  const isCurrentWord = wordIndex === currentWordIndex;

  if (isPastWord) {
    const typedChar = typedWord[index];
    if (typedChar === undefined) {
      return "missed";
    }
    return typedChar === targetWord[index] ? "correct" : "incorrect";
  }

  if (isCurrentWord) {
    const typedChar = typedWord[index];
    if (typedChar !== undefined) {
      return typedChar === targetWord[index] ? "correct" : "incorrect";
    }

    if (index === typedWord.length) {
      return "current";
    }

    return "pending";
  }

  return "pending";
}

function buildWordCharacters(
  targetWord: string,
  typedWord: string,
  wordIndex: number,
  currentWordIndex: number,
): RenderedCharacter[] {
  const chars: RenderedCharacter[] = [];

  for (let index = 0; index < targetWord.length; index += 1) {
    chars.push({
      value: targetWord[index],
      state: getCharacterState(
        index,
        targetWord,
        typedWord,
        wordIndex,
        currentWordIndex,
      ),
      index,
    });
  }

  if (typedWord.length > targetWord.length) {
    for (let index = targetWord.length; index < typedWord.length; index += 1) {
      chars.push({
        value: typedWord[index],
        state: "extra",
        index,
      });
    }
  }

  return chars;
}

export function buildRenderedWords(
  targetWords: readonly string[],
  committedWords: readonly string[],
  currentWordIndex: number,
  currentInput: string,
): RenderedWord[] {
  return targetWords.map((target, index) => {
    const isCurrent = index === currentWordIndex;
    const typed = isCurrent ? currentInput : (committedWords[index] ?? "");

    return {
      index,
      target,
      typed,
      isCurrent,
      isCompleted: index < currentWordIndex,
      chars: buildWordCharacters(target, typed, index, currentWordIndex),
    };
  });
}

export function chunkWordsByVisualRows(
  words: readonly string[],
  maxCharsPerRow = 72,
): number[][] {
  if (words.length === 0) {
    return [];
  }

  const rows: number[][] = [];
  let currentRow: number[] = [];
  let rowLength = 0;

  words.forEach((word, index) => {
    const projected =
      rowLength === 0 ? word.length : rowLength + word.length + 1;

    if (projected > maxCharsPerRow && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [index];
      rowLength = word.length;
      return;
    }

    currentRow.push(index);
    rowLength = projected;
  });

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

export function getActiveRowIndex(
  rows: readonly number[][],
  currentWordIndex: number,
): number {
  const rowIndex = rows.findIndex((row) => row.includes(currentWordIndex));
  return rowIndex === -1 ? 0 : rowIndex;
}
