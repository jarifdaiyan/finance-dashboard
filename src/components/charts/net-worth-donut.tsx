"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";

interface DonutChartProps {
  categoryTotals: Record<"INVESTING" | "SPENDING" | "SAVING", number>;
  currency: string;
}

const CATEGORY_META = [
  { key: "INVESTING" as const, label: "Investing", color: "hsl(var(--investing))" },
  { key: "SPENDING" as const, label: "Spending", color: "hsl(var(--expense))" },
  { key: "SAVING" as const, label: "Saving", color: "hsl(var(--saving))" },
];

export function NetWorthDonut({ categoryTotals, currency }: DonutChartProps) {
  const data = CATEGORY_META.map((c) => ({ name: c.label, value: categoryTotals[c.key], color: c.color }));
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const isEmpty = total === 0;

  return (
    <Card className="col-span-1 flex flex-col p-6 lg:col-span-2">
      <CardHeader className="p-0 pb-4">
        <CardTitle>Net worth split</CardTitle>
        <p className="text-xl font-semibold tracking-tight text-foreground">Where your money lives</p>
      </CardHeader>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row">
        <div className="relative h-64 w-64 shrink-0">
          {isEmpty ? (
            <div className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-border text-center text-sm text-muted-foreground">
              Add your first transaction to see the split
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="72%"
                  outerRadius="100%"
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={450}
                  animationDuration={900}
                  animationEasing="ease-out"
                  stroke="none"
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip formatter={(n) => formatCurrency(n, currency)} />} />
              </PieChart>
            </ResponsiveContainer>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="text-xs text-muted-foreground">Total allocated</span>
            <span className="text-2xl font-semibold tracking-tight">
              {formatCurrency(total, currency).length > 12 ? `${currency} ${formatCompactNumber(total)}` : formatCurrency(total, currency)}
            </span>
          </motion.div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto">
          {CATEGORY_META.map((c) => {
            const value = categoryTotals[c.key];
            const pct = total > 0 ? (value / total) * 100 : 0;
            return (
              <div key={c.key} className="flex items-center justify-between gap-6 rounded-xl border border-border/60 px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-sm text-muted-foreground">{c.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(value, currency)}</p>
                  <p className="text-xs text-muted-foreground">{pct.toFixed(0)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
