"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  trend?: number;
  icon: LucideIcon;
  currency: string;
  delay?: number;
  accentClass?: string;
}

export function StatCard({ label, value, trend, icon: Icon, currency, delay = 0, accentClass }: StatCardProps) {
  const positive = (trend ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="group relative overflow-hidden p-6 hover:shadow-glow-accent">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-surface-hover", accentClass)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <AnimatedNumber
            value={value}
            formatter={(n) => formatCurrency(n, currency)}
            className="text-3xl font-semibold tracking-tight"
          />
        </div>

        {trend !== undefined && (
          <div className={cn("mt-2 flex items-center gap-1 text-xs font-medium", positive ? "text-income" : "text-expense")}>
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            <span>
              {positive ? "+" : ""}
              {trend.toFixed(1)}% this month
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition-opacity duration-300 group-hover:opacity-80" />
      </Card>
    </motion.div>
  );
}
