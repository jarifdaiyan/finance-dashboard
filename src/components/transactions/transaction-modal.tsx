"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { createTransactionApi, updateTransactionApi } from "@/lib/api";
import { useSettings } from "@/components/settings-provider";
import type { Transaction, TransactionInput, Category, TransactionType } from "@/types";

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Transaction | null;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function TransactionModal({ open, onOpenChange, editing }: TransactionModalProps) {
  const { defaultCategory } = useSettings();

  const [amount, setAmount] = React.useState("");
  const [type, setType] = React.useState<TransactionType>("EXPENSE");
  const [category, setCategory] = React.useState<Category>("SPENDING");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState(todayISO());
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      if (editing) {
        setAmount(String(editing.amount));
        setType(editing.type);
        setCategory(editing.category);
        setDescription(editing.description);
        setDate(editing.date.split("T")[0]);
      } else {
        setAmount("");
        setType("EXPENSE");
        setCategory(defaultCategory);
        setDescription("");
        setDate(todayISO());
      }
      setErrors({});
    }
  }, [open, editing, defaultCategory]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const nextErrors: Record<string, string> = {};
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) nextErrors.amount = "Enter an amount greater than zero";
    if (!description.trim()) nextErrors.description = "Add a short description";
    if (!date) nextErrors.date = "Pick a date";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    const payload: TransactionInput = { amount: parsedAmount, type, category, description: description.trim(), date };
    const ok = editing ? await updateTransactionApi(editing.id, payload) : await createTransactionApi(payload);
    setSubmitting(false);
    if (ok) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit transaction" : "New transaction"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the details below." : "Log money moving in or out of an account."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
                {errors.amount && <p className="text-xs text-expense">{errors.amount}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                {errors.date && <p className="text-xs text-expense">{errors.date}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SPENDING">Spending</SelectItem>
                    <SelectItem value="INVESTING">Investing</SelectItem>
                    <SelectItem value="SAVING">Saving</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g. Client payment, groceries, index fund buy"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && <p className="text-xs text-expense">{errors.description}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editing ? "Save changes" : "Add transaction"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
