"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroBanner } from "@/components/dashboard/hero-banner";
import { CircularStat } from "@/components/dashboard/circular-stat";
import { CategoryCardGrid } from "@/components/dashboard/category-card";
import { NetWorthDonut } from "@/components/charts/net-worth-donut";
import { IncomeLineChart } from "@/components/charts/income-line-chart";
import { MonthBarChart } from "@/components/charts/month-bar-chart";
import { SavingsAreaChart } from "@/components/charts/savings-area-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { useStats } from "@/hooks/use-stats";
import { useTransactions } from "@/hooks/use-transactions";
import { useSettings } from "@/components/settings-provider";

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useStats();
  const { transactions, loading: txLoading } = useTransactions({}, 6);
  const { currency } = useSettings();

  return (
    <div className="flex flex-col gap-6">
      <HeroBanner />

      {/* Ring stats -- the "front page" glance: income, expenses, balance, savings */}
      <Card className="p-6 sm:p-8">
        <CardHeader className="p-0 pb-6">
          <CardTitle>Analysis</CardTitle>
          <p className="text-xl font-semibold tracking-tight text-foreground">Your numbers, at a glance</p>
        </CardHeader>

        {statsLoading || !stats ? (
          <div className="flex flex-wrap justify-center gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[168px] w-[168px] rounded-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-8">
            <CircularStat
              label="Lifetime income"
              sublabel="Total earned"
              value={stats.lifetimeIncome}
              currency={currency}
              color="hsl(var(--income))"
              delay={0}
            />
            <CircularStat
              label="This month"
              sublabel="Income"
              value={stats.monthIncome}
              currency={currency}
              color="hsl(var(--accent))"
              delay={0.1}
            />
            <CircularStat
              label="Bank balance"
              sublabel="Available now"
              value={stats.bankBalance}
              currency={currency}
              color="hsl(var(--saving))"
              delay={0.2}
            />
            <CircularStat
              label="Total savings"
              sublabel="Set aside"
              value={stats.totalSavings}
              currency={currency}
              color="hsl(var(--investing))"
              delay={0.3}
            />
          </div>
        )}
      </Card>

      {/* Category grid -- scroll reveals the Notion-style breakdown */}
      {statsLoading || !stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <CategoryCardGrid categoryTotals={stats.categoryTotals} currency={currency} />
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {statsLoading || !stats ? (
          <Skeleton className="h-96 w-full rounded-2xl lg:col-span-2" />
        ) : (
          <NetWorthDonut categoryTotals={stats.categoryTotals} currency={currency} />
        )}

        {statsLoading || !stats ? (
          <Skeleton className="h-96 w-full rounded-2xl lg:col-span-2" />
        ) : (
          <div className="lg:col-span-2">
            <IncomeLineChart data={stats.lifetimeIncomeSeries} currency={currency} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {statsLoading || !stats ? (
          <>
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </>
        ) : (
          <>
            <MonthBarChart data={stats.currentMonthBreakdown} currency={currency} />
            <SavingsAreaChart data={stats.savingsGrowthSeries} currency={currency} />
            <CategoryPieChart categoryTotals={stats.categoryTotals} currency={currency} />
          </>
        )}
      </div>

      <Card className="p-6">
        <CardHeader className="flex-row items-center justify-between p-0 pb-4">
          <div>
            <CardTitle>Recent activity</CardTitle>
            <p className="text-xl font-semibold tracking-tight text-foreground">Latest transactions</p>
          </div>
          <Link href="/transactions" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <TransactionTable transactions={transactions} loading={txLoading} currency={currency} compact />
      </Card>
    </div>
  );
}
