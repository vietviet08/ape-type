"use client";

import { AlertTriangle } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TypingErrorBoundary({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Card className="border-destructive/30 bg-card/80">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2 text-lg">
              <AlertTriangle className="size-5" />
              Typing engine crashed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              {error instanceof Error ? error.message : "Unexpected error."}
            </p>
            <Button onClick={resetErrorBoundary}>Try Again</Button>
          </CardContent>
        </Card>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
