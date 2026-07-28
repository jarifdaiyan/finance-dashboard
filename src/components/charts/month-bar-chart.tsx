"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

interface MonthBarChartProps {
  data: { name: string; income: number; expense: number }[];
  currency: string;
}

export function MonthBarChart({ data, currency }: MonthBarChartProps) {
  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4">
        <CardTitle>This month</CardTitle>
        <p className="text-xl font-semibold tracking-tight text-foreground">Income vs. expenses</p>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }} barGap={8}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 6" vertical={false} />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCompactNumber(v)}
              width={44}
            />
            <Tooltip content={<ChartTooltip formatter={(n) => formatCurrency(n, currency)} />} cursor={{ fill: "hsl(var(--surface-hover))" }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
            />
            <Bar dataKey="income" name="Income" fill="hsl(var(--income))" radius={[8, 8, 0, 0]} animationDuration={800} />
            <Bar dataKey="expense" name="Expenses" fill="hsl(var(--expense))" radius={[8, 8, 0, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
