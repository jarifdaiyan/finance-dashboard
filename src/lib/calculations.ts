import { Transaction as PrismaTransaction, Category } from "@prisma/client";
import { monthLabel } from "./utils";

type Tx = PrismaTransaction;

/** Total income ever recorded. */
export function getLifetimeIncome(transactions: Tx[]) {
  return transactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
}

/** Income recorded within the given month (defaults to current month). */
export function getMonthIncome(transactions: Tx[], reference: Date = new Date()) {
  return transactions
    .filter(
      (t) =>
        t.type === "INCOME" &&
        t.date.getMonth() === reference.getMonth() &&
        t.date.getFullYear() === reference.getFullYear()
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

/** All money that has left the account, across every category. */
export function getTotalExpenses(transactions: Tx[]) {
  return transactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0);
}

/** Money specifically routed into the Saving category. */
export function getTotalSavings(transactions: Tx[]) {
  return transactions
    .filter((t) => t.type === "EXPENSE" && t.category === "SAVING")
    .reduce((sum, t) => sum + t.amount, 0);
}

/** Running balance: starting balance + all income - all expenses. */
export function getCurrentBankBalance(transactions: Tx[], startingBalance: number = 0) {
  const income = getLifetimeIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  return startingBalance + income - expenses;
}

/** Sum of expense amounts grouped by category (Investing / Spending / Saving). */
export function getCategoryTotals(transactions: Tx[]): Record<Category, number> {
  const totals: Record<Category, number> = { INVESTING: 0, SPENDING: 0, SAVING: 0 };
  for (const t of transactions) {
    if (t.type === "EXPENSE") {
      totals[t.category] += t.amount;
    }
  }
  return totals;
}

/** Percentage change between the current period value and the previous period value. */
export function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/** Cumulative lifetime income, bucketed by month, for the line chart. */
export function getLifetimeIncomeSeries(transactions: Tx[], monthsBack: number = 12) {
  const now = new Date();
  const buckets: { month: string; total: number }[] = [];
  const sorted = [...transactions].filter((t) => t.type === "INCOME").sort((a, b) => a.date.getTime() - b.date.getTime());

  let cumulative = 0;
  // Pre-compute cumulative income before the window starts.
  const windowStart = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);
  for (const t of sorted) {
    if (t.date < windowStart) cumulative += t.amount;
  }

  for (let i = monthsBack - 1; i >= 0; i--) {
    const bucketDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const bucketEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthIncome = sorted
      .filter((t) => t.date >= bucketDate && t.date < bucketEnd)
      .reduce((sum, t) => sum + t.amount, 0);
    cumulative += monthIncome;
    buckets.push({ month: monthLabel(bucketDate), total: Math.round(cumulative) });
  }
  return buckets;
}

/** Running bank balance over time, bucketed by month, for the area chart. */
export function getSavingsGrowthSeries(transactions: Tx[], startingBalance: number = 0, monthsBack: number = 12) {
  const now = new Date();
  const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  const windowStart = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);

  let balance = startingBalance;
  for (const t of sorted) {
    if (t.date < windowStart) {
      balance += t.type === "INCOME" ? t.amount : -t.amount;
    }
  }

  const buckets: { month: string; balance: number }[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const bucketDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const bucketEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthTx = sorted.filter((t) => t.date >= bucketDate && t.date < bucketEnd);
    for (const t of monthTx) {
      balance += t.type === "INCOME" ? t.amount : -t.amount;
    }
    buckets.push({ month: monthLabel(bucketDate), balance: Math.round(balance) });
  }
  return buckets;
}

/** Income vs. expense totals for the current calendar month, for the bar chart. */
export function getCurrentMonthBreakdown(transactions: Tx[], reference: Date = new Date()) {
  const income = transactions
    .filter(
      (t) =>
        t.type === "INCOME" &&
        t.date.getMonth() === reference.getMonth() &&
        t.date.getFullYear() === reference.getFullYear()
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(
      (t) =>
        t.type === "EXPENSE" &&
        t.date.getMonth() === reference.getMonth() &&
        t.date.getFullYear() === reference.getFullYear()
    )
    .reduce((sum, t) => sum + t.amount, 0);

  return [{ name: monthLabel(reference), income: Math.round(income), expense: Math.round(expense) }];
}

/** Convenience aggregate used by the /api/stats route. */
export function buildDashboardStats(transactions: Tx[], startingBalance: number = 0) {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const lifetimeIncome = getLifetimeIncome(transactions);
  const monthIncome = getMonthIncome(transactions, now);
  const prevMonthIncome = getMonthIncome(transactions, prevMonth);
  const totalExpenses = getTotalExpenses(transactions);
  const totalSavings = getTotalSavings(transactions);
  const bankBalance = getCurrentBankBalance(transactions, startingBalance);

  // Balance & savings trend vs. one month ago (recompute using only tx up to prev month end).
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const txUpToPrevMonth = transactions.filter((t) => t.date <= prevMonthEnd);
  const prevBalance = getCurrentBankBalance(txUpToPrevMonth, startingBalance);
  const prevSavings = getTotalSavings(txUpToPrevMonth);

  return {
    lifetimeIncome,
    monthIncome,
    monthIncomeTrend: percentChange(monthIncome, prevMonthIncome),
    bankBalance,
    bankBalanceTrend: percentChange(bankBalance, prevBalance),
    totalSavings,
    totalSavingsTrend: percentChange(totalSavings, prevSavings),
    totalExpenses,
    categoryTotals: getCategoryTotals(transactions),
    lifetimeIncomeSeries: getLifetimeIncomeSeries(transactions),
    savingsGrowthSeries: getSavingsGrowthSeries(transactions, startingBalance),
    currentMonthBreakdown: getCurrentMonthBreakdown(transactions, now),
  };
}
