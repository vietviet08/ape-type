"use client";

import { usePathname } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";

export function AppFrameHeader() {
  const pathname = usePathname();
  return <AppHeader pathname={pathname} />;
}
