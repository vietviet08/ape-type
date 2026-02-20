"use client";

import { useTheme } from "next-themes";

import { useI18n } from "@/components/i18n/I18nProvider";
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
import {
  TIME_OPTIONS,
  WORD_OPTIONS,
  type WordListName,
} from "@/types/settings";

export function SettingsPanel() {
  const { settings, hydrated, updateSettings, resetSettings } = useSettings();
  const { setTheme } = useTheme();
  const { t } = useI18n();

  if (!hydrated) {
    return (
      <Card>
        <CardContent className="text-muted-foreground p-6 text-sm">
          {t("settings.loading")}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/60">
        <CardHeader>
          <CardTitle className="font-mono text-xl">
            {t("settings.mode.title")}
          </CardTitle>
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
            <TabsList
              className="grid w-full grid-cols-2 sm:w-[220px]"
              aria-label={t("typing.mode.label")}
            >
              <TabsTrigger value="time">{t("typing.mode.time")}</TabsTrigger>
              <TabsTrigger value="words">{t("typing.mode.words")}</TabsTrigger>
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
                  {settings.mode === "time"
                    ? t("stats.target.seconds", { count: option })
                    : option}
                </button>
              );
              },
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="text-muted-foreground text-sm">
                {t("settings.wordList.label")}
              </div>
              <Select
                value={settings.wordList}
                onValueChange={(value) => {
                  const nextWordList = value as WordListName;
                  if (nextWordList !== settings.wordList) {
                    updateSettings({
                      wordList: nextWordList,
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("settings.wordList.label")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english_1k">
                    {t("typing.wordList.english1k")}
                  </SelectItem>
                  <SelectItem value="english_5k">
                    {t("typing.wordList.english5k")}
                  </SelectItem>
                  <SelectItem value="vietnamese_core">
                    {t("typing.wordList.vietnameseCore")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-muted-foreground text-sm">
                {t("settings.theme.label")}
              </div>
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
                  <SelectValue placeholder={t("settings.theme.label")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">{t("settings.theme.dark")}</SelectItem>
                  <SelectItem value="light">{t("settings.theme.light")}</SelectItem>
                  <SelectItem value="system">{t("settings.theme.system")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/60">
        <CardHeader>
          <CardTitle className="font-mono text-xl">
            {t("settings.behavior.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingSwitch
            title={t("settings.behavior.punctuation.label")}
            description={t("settings.behavior.punctuation.description")}
            checked={settings.punctuation}
            onCheckedChange={(checked) =>
              updateSettings({ punctuation: checked })
            }
          />
          <Separator />
          <SettingSwitch
            title={t("settings.behavior.numbers.label")}
            description={t("settings.behavior.numbers.description")}
            checked={settings.numbers}
            onCheckedChange={(checked) => updateSettings({ numbers: checked })}
          />
          <Separator />
          <SettingSwitch
            title={t("settings.behavior.capitalize.label")}
            description={t("settings.behavior.capitalize.description")}
            checked={settings.capitalize}
            onCheckedChange={(checked) =>
              updateSettings({ capitalize: checked })
            }
          />
          <Separator />
          <SettingSwitch
            title={t("settings.behavior.stopOnWord.label")}
            description={t("settings.behavior.stopOnWord.description")}
            checked={settings.stopOnWord}
            onCheckedChange={(checked) =>
              updateSettings({ stopOnWord: checked })
            }
          />
          <Separator />
          <SettingSwitch
            title={t("settings.sound.label")}
            description={t("settings.sound.description")}
            checked={settings.sound}
            onCheckedChange={(checked) => updateSettings({ sound: checked })}
          />
        </CardContent>
      </Card>

      <div className="border-border/70 bg-card/60 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
        <div className="space-y-1">
          <p className="font-medium">{t("settings.storage.title")}</p>
          <p className="text-muted-foreground text-sm">
            {t("settings.storage.description")}
          </p>
        </div>
        <button
          type="button"
          className="border-border text-muted-foreground hover:text-foreground rounded-md border px-3 py-2 text-sm transition-colors"
          onClick={resetSettings}
        >
          {t("settings.reset")}
        </button>
      </div>

      <Badge
        variant="secondary"
        className="font-mono text-xs tracking-[0.12em]"
      >
        {t("settings.schema", { version: settings.version })}
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
