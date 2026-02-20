"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { LiveMetrics } from "@/types";

interface MetricsBarProps {
  metrics: LiveMetrics;
  mode: "time" | "words";
  remainingLabel: string;
  progressLabel: string;
}

export function MetricsBar({
  metrics,
  mode,
  remainingLabel,
  progressLabel,
}: MetricsBarProps) {
  const { t } = useI18n();

  return (
    <div className="border-border/70 bg-card/70 rounded-xl border px-4 py-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Badge
          variant="secondary"
          className="font-mono text-xs tracking-[0.12em] uppercase"
        >
          {mode === "time" ? t("typing.mode.time") : t("typing.mode.words")}
        </Badge>
        <span className="text-primary font-mono text-2xl">{metrics.wpm}</span>
        <span className="text-muted-foreground text-xs">
          {t("typing.result.wpm")}
        </span>
        <Separator orientation="vertical" className="h-5" />
        <span className="font-mono text-base">
          {t("typing.result.raw")} {metrics.rawWpm}
        </span>
        <Separator orientation="vertical" className="h-5" />
        <span className="font-mono text-base">
          {t("typing.result.accuracy")} {metrics.accuracy}%
        </span>
        <Separator orientation="vertical" className="h-5" />
        <span className="font-mono text-base">
          {t("typing.result.errors")} {metrics.errors}
        </span>
      </div>
      <div className="text-muted-foreground mt-2 flex flex-wrap gap-4 text-xs">
        <span>{remainingLabel}</span>
        <span>{progressLabel}</span>
      </div>
    </div>
  );
}
