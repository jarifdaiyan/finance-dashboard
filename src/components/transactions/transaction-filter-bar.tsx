"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { TransactionFilters } from "@/hooks/use-transactions";

interface FilterBarProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

export function TransactionFilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search descriptions..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>

      <Select value={filters.category} onValueChange={(v) => onChange({ ...filters, category: v as TransactionFilters["category"] })}>
        <SelectTrigger className="sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All categories</SelectItem>
          <SelectItem value="SPENDING">Spending</SelectItem>
          <SelectItem value="INVESTING">Investing</SelectItem>
          <SelectItem value="SAVING">Saving</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.type} onValueChange={(v) => onChange({ ...filters, type: v as TransactionFilters["type"] })}>
        <SelectTrigger className="sm:w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All types</SelectItem>
          <SelectItem value="INCOME">Income</SelectItem>
          <SelectItem value="EXPENSE">Expense</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={filters.from ?? ""}
        onChange={(e) => onChange({ ...filters, from: e.target.value || undefined })}
        className="sm:w-40"
        aria-label="From date"
      />
      <Input
        type="date"
        value={filters.to ?? ""}
        onChange={(e) => onChange({ ...filters, to: e.target.value || undefined })}
        className="sm:w-40"
        aria-label="To date"
      />
    </div>
  );
}
