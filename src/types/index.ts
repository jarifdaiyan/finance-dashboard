export type TransactionType = "INCOME" | "EXPENSE";
export type Category = "INVESTING" | "SPENDING" | "SAVING";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionInput {
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string;
}

export interface DashboardStats {
  lifetimeIncome: number;
  monthIncome: number;
  monthIncomeTrend: number;
  bankBalance: number;
  bankBalanceTrend: number;
  totalSavings: number;
  totalSavingsTrend: number;
  totalExpenses: number;
  categoryTotals: Record<Category, number>;
  lifetimeIncomeSeries: { month: string; total: number }[];
  savingsGrowthSeries: { month: string; balance: number }[];
  currentMonthBreakdown: { name: string; income: number; expense: number }[];
}

export interface Settings {
  currency: "USD" | "BDT" | "AED";
  accentColor: string;
  theme: "dark" | "light";
  defaultCategory: Category;
}
