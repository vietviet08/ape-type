"use client";

import { useEffect, type ReactNode } from "react";
import { useTheme } from "next-themes";

import { I18nProvider } from "@/components/i18n/I18nProvider";
import {
  SettingsProvider,
  useSettings,
} from "@/components/providers/settings-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

function ThemeSync() {
  const { settings, hydrated } = useSettings();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (theme === settings.theme) {
      return;
    }

    setTheme(settings.theme);
  }, [hydrated, setTheme, settings.theme, theme]);

  return null;
}

export function AppProviders({ children }: { readonly children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        <SettingsProvider>
          <TooltipProvider delayDuration={120}>
            <ThemeSync />
            {children}
          </TooltipProvider>
        </SettingsProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
