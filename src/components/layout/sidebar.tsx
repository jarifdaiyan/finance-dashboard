"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Download,
  Settings as SettingsIcon,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/export", label: "Export", icon: Download },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 240 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border/70 bg-surface/40 backdrop-blur-xl md:flex"
    >
      <div className={cn("flex items-center gap-2 px-5 py-6", collapsed && "justify-center px-0")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent shadow-glow-accent">
          <Sparkles className="h-4 w-4 text-accent-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">DAIYAN FINANCE</span>
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-accent">
              The Untouchable Empire
            </span>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent/15 text-accent"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("h-4.5 w-4.5 h-[18px] w-[18px] shrink-0", active && "text-accent")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className={cn(
          "mx-3 mb-5 flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground",
          collapsed && "justify-center px-0"
        )}
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </motion.aside>
  );
}
