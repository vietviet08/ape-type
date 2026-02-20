import { PageIntro } from "@/components/i18n/page-intro";
import { TypingIsland } from "@/components/typing/typing-island";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageIntro titleKey="typing.title" descriptionKey="typing.description" />

      <TypingIsland />
    </div>
  );
}
