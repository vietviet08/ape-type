"use client";

import dynamic from "next/dynamic";

import { useSettings } from "@/components/providers/settings-provider";
import { TypingErrorBoundary } from "@/components/typing/typing-error-boundary";
import { Card, CardContent } from "@/components/ui/card";

const TypingShell = dynamic(
  () =>
    import("@/components/typing/typing-shell").then(
      (module) => module.TypingShell,
    ),
  {
    ssr: false,
    loading: () => (
      <Card className="border-border/70 bg-card/50">
        <CardContent className="text-muted-foreground p-8 text-sm">
          Loading typing engine...
        </CardContent>
      </Card>
    ),
  },
);

export function TypingIsland() {
  const { settings, hydrated } = useSettings();
  const sessionKey = [
    settings.mode,
    settings.duration,
    settings.wordCount,
    settings.wordList,
    settings.punctuation,
    settings.numbers,
    settings.capitalize,
    settings.stopOnWord,
  ].join(":");

  if (!hydrated) {
    return (
      <Card className="border-border/70 bg-card/50">
        <CardContent className="text-muted-foreground p-8 text-sm">
          Loading typing engine...
        </CardContent>
      </Card>
    );
  }

  return (
    <TypingErrorBoundary>
      <TypingShell key={sessionKey} />
    </TypingErrorBoundary>
  );
}
