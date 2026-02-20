"use client";

import { useTheme } from "next-themes";

import { useSettings } from "@/components/providers/settings-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TIME_OPTIONS, WORD_OPTIONS } from "@/types/settings";

export function SettingsPanel() {
  const { settings, hydrated, updateSettings, resetSettings } = useSettings();
  const { setTheme } = useTheme();

  if (!hydrated) {
    return (
      <Card>
        <CardContent className="text-muted-foreground p-6 text-sm">
          Loading settings...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/60">
        <CardHeader>
          <CardTitle className="font-mono text-xl">Test Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={settings.mode}
            onValueChange={(value) => {
              const nextMode = value as "time" | "words";
              if (nextMode !== settings.mode) {
                updateSettings({ mode: nextMode });
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-2 sm:w-[220px]">
              <TabsTrigger value="time">Time</TabsTrigger>
              <TabsTrigger value="words">Words</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            {(settings.mode === "time" ? TIME_OPTIONS : WORD_OPTIONS).map(
              (option) => {
                const isSelected = settings.mode === "time"
                  ? settings.duration === option
                  : settings.wordCount === option;
                return (
                <button
                  key={option}
                  type="button"
                  className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() =>
                    settings.mode === "time"
                      ? updateSettings({
                          duration: option as (typeof TIME_OPTIONS)[number],
                        })
                      : updateSettings({
                          wordCount: option as (typeof WORD_OPTIONS)[number],
                        })
                  }
                >
                  {settings.mode === "time" ? `${option}s` : option}
                </button>
              );
              },
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="text-muted-foreground text-sm">Word list</div>
              <Select
                value={settings.wordList}
                onValueChange={(value) => {
                  const nextWordList = value as "english_1k" | "english_5k";
                  if (nextWordList !== settings.wordList) {
                    updateSettings({
                      wordList: nextWordList,
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Word list" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english_1k">English 1k</SelectItem>
                  <SelectItem value="english_5k">English 5k</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-muted-foreground text-sm">Theme</div>
              <Select
                value={settings.theme}
                onValueChange={(value) => {
                  const nextTheme = value as "dark" | "light" | "system";
                  if (nextTheme !== settings.theme) {
                    updateSettings({ theme: nextTheme });
                    setTheme(nextTheme);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/60">
        <CardHeader>
          <CardTitle className="font-mono text-xl">Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingSwitch
            title="Punctuation"
            description="Append random punctuation marks to words."
            checked={settings.punctuation}
            onCheckedChange={(checked) =>
              updateSettings({ punctuation: checked })
            }
          />
          <Separator />
          <SettingSwitch
            title="Numbers"
            description="Inject short digit groups into random words."
            checked={settings.numbers}
            onCheckedChange={(checked) => updateSettings({ numbers: checked })}
          />
          <Separator />
          <SettingSwitch
            title="Capitalize"
            description="Apply sentence casing across generated words."
            checked={settings.capitalize}
            onCheckedChange={(checked) =>
              updateSettings({ capitalize: checked })
            }
          />
          <Separator />
          <SettingSwitch
            title="Stop on word"
            description="Prevent advancing if the current word is incorrect."
            checked={settings.stopOnWord}
            onCheckedChange={(checked) =>
              updateSettings({ stopOnWord: checked })
            }
          />
          <Separator />
          <SettingSwitch
            title="Key sound"
            description="Play a subtle click on each printable key press."
            checked={settings.sound}
            onCheckedChange={(checked) => updateSettings({ sound: checked })}
          />
        </CardContent>
      </Card>

      <div className="border-border/70 bg-card/60 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
        <div className="space-y-1">
          <p className="font-medium">Storage</p>
          <p className="text-muted-foreground text-sm">
            Settings are versioned and persisted in localStorage.
          </p>
        </div>
        <button
          type="button"
          className="border-border text-muted-foreground hover:text-foreground rounded-md border px-3 py-2 text-sm transition-colors"
          onClick={resetSettings}
        >
          Reset to defaults
        </button>
      </div>

      <Badge
        variant="secondary"
        className="font-mono text-xs tracking-[0.12em]"
      >
        schema v{settings.version}
      </Badge>
    </div>
  );
}

interface SettingSwitchProps {
  readonly title: string;
  readonly description: string;
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
}

function SettingSwitch({
  title,
  description,
  checked,
  onCheckedChange,
}: SettingSwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={title}
      />
    </div>
  );
}
