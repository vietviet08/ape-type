import { AppFrameHeader } from "@/components/layout/app-frame-header";
import { Container } from "@/components/layout/container";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AppFrameHeader />
      <main className="relative flex-1 py-10">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
