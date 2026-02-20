import { PageIntro } from "@/components/i18n/page-intro";
import { SettingsPanel } from "@/components/typing/settings-panel";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        titleKey="settings.title"
        descriptionKey="settings.description"
      />

      <SettingsPanel />
    </div>
  );
}
