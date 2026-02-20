"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { loadSettings, saveSettings } from "@/lib/storage";
import { DEFAULT_SETTINGS } from "@/types/settings";
import type { ApeTypeSettings } from "@/types";

interface SettingsContextValue {
  settings: ApeTypeSettings;
  hydrated: boolean;
  updateSettings: (patch: Partial<ApeTypeSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [settings, setSettings] = useState<ApeTypeSettings>(() =>
    loadSettings(),
  );
  const hydrated = true;

  const updateSettings = useCallback(
    (patch: Partial<ApeTypeSettings>) => {
      setSettings((prev) => {
        const hasChanged = Object.keys(patch).some((key) => {
          const typedKey = key as keyof ApeTypeSettings;
          return prev[typedKey] !== patch[typedKey];
        });

        if (!hasChanged) {
          return prev;
        }

        const next = { ...prev, ...patch };
        saveSettings(next);
        return next;
      });
    },
    [],
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo(
    () => ({ settings, hydrated, updateSettings, resetSettings }),
    [hydrated, resetSettings, settings, updateSettings],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}
