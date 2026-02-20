"use client";

import { useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  exportHistory,
  importHistory,
  loadHistory,
  saveHistory,
} from "@/lib/storage";
import { useIsClient } from "@/hooks/use-is-client";
import type { StoredTestResult } from "@/types";

export function StatsDashboard() {
  const isClient = useIsClient();
  const [results, setResults] = useState<StoredTestResult[]>(() =>
    loadHistory(),
  );
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const chartData = useMemo(
    () =>
      [...results].reverse().map((result, index) => ({
        index: index + 1,
        wpm: Number(result.wpm.toFixed(2)),
        accuracy: Number(result.accuracy.toFixed(2)),
        timestamp: new Date(result.timestamp).toLocaleTimeString(),
      })),
    [results],
  );

  const handleExport = () => {
    const payload = exportHistory();
    const blob = new Blob([payload], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ape-type-stats-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File | null) => {
    if (!file) {
      return;
    }

    setImportError(null);
    try {
      const text = await file.text();
      const imported = importHistory(text);
      setResults(imported);
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Failed to import stats.",
      );
    }
  };

  const handleClear = () => {
    saveHistory([]);
    setResults([]);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/60">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="font-mono text-xl">Performance Trend</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Import JSON
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={results.length === 0}
            >
              Export JSON
            </Button>
            <Button
              variant="ghost"
              onClick={handleClear}
              disabled={results.length === 0}
            >
              Clear
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                void handleImport(file);
                event.currentTarget.value = "";
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border-border/70 bg-muted/20 h-64 rounded-lg border p-2">
            {isClient ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 16, right: 16, bottom: 0, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="index"
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
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
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

          {importError ? (
            <p className="text-destructive text-sm">{importError}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/60">
        <CardHeader>
          <CardTitle className="font-mono text-xl">
            Recent Tests ({results.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-border/70 max-h-[420px] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>WPM</TableHead>
                  <TableHead>Raw</TableHead>
                  <TableHead>Acc</TableHead>
                  <TableHead>Errors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-muted-foreground text-center"
                    >
                      No tests recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        {new Date(result.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{result.mode}</TableCell>
                      <TableCell>
                        {result.mode === "time"
                          ? `${result.duration}s`
                          : `${result.wordCount} words`}
                      </TableCell>
                      <TableCell>{result.wpm.toFixed(2)}</TableCell>
                      <TableCell>{result.raw.toFixed(2)}</TableCell>
                      <TableCell>{result.accuracy.toFixed(2)}%</TableCell>
                      <TableCell>{result.errors}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
