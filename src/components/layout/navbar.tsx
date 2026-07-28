"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useTransactionModal } from "@/components/transactions/transaction-modal-provider";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Your complete financial picture, at a glance." },
  "/transactions": { title: "Transactions", subtitle: "Every entry, searchable and editable." },
  "/analytics": { title: "Analytics", subtitle: "Trends across income, spending, and growth." },
  "/export": { title: "Export", subtitle: "Take your data with you." },
  "/settings": { title: "Settings", subtitle: "Currency, appearance, and defaults." },
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { openCreate } = useTransactionModal();
  const meta = TITLES[pathname] ?? TITLES["/"];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/70 bg-background/70 px-5 py-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{meta.title}</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New transaction</span>
          <span className="ml-1 hidden rounded-md border border-white/20 px-1.5 py-0.5 text-[10px] font-normal opacity-80 sm:inline">
            N
          </span>
        </Button>
        <Button onClick={handleLogout} size="icon" variant="ghost" aria-label="Log out" title="Log out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
