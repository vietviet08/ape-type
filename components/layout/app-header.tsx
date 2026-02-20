"use client";

import Link from "next/link";

import { useI18n } from "@/components/i18n/I18nProvider";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Container } from "@/components/layout/container";
import { LanguageSelector } from "@/components/layout/language-selector";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", labelKey: "nav.typing" },
  { href: "/settings", labelKey: "nav.settings" },
  { href: "/stats", labelKey: "nav.stats" },
  { href: "/about", labelKey: "nav.about" },
] as const;

export function AppHeader({ pathname }: { readonly pathname?: string }) {
  const { t } = useI18n();

  return (
    <header className="border-border/60 bg-background/90 sticky top-0 z-30 border-b backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-foreground font-mono text-lg font-semibold tracking-wide"
          >
            {t("app.name")}
          </Link>
          <nav aria-label={t("nav.primaryAria")} className="hidden gap-1 sm:flex">
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
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
