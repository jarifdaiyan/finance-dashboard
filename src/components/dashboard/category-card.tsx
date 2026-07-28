"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, PiggyBank, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface CategoryGridProps {
  categoryTotals: Record<"INVESTING" | "SPENDING" | "SAVING", number>;
  currency: string;
}

const META: { key: "INVESTING" | "SPENDING" | "SAVING"; label: string; icon: LucideIcon; color: string }[] = [
  { key: "INVESTING", label: "Investing", icon: TrendingUp, color: "hsl(var(--investing))" },
  { key: "SPENDING", label: "Spending", icon: ShoppingBag, color: "hsl(var(--expense))" },
  { key: "SAVING", label: "Saving", icon: PiggyBank, color: "hsl(var(--saving))" },
];

function MiniGauge({ pct, color }: { pct: number; color: string }) {
  const size = 34;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

export function CategoryCardGrid({ categoryTotals, currency }: CategoryGridProps) {
  const total = META.reduce((sum, m) => sum + categoryTotals[m.key], 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {META.map((m, i) => {
        const value = categoryTotals[m.key];
        const pct = total > 0 ? (value / total) * 100 : 0;
        const Icon = m.icon;
        return (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${m.color}1a` }}
                >
                  <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" style={{ color: m.color }} />
                </div>
                <div>
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-lg font-semibold tracking-tight">{formatCurrency(value, currency)}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <MiniGauge pct={pct} color={m.color} />
                <span className="text-[10px] text-muted-foreground">{pct.toFixed(0)}%</span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
