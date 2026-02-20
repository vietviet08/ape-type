"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/components/providers/settings-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { updateSettings } = useSettings();
  const { t } = useI18n();

  const isDark = resolvedTheme !== "light";

  const handleToggle = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    updateSettings({ theme: next });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("common.theme.toggle")}
      onClick={handleToggle}
      className="text-muted-foreground hover:text-foreground"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
