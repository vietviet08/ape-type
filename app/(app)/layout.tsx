import { AppFrameHeader } from "@/components/layout/app-frame-header";
import { Container } from "@/components/layout/container";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(95,124,214,0.16),_transparent_50%)]"
        aria-hidden
      />
      <AppFrameHeader />
      <main className="relative flex-1 py-8 sm:py-10">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
