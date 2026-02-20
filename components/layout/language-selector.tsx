"use client";

import { useI18n } from "@/components/i18n/I18nProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isLanguage } from "@/lib/i18n";

export function LanguageSelector() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="min-w-[124px] sm:min-w-[150px]">
      <Select
        value={lang}
        onValueChange={(value) => {
          if (isLanguage(value)) {
            setLang(value);
          }
        }}
      >
        <SelectTrigger
          size="sm"
          className="h-8"
          aria-label={t("language.label")}
        >
          <SelectValue placeholder={t("language.label")} />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="en">{t("language.english")}</SelectItem>
          <SelectItem value="vi">{t("language.vietnamese")}</SelectItem>
          <SelectItem value="ja">{t("language.japanese")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
