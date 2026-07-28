"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

interface IncomeLineChartProps {
  data: { month: string; total: number }[];
  currency: string;
}

export function IncomeLineChart({ data, currency }: IncomeLineChartProps) {
  return (
    <Card className="p-6">
      <CardHeader className="p-0 pb-4">
        <CardTitle>Lifetime income</CardTitle>
        <p className="text-xl font-semibold tracking-tight text-foreground">Cumulative growth</p>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--accent))" />
                <stop offset="100%" stopColor="hsl(var(--income))" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 6" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCompactNumber(v)}
              width={44}
            />
            <Tooltip content={<ChartTooltip formatter={(n) => formatCurrency(n, currency)} />} />
            <Line
              type="monotone"
              dataKey="total"
              name="Lifetime income"
              stroke="url(#incomeLine)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0, fill: "hsl(var(--accent))" }}
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
