"use client";

import * as React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

interface SavingsAreaChartProps {
  data: { month: string; balance: number }[];
  currency: string;
}

export function SavingsAreaChart({ data, currency }: SavingsAreaChartProps) {
  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4">
        <CardTitle>Bank balance</CardTitle>
        <p className="text-xl font-semibold tracking-tight text-foreground">Growth over time</p>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--saving))" stopOpacity={0.45} />
                <stop offset="100%" stopColor="hsl(var(--saving))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 6" vertical={false} />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCompactNumber(v)}
              width={44}
            />
            <Tooltip content={<ChartTooltip formatter={(n) => formatCurrency(n, currency)} />} />
            <Area
              type="monotone"
              dataKey="balance"
              name="Balance"
              stroke="hsl(var(--saving))"
              strokeWidth={2.5}
              fill="url(#balanceFill)"
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
