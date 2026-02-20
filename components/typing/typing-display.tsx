import { cn } from "@/lib/utils";
import type { RenderedWord } from "@/types";

import { WordRow } from "@/components/typing/word-row";

interface TypingDisplayProps {
  rows: RenderedWord[][];
  activeVisibleRow: number;
  isFocused: boolean;
}

export function TypingDisplay({
  rows,
  activeVisibleRow,
  isFocused,
}: TypingDisplayProps) {
  return (
    <section
      aria-label="Typing prompt"
      className="border-border/70 bg-card/70 relative rounded-2xl border p-4 shadow-[0_16px_48px_rgba(0,0,0,0.25)] backdrop-blur sm:p-6"
    >
      <div className="space-y-3">
        {rows.map((rowWords, rowIndex) => {
          const isActive = rowIndex === activeVisibleRow;
          return (
            <div
              key={`row-${rowWords[0]?.index ?? rowIndex}`}
              className={cn(
                "transition-all duration-200",
                isActive ? "opacity-100" : "translate-y-[2px] opacity-45",
              )}
            >
              <WordRow words={rowWords} />
            </div>
          );
        })}
      </div>

      {!isFocused ? (
        <p className="text-muted-foreground pointer-events-none absolute right-4 bottom-3 text-xs sm:hidden">
          Tap to focus
        </p>
      ) : null}
    </section>
  );
}
