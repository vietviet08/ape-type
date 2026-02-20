import { SettingsPanel } from "@/components/typing/settings-panel";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Configure your test defaults and typing behavior. Changes are saved
          automatically.
        </p>
      </div>

      <SettingsPanel />
    </div>
  );
}
