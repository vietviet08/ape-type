import { StatsDashboard } from "@/components/typing/stats-dashboard";

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
          Stats
        </h1>
        <p className="text-muted-foreground text-sm">
          ApeType stores your latest 50 tests locally and visualizes pace trends
          over time.
        </p>
      </div>

      <StatsDashboard />
    </div>
  );
}
