"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useTransactionModal } from "@/components/transactions/transaction-modal-provider";
import { deleteTransactionApi } from "@/lib/api";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { Transaction } from "@/types";

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  currency: string;
  compact?: boolean;
}

function categoryVariant(category: Transaction["category"]) {
  if (category === "INVESTING") return "investing" as const;
  if (category === "SAVING") return "saving" as const;
  return "outline" as const;
}

function amountColor(t: Transaction) {
  if (t.type === "INCOME") return "text-income";
  if (t.category === "SAVING") return "text-saving";
  if (t.category === "INVESTING") return "text-investing";
  return "text-expense";
}

export function TransactionTable({ transactions, loading, currency, compact }: TransactionTableProps) {
  const { openEdit } = useTransactionModal();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteTransactionApi(id);
    setDeletingId(null);
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: compact ? 5 : 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Press N or use the button above to log your first entry."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="py-3 pr-4 font-medium">Date</th>
            <th className="py-3 pr-4 font-medium">Description</th>
            <th className="py-3 pr-4 font-medium">Category</th>
            <th className="py-3 pr-4 font-medium">Type</th>
            <th className="py-3 pr-4 text-right font-medium">Amount</th>
            {!compact && <th className="py-3 pl-4 text-right font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {transactions.map((t) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: deletingId === t.id ? 0.4 : 1 }}
                exit={{ opacity: 0 }}
                className="group border-b border-border/60 last:border-0 hover:bg-surface-hover/60"
              >
                <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">{formatDate(t.date)}</td>
                <td className="py-3 pr-4 font-medium">{t.description}</td>
                <td className="py-3 pr-4">
                  <Badge variant={categoryVariant(t.category)} className="capitalize">
                    {t.category.toLowerCase()}
                  </Badge>
                </td>
                <td className="py-3 pr-4">
                  <Badge variant={t.type === "INCOME" ? "income" : "expense"}>
                    {t.type === "INCOME" ? "Income" : "Expense"}
                  </Badge>
                </td>
                <td className={cn("whitespace-nowrap py-3 pr-4 text-right font-semibold", amountColor(t))}>
                  {t.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(t.amount, currency)}
                </td>
                {!compact && (
                  <td className="py-3 pl-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(t)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                        aria-label="Edit transaction"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-expense/15 hover:text-expense"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
