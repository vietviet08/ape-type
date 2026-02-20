"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutContent() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1">
        <h1 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("about.title")}
        </h1>
        <p className="text-muted-foreground text-sm">{t("about.description")}</p>
      </div>

      <Card className="border-border/70 bg-card/60">
        <CardHeader>
          <CardTitle className="font-mono text-xl">{t("about.card.title")}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3 text-sm">
          <p>{t("about.card.body1")}</p>
          <p>{t("about.card.body2")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
