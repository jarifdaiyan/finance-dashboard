"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NetWorthDonut } from "@/components/charts/net-worth-donut";
import { IncomeLineChart } from "@/components/charts/income-line-chart";
import { MonthBarChart } from "@/components/charts/month-bar-chart";
import { SavingsAreaChart } from "@/components/charts/savings-area-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { useStats } from "@/hooks/use-stats";
import { useSettings } from "@/components/settings-provider";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const { stats, loading } = useStats();
  const { currency } = useSettings();

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  const netFlow = stats.lifetimeIncome - stats.totalExpenses;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Total inflow</p>
          <p className="mt-1 text-xl font-semibold text-income">{formatCurrency(stats.lifetimeIncome, currency)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Total outflow</p>
          <p className="mt-1 text-xl font-semibold text-expense">{formatCurrency(stats.totalExpenses, currency)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-muted-foreground">Net position</p>
          <p className={`mt-1 text-xl font-semibold ${netFlow >= 0 ? "text-income" : "text-expense"}`}>
            {formatCurrency(netFlow, currency)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <IncomeLineChart data={stats.lifetimeIncomeSeries} currency={currency} />
        <SavingsAreaChart data={stats.savingsGrowthSeries} currency={currency} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NetWorthDonut categoryTotals={stats.categoryTotals} currency={currency} />
        </div>
        <CategoryPieChart categoryTotals={stats.categoryTotals} currency={currency} />
      </div>

      <MonthBarChart data={stats.currentMonthBreakdown} currency={currency} />
    </div>
  );
}
