import { Caret } from "@/components/typing/caret";
import { cn } from "@/lib/utils";
import type { RenderedWord } from "@/types";

interface WordRowProps {
  words: RenderedWord[];
}

const STATE_CLASS_MAP: Record<string, string> = {
  pending: "text-muted-foreground/70",
  current: "text-foreground",
  correct: "text-foreground",
  incorrect: "text-destructive",
  missed: "text-destructive/70 underline decoration-destructive/60",
  extra: "text-destructive",
};

export function WordRow({ words }: WordRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 leading-9">
      {words.map((word) => {
        const needsTailCaret =
          word.isCurrent && word.typed.length >= word.target.length;

        return (
          <span
            key={`word-${word.index}`}
            data-current={word.isCurrent || undefined}
            className={cn(
              "group relative rounded-sm px-1 py-0.5 font-mono text-2xl tracking-tight transition-colors sm:text-3xl",
              word.isCurrent && "bg-muted/60",
            )}
            aria-current={word.isCurrent ? "true" : undefined}
          >
            {word.chars.map((char) => {
              const showCaret = word.isCurrent && char.state === "current";
              return (
                <span
                  key={`char-${word.index}-${char.index}`}
                  className={cn(
                    "relative inline-block min-w-[0.6ch] transition-colors",
                    STATE_CLASS_MAP[char.state],
                  )}
                >
                  {showCaret ? <Caret /> : null}
                  {char.value}
                </span>
              );
            })}
            {needsTailCaret ? (
              <span className="relative inline-block h-8 w-1 align-middle">
                <Caret />
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
