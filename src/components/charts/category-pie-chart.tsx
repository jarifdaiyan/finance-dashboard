"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { formatCurrency } from "@/lib/utils";

interface CategoryPieChartProps {
  categoryTotals: Record<"INVESTING" | "SPENDING" | "SAVING", number>;
  currency: string;
}

const META = [
  { key: "INVESTING" as const, label: "Investing", color: "hsl(var(--investing))" },
  { key: "SPENDING" as const, label: "Spending", color: "hsl(var(--expense))" },
  { key: "SAVING" as const, label: "Saving", color: "hsl(var(--saving))" },
];

export function CategoryPieChart({ categoryTotals, currency }: CategoryPieChartProps) {
  const data = META.map((m) => ({ name: m.label, value: categoryTotals[m.key], color: m.color }));
  const isEmpty = data.every((d) => d.value === 0);

  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4">
        <CardTitle>Category distribution</CardTitle>
        <p className="text-xl font-semibold tracking-tight text-foreground">Allocation share</p>
      </CardHeader>
      <div className="h-64">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Nothing to distribute yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius="80%" animationDuration={900} stroke="none">
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip formatter={(n) => formatCurrency(n, currency)} />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
