"use client";

import * as React from "react";
import { financeEvents } from "@/lib/events";
import type { DashboardStats } from "@/types";

export function useStats() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    const res = await fetch("/api/stats", { cache: "no-store" });
    const data = await res.json();
    setStats(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    refresh();
    return financeEvents.subscribe(refresh);
  }, [refresh]);

  return { stats, loading, refresh };
}
