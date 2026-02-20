import english1k from "@/lib/wordlists/english_1k.json";
import english5k from "@/lib/wordlists/english_5k.json";

export const WORDLIST_MAP = {
  english_1k: english1k,
  english_5k: english5k,
} as const;
