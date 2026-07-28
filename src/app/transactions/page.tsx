"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { TransactionFilterBar } from "@/components/transactions/transaction-filter-bar";
import { useTransactions } from "@/hooks/use-transactions";
import { useSettings } from "@/components/settings-provider";

export default function TransactionsPage() {
  const { transactions, loading, filters, setFilters } = useTransactions();
  const { currency } = useSettings();

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5">
        <TransactionFilterBar filters={filters} onChange={setFilters} />
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${transactions.length} transaction${transactions.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <TransactionTable transactions={transactions} loading={loading} currency={currency} />
      </Card>
    </div>
  );
}
