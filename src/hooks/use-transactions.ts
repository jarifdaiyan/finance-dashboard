"use client";

import * as React from "react";
import { financeEvents } from "@/lib/events";
import { createTransactionApi, updateTransactionApi, deleteTransactionApi } from "@/lib/api";
import type { Transaction, TransactionInput } from "@/types";

export interface TransactionFilters {
  category: "ALL" | "INVESTING" | "SPENDING" | "SAVING";
  type: "ALL" | "INCOME" | "EXPENSE";
  search: string;
  from?: string;
  to?: string;
}

const defaultFilters: TransactionFilters = { category: "ALL", type: "ALL", search: "" };

export function useTransactions(initialFilters: Partial<TransactionFilters> = {}, limit?: number) {
  const [filters, setFilters] = React.useState<TransactionFilters>({ ...defaultFilters, ...initialFilters });
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category !== "ALL") params.set("category", filters.category);
    if (filters.type !== "ALL") params.set("type", filters.type);
    if (filters.search) params.set("search", filters.search);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);

    const res = await fetch(`/api/transactions?${params.toString()}`, { cache: "no-store" });
    const data: Transaction[] = await res.json();
    setTransactions(limit ? data.slice(0, limit) : data);
    setLoading(false);
  }, [filters, limit]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  React.useEffect(() => financeEvents.subscribe(refresh), [refresh]);

  const createTransaction = React.useCallback((input: TransactionInput) => createTransactionApi(input), []);
  const updateTransaction = React.useCallback(
    (id: string, input: Partial<TransactionInput>) => updateTransactionApi(id, input),
    []
  );
  const deleteTransaction = React.useCallback((id: string) => deleteTransactionApi(id), []);

  return {
    transactions,
    loading,
    filters,
    setFilters,
    refresh,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
