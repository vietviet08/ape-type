"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import type { TranslationKey } from "@/lib/i18n";

interface PageIntroProps {
  readonly titleKey: TranslationKey;
  readonly descriptionKey: TranslationKey;
}

export function PageIntro({ titleKey, descriptionKey }: PageIntroProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-1">
      <h1 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
        {t(titleKey)}
      </h1>
      <p className="text-muted-foreground text-sm">{t(descriptionKey)}</p>
    </div>
  );
}
