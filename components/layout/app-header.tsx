import Link from "next/link";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Test" },
  { href: "/settings", label: "Settings" },
  { href: "/stats", label: "Stats" },
  { href: "/about", label: "About" },
] as const;

export function AppHeader({ pathname }: { readonly pathname?: string }) {
  return (
    <header className="border-border/60 bg-background/90 sticky top-0 z-30 border-b backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-foreground font-mono text-lg font-semibold tracking-wide"
          >
            ApeType
          </Link>
          <nav aria-label="Primary" className="hidden gap-1 sm:flex">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    active && "bg-muted text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
