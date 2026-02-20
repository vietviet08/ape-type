import { en, type LocaleDictionary } from "@/lib/i18n/locales/en";
import { ja } from "@/lib/i18n/locales/ja";
import { vi } from "@/lib/i18n/locales/vi";

export const LANGUAGES = ["en", "vi", "ja"] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGE_STORAGE_KEY = "apetype.lang";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]>;
};

type DotJoin<Prefix extends string, Suffix extends string> = Prefix extends ""
  ? Suffix
  : `${Prefix}.${Suffix}`;

type LeafPaths<T, Prefix extends string = ""> = T extends string
  ? Prefix
  : {
      [K in Extract<keyof T, string>]: LeafPaths<T[K], DotJoin<Prefix, K>>;
    }[Extract<keyof T, string>];

export type TranslationKey = LeafPaths<LocaleDictionary>;

export type TranslationParams = Record<string, string | number>;

const dictionaries = {
  en,
  vi,
  ja,
} satisfies Record<Language, DeepPartial<LocaleDictionary>>;

export function isLanguage(value: string | null | undefined): value is Language {
  return value === "en" || value === "vi" || value === "ja";
}

function getMessage(
  dictionary: DeepPartial<LocaleDictionary>,
  key: TranslationKey,
): string | undefined {
  const segments = key.split(".");
  let cursor: unknown = dictionary;

  for (const segment of segments) {
    if (!cursor || typeof cursor !== "object") {
      return undefined;
    }

    cursor = (cursor as Record<string, unknown>)[segment];
  }

  return typeof cursor === "string" ? cursor : undefined;
}

function interpolate(
  template: string,
  params?: TranslationParams,
): string {
  return template.replaceAll(/\{(\w+)\}/g, (_, token: string) => {
    if (!params || !(token in params)) {
      return `{${token}}`;
    }

    return String(params[token]);
  });
}

export function translate(
  lang: Language,
  key: TranslationKey,
  params?: TranslationParams,
): string {
  const message = getMessage(dictionaries[lang], key) ?? getMessage(en, key);
  if (!message) {
    return key;
  }

  return interpolate(message, params);
}
