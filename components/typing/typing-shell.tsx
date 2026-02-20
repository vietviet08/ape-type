"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Keyboard, RotateCcw } from "lucide-react";

import { useSettings } from "@/components/providers/settings-provider";
import { MetricsBar } from "@/components/typing/metrics-bar";
import { ResultsDialog } from "@/components/typing/results-dialog";
import { TypingDisplay } from "@/components/typing/typing-display";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateMetrics } from "@/lib/metrics";
import { generateSeed } from "@/lib/rng";
import { appendHistory } from "@/lib/storage";
import {
  analyzeCharacters,
  buildRenderedWords,
  canAdvanceWord,
  chunkWordsByVisualRows,
  createWordSequence,
  getActiveRowIndex,
} from "@/lib/typing-engine";
import { cn } from "@/lib/utils";
import { TIME_OPTIONS, WORD_OPTIONS } from "@/types/settings";
import type { StoredTestResult, WpmSample } from "@/types";

type SessionStatus = "idle" | "running" | "finished";

interface FinalizeOptions {
  elapsedMs?: number;
  committedWords?: string[];
  currentWordIndex?: number;
  currentInput?: string;
}

function formatRemainingTime(remainingMs: number): string {
  const totalSeconds = Math.max(Math.ceil(remainingMs / 1000), 0);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function isPrintableKey(event: KeyboardEvent<HTMLInputElement>): boolean {
  return (
    event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey
  );
}

export function TypingShell() {
  const { settings, updateSettings } = useSettings();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isComposingRef = useRef(false);
  const finishedRef = useRef(false);
  const lastSampleSecondRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const finalizeSessionRef = useRef<(opts?: FinalizeOptions) => void>(() => {});

  const [seed, setSeed] = useState(() => generateSeed());
  const [targetWords, setTargetWords] = useState<string[]>(() =>
    createWordSequence(settings, seed),
  );
  const [committedWords, setCommittedWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [samples, setSamples] = useState<WpmSample[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [result, setResult] = useState<StoredTestResult | null>(null);
  const [stopOnWordBlocked, setStopOnWordBlocked] = useState(false);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const playKeyClick = useCallback(() => {
    if (!settings.sound || typeof window === "undefined") {
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioCtx) {
        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "square";
      oscillator.frequency.value = 880;
      gain.gain.value = 0.02;

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.015);
    } catch {
      // Sound is optional, so audio failures can be ignored.
    }
  }, [settings.sound]);

  const resetSession = useCallback(() => {
    const nextSeed = generateSeed();
    const nextWords = createWordSequence(settings, nextSeed);

    finishedRef.current = false;
    lastSampleSecondRef.current = 0;

    setSeed(nextSeed);
    setTargetWords(nextWords);
    setCommittedWords([]);
    setCurrentWordIndex(0);
    setCurrentInput("");
    setStatus("idle");
    setStartedAt(null);
    setElapsedMs(0);
    setSamples([]);
    setResult(null);
    setShowResultDialog(false);
    setStopOnWordBlocked(false);

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        focusInput();
      });
    }
  }, [focusInput, settings]);

  const beginSession = useCallback(() => {
    if (status !== "idle") {
      return;
    }

    setStatus("running");
    setStartedAt(Date.now());
    setElapsedMs(0);
  }, [status]);

  const finalizeSession = useCallback(
    ({
      elapsedMs: forcedElapsed,
      committedWords: forcedCommitted,
      currentWordIndex: forcedWordIndex,
      currentInput: forcedInput,
    }: FinalizeOptions = {}) => {
      if (finishedRef.current) {
        return;
      }

      const safeElapsed = Math.max(
        0,
        forcedElapsed ?? (startedAt ? Date.now() - startedAt : elapsedMs),
      );
      const finalCommitted = forcedCommitted ?? committedWords;
      const finalWordIndex = forcedWordIndex ?? currentWordIndex;
      const finalInput = forcedInput ?? currentInput;

      const analysis = analyzeCharacters(
        targetWords,
        finalCommitted,
        finalWordIndex,
        finalInput,
      );
      const metrics = calculateMetrics(analysis, safeElapsed);

      const nextResult: StoredTestResult = {
        id: `${Date.now()}-${seed}`,
        timestamp: new Date().toISOString(),
        mode: settings.mode,
        duration: settings.mode === "time" ? settings.duration : null,
        wordCount: settings.mode === "words" ? settings.wordCount : null,
        wordList: settings.wordList,
        seed,
        wpm: metrics.wpm,
        raw: metrics.rawWpm,
        accuracy: metrics.accuracy,
        errors: metrics.errors,
        correctChars: metrics.correctChars,
        incorrectChars: metrics.incorrectChars,
        typedChars: metrics.typedChars,
        samples,
        settingsSnapshot: {
          punctuation: settings.punctuation,
          numbers: settings.numbers,
          capitalize: settings.capitalize,
          stopOnWord: settings.stopOnWord,
        },
      };

      finishedRef.current = true;
      setStatus("finished");
      setElapsedMs(safeElapsed);
      setResult(nextResult);
      setShowResultDialog(true);
      appendHistory(nextResult);
    },
    [
      committedWords,
      currentInput,
      currentWordIndex,
      elapsedMs,
      samples,
      seed,
      settings.capitalize,
      settings.duration,
      settings.mode,
      settings.numbers,
      settings.punctuation,
      settings.stopOnWord,
      settings.wordCount,
      settings.wordList,
      startedAt,
      targetWords,
    ],
  );

  // Keep a stable ref to finalizeSession so the timer effect never has it
  // in its dependency array (which would create a setState → dep-change loop).
  useEffect(() => {
    finalizeSessionRef.current = finalizeSession;
  });

  useEffect(() => {
    if (status !== "running" || startedAt === null) {
      return;
    }

    const updateElapsed = () => {
      const nextElapsed = Date.now() - startedAt;
      setElapsedMs(nextElapsed);

      const second = Math.floor(nextElapsed / 1000);
      if (second > lastSampleSecondRef.current) {
        const runningAnalysis = analyzeCharacters(
          targetWords,
          committedWords,
          currentWordIndex,
          currentInput,
        );
        const runningMetrics = calculateMetrics(runningAnalysis, nextElapsed);

        lastSampleSecondRef.current = second;
        setSamples((prev) => [
          ...prev,
          {
            second,
            wpm: runningMetrics.wpm,
            rawWpm: runningMetrics.rawWpm,
            accuracy: runningMetrics.accuracy,
          },
        ]);
      }

      if (settings.mode === "time" && nextElapsed >= settings.duration * 1000) {
        finalizeSessionRef.current({ elapsedMs: settings.duration * 1000 });
      }
    };

    updateElapsed();
    const timer = window.setInterval(updateElapsed, 80);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    committedWords,
    currentInput,
    currentWordIndex,
    settings.duration,
    settings.mode,
    startedAt,
    status,
    targetWords,
  ]);

  const analysis = useMemo(
    () =>
      analyzeCharacters(
        targetWords,
        committedWords,
        currentWordIndex,
        currentInput,
      ),
    [committedWords, currentInput, currentWordIndex, targetWords],
  );

  const metrics = useMemo(
    () => calculateMetrics(analysis, elapsedMs),
    [analysis, elapsedMs],
  );

  const commitCurrentWord = useCallback(() => {
    if (status === "finished") {
      return;
    }

    const targetWord = targetWords[currentWordIndex] ?? "";
    if (!canAdvanceWord(targetWord, currentInput, settings.stopOnWord)) {
      setStopOnWordBlocked(true);
      return;
    }

    setStopOnWordBlocked(false);

    const nextCommitted = [...committedWords];
    nextCommitted[currentWordIndex] = currentInput;
    const nextWordIndex = currentWordIndex + 1;

    setCommittedWords(nextCommitted);
    setCurrentWordIndex(nextWordIndex);
    setCurrentInput("");

    if (settings.mode === "words" && nextWordIndex >= settings.wordCount) {
      finalizeSession({
        committedWords: nextCommitted,
        currentWordIndex: nextWordIndex,
        currentInput: "",
      });
    }
  }, [
    committedWords,
    currentInput,
    currentWordIndex,
    finalizeSession,
    settings.mode,
    settings.stopOnWord,
    settings.wordCount,
    status,
    targetWords,
  ]);

  const moveBackToPreviousWord = useCallback(() => {
    if (
      status === "finished" ||
      currentInput.length > 0 ||
      currentWordIndex === 0
    ) {
      return;
    }

    const previousIndex = currentWordIndex - 1;
    const previousTyped = committedWords[previousIndex] ?? "";

    setCurrentWordIndex(previousIndex);
    setCurrentInput(previousTyped);
    setCommittedWords(committedWords.slice(0, previousIndex));
  }, [committedWords, currentInput.length, currentWordIndex, status]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Tab" || (event.ctrlKey && event.key === "Enter")) {
        event.preventDefault();
        resetSession();
        return;
      }

      if (event.key === " " && !isComposingRef.current) {
        event.preventDefault();
        if (currentInput.length > 0) {
          beginSession();
          commitCurrentWord();
        }
        return;
      }

      if (
        event.key === "Backspace" &&
        !isComposingRef.current &&
        currentInput.length === 0 &&
        currentWordIndex > 0
      ) {
        event.preventDefault();
        moveBackToPreviousWord();
        return;
      }

      if (isPrintableKey(event)) {
        beginSession();
        playKeyClick();
      }
    },
    [
      beginSession,
      commitCurrentWord,
      currentInput.length,
      currentWordIndex,
      moveBackToPreviousWord,
      playKeyClick,
      resetSession,
    ],
  );

  const handleInputChange = useCallback(
    (value: string) => {
      if (status === "finished") {
        return;
      }

      if (isComposingRef.current) {
        setCurrentInput(value);
        return;
      }

      const sanitized = value.replace(/\s+/g, "");
      if (sanitized.length > 0) {
        beginSession();
      }

      setStopOnWordBlocked(false);
      setCurrentInput(sanitized);
    },
    [beginSession, status],
  );

  const renderedWords = useMemo(
    () =>
      buildRenderedWords(
        targetWords,
        committedWords,
        currentWordIndex,
        currentInput,
      ),
    [committedWords, currentInput, currentWordIndex, targetWords],
  );

  const rows = useMemo(
    () => chunkWordsByVisualRows(targetWords),
    [targetWords],
  );
  const activeRowIndex = useMemo(
    () => getActiveRowIndex(rows, currentWordIndex),
    [currentWordIndex, rows],
  );

  const [rowStart, rowEnd] = useMemo(() => {
    const start = Math.max(activeRowIndex - 1, 0);
    const end = Math.min(activeRowIndex + 1, rows.length - 1);
    return [start, end] as const;
  }, [activeRowIndex, rows.length]);

  const visibleRows = useMemo(
    () =>
      rows
        .slice(rowStart, rowEnd + 1)
        .map((indices) => indices.map((wordIndex) => renderedWords[wordIndex])),
    [renderedWords, rowEnd, rowStart, rows],
  );

  const activeVisibleRow = activeRowIndex - rowStart;
  const remainingMs =
    settings.mode === "time"
      ? Math.max(settings.duration * 1000 - elapsedMs, 0)
      : 0;

  const remainingLabel =
    settings.mode === "time"
      ? `Time left ${formatRemainingTime(remainingMs)}`
      : `${Math.max(settings.wordCount - currentWordIndex, 0)} words left`;

  const progressLabel =
    settings.mode === "time"
      ? `${currentWordIndex} words typed`
      : `Progress ${Math.min(currentWordIndex, settings.wordCount)}/${settings.wordCount}`;

  return (
    <div className="space-y-6">
      <section className="border-border/70 bg-card/50 space-y-4 rounded-xl border p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Tabs
            value={settings.mode}
            onValueChange={(value) => {
              const nextMode = value as "time" | "words";
              if (nextMode !== settings.mode) {
                updateSettings({ mode: nextMode });
              }
            }}
            className="w-full lg:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2 lg:w-[220px]">
              <TabsTrigger value="time">Time</TabsTrigger>
              <TabsTrigger value="words">Words</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center gap-2">
            {settings.mode === "time"
              ? TIME_OPTIONS.map((option) => (
                  <Button
                    key={option}
                    size="sm"
                    variant={
                      settings.duration === option ? "secondary" : "ghost"
                    }
                    onClick={() => updateSettings({ duration: option })}
                  >
                    {option}s
                  </Button>
                ))
              : WORD_OPTIONS.map((option) => (
                  <Button
                    key={option}
                    size="sm"
                    variant={
                      settings.wordCount === option ? "secondary" : "ghost"
                    }
                    onClick={() => updateSettings({ wordCount: option })}
                  >
                    {option}
                  </Button>
                ))}
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={settings.wordList}
              onValueChange={(value) => {
                const nextWordList = value as "english_1k" | "english_5k";
                if (nextWordList !== settings.wordList) {
                  updateSettings({
                    wordList: nextWordList,
                  });
                }
              }}
            >
              <SelectTrigger size="sm" className="w-[140px]">
                <SelectValue placeholder="Word list" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english_1k">English 1k</SelectItem>
                <SelectItem value="english_5k">English 5k</SelectItem>
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={resetSession}
                  aria-label="Restart test"
                >
                  <RotateCcw className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Restart (`Tab` or `Ctrl+Enter`)
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
          <div className="inline-flex items-center gap-1.5">
            <Keyboard className="size-3.5" />
            Hidden input capture enabled
          </div>
          <Separator orientation="vertical" className="h-4" />
          <span>Seed {seed || "-"}</span>
          {stopOnWordBlocked ? (
            <>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-destructive">
                Stop-on-word blocked: finish the current word first.
              </span>
            </>
          ) : null}
        </div>
      </section>

      <MetricsBar
        metrics={metrics}
        mode={settings.mode}
        remainingLabel={remainingLabel}
        progressLabel={progressLabel}
      />

      <div
        role="application"
        aria-label="Typing test area"
        onClick={focusInput}
        className={cn("relative rounded-2xl")}
      >
        <input
          ref={inputRef}
          value={currentInput}
          onChange={(event) => handleInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onCompositionStart={() => {
            isComposingRef.current = true;
            setIsComposing(true);
          }}
          onCompositionEnd={(event) => {
            isComposingRef.current = false;
            setIsComposing(false);
            handleInputChange(event.currentTarget.value);
          }}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
          aria-label="Hidden typing input"
          className="sr-only"
        />

        <TypingDisplay
          rows={visibleRows}
          activeVisibleRow={activeVisibleRow}
          isFocused={isFocused}
        />
      </div>

      <div className="text-muted-foreground text-xs">
        {isComposing ? "IME composition in progress" : ""}
      </div>

      <ResultsDialog
        open={showResultDialog}
        onOpenChange={setShowResultDialog}
        result={result}
        onRestart={resetSession}
      />
    </div>
  );
}
