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
  return (
    <div className="border-border/70 bg-card/70 rounded-xl border px-4 py-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Badge
          variant="secondary"
          className="font-mono text-xs tracking-[0.12em] uppercase"
        >
          {mode}
        </Badge>
        <span className="text-primary font-mono text-2xl">{metrics.wpm}</span>
        <span className="text-muted-foreground text-xs">WPM</span>
        <Separator orientation="vertical" className="h-5" />
        <span className="font-mono text-base">Raw {metrics.rawWpm}</span>
        <Separator orientation="vertical" className="h-5" />
        <span className="font-mono text-base">Acc {metrics.accuracy}%</span>
        <Separator orientation="vertical" className="h-5" />
        <span className="font-mono text-base">Err {metrics.errors}</span>
      </div>
      <div className="text-muted-foreground mt-2 flex flex-wrap gap-4 text-xs">
        <span>{remainingLabel}</span>
        <span>{progressLabel}</span>
      </div>
    </div>
  );
}
