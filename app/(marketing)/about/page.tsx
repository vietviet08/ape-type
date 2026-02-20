import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1">
        <h1 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
          About ApeType
        </h1>
        <p className="text-muted-foreground text-sm">
          ApeType is an original typing test experience inspired by minimalist
          speed trainers.
        </p>
      </div>

      <Card className="border-border/70 bg-card/60">
        <CardHeader>
          <CardTitle className="font-mono text-xl">Built for flow</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3 text-sm">
          <p>
            The interface keeps visual noise low while preserving precision
            feedback: current character, word-level correctness, real-time WPM,
            and end-of-test trends.
          </p>
          <p>
            Tests are reproducible via seeds, settings persist locally, and all
            stats stay on your device unless you explicitly export them.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
