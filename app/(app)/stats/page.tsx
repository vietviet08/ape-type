import { PageIntro } from "@/components/i18n/page-intro";
import { StatsDashboard } from "@/components/typing/stats-dashboard";

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <PageIntro titleKey="stats.title" descriptionKey="stats.description" />

      <StatsDashboard />
    </div>
  );
}
