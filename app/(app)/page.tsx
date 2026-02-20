import { TypingIsland } from "@/components/typing/typing-island";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
          Typing Test
        </h1>
        <p className="text-muted-foreground text-sm">
          ApeType keeps the interface minimal while tracking speed, raw pace,
          and accuracy in real time.
        </p>
      </div>

      <TypingIsland />
    </div>
  );
}
