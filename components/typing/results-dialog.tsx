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

interface ResultsDialogProps {
  open: boolean;
  result: StoredTestResult | null;
  onOpenChange: (open: boolean) => void;
  onRestart: () => void;
}

export function ResultsDialog({
  open,
  result,
  onOpenChange,
  onRestart,
}: ResultsDialogProps) {
  const isClient = useIsClient();

  if (!result) {
    return null;
  }

  const data =
    result.samples.length > 0
      ? result.samples
      : [
          {
            second: 0,
            wpm: result.wpm,
            rawWpm: result.raw,
            accuracy: result.accuracy,
          },
        ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-2xl">
            Test Complete
          </DialogTitle>
          <DialogDescription>
            {new Date(result.timestamp).toLocaleString()} -{" "}
            {result.mode === "time"
              ? `${result.duration}s`
              : `${result.wordCount} words`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-4">
          <MetricCard label="WPM" value={result.wpm.toFixed(2)} />
          <MetricCard label="Raw WPM" value={result.raw.toFixed(2)} />
          <MetricCard
            label="Accuracy"
            value={`${result.accuracy.toFixed(2)}%`}
          />
          <MetricCard label="Errors" value={String(result.errors)} />
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
                  name="WPM"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="rawWpm"
                  name="Raw"
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
          <Button onClick={onRestart}>Restart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border/70 bg-card/80 rounded-lg border p-3">
      <div className="text-muted-foreground text-xs tracking-[0.12em] uppercase">
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl">{value}</div>
    </div>
  );
}
