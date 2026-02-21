"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useIsClient } from "@/hooks/use-is-client";
import type { StoredTestResult } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/components/i18n/I18nProvider";

interface ResultsDialogProps {
  readonly open: boolean;
  readonly result: StoredTestResult | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onRestart: () => void;
}

export function ResultsDialog({
  open,
  result,
  onOpenChange,
  onRestart,
}: ResultsDialogProps) {
  const isClient = useIsClient();
  const { t } = useI18n();

  if (!result) {
    return null;
  }

  const data =
    result.samples.length > 0
      ? result.samples.map((sample) => ({
          ...sample,
          wpm: Math.round(sample.wpm),
          rawWpm: Math.round(sample.rawWpm),
          accuracy: Math.round(sample.accuracy),
        }))
      : [
          {
            second: 0,
            wpm: Math.round(result.wpm),
            rawWpm: Math.round(result.raw),
            accuracy: Math.round(result.accuracy),
          },
        ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          const content = event.currentTarget as HTMLElement;
          content.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-mono text-2xl">
            {t("typing.result.title")}
          </DialogTitle>
          <DialogDescription>
            {new Date(result.timestamp).toLocaleString()} -{" "}
            {result.mode === "time"
              ? t("stats.target.seconds", { count: result.duration ?? 0 })
              : t("stats.target.words", { count: result.wordCount ?? 0 })}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-4">
          <MetricCard label={t("typing.result.wpm")} value={String(Math.round(result.wpm))} />
          <MetricCard label={t("typing.result.raw")} value={String(Math.round(result.raw))} />
          <MetricCard
            label={t("typing.result.accuracy")}
            value={`${Math.round(result.accuracy)}%`}
          />
          <MetricCard label={t("typing.result.errors")} value={String(result.errors)} />
        </div>

        <div className="border-border/70 bg-muted/20 h-64 rounded-lg border p-2">
          {isClient ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 16, right: 16, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="second"
                  stroke="var(--color-muted-foreground)"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  name={t("typing.result.wpm")}
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="rawWpm"
                  name={t("typing.result.raw")}
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="bg-muted h-full animate-pulse rounded-md" />
          )}
        </div>

        <DialogFooter>
          <Button onClick={onRestart}>{t("typing.result.restart")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MetricCard({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="border-border/70 bg-card/80 rounded-lg border p-3">
      <div className="text-muted-foreground text-xs tracking-[0.12em] uppercase">
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl">{value}</div>
    </div>
  );
}
