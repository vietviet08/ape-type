"use client";

import dynamic from "next/dynamic";

import { useI18n } from "@/components/i18n/I18nProvider";
import { useSettings } from "@/components/providers/settings-provider";
import { TypingErrorBoundary } from "@/components/typing/typing-error-boundary";
import { Card, CardContent } from "@/components/ui/card";

function TypingIslandLoading() {
  const { t } = useI18n();

  return (
    <Card className="border-border/70 bg-card/50">
      <CardContent className="text-muted-foreground p-8 text-sm">
        {t("typing.loading.engine")}
      </CardContent>
    </Card>
  );
}

const TypingShell = dynamic(
  () =>
    import("@/components/typing/typing-shell").then(
      (module) => module.TypingShell,
    ),
  {
    ssr: false,
    loading: TypingIslandLoading,
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
    return <TypingIslandLoading />;
  }

  return (
    <TypingErrorBoundary>
      <TypingShell key={sessionKey} />
    </TypingErrorBoundary>
  );
}
