"use client";

import * as React from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/use-transactions";

export default function ExportPage() {
  const { transactions } = useTransactions();

  function handleExport() {
    window.location.href = "/api/export";
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15">
            <FileSpreadsheet className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardHeader className="p-0">
              <CardTitle>CSV export</CardTitle>
            </CardHeader>
            <p className="mt-1 text-xl font-semibold tracking-tight">Download every transaction</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {transactions.length} transaction{transactions.length === 1 ? "" : "s"} ready to export, formatted with
              date, description, category, type, and amount.
            </p>
          </div>
        </div>
        <Button onClick={handleExport} size="lg" className="w-full gap-2 sm:w-auto">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </Card>

      <Card className="p-6">
        <p className="text-sm text-muted-foreground">
          The exported file includes every transaction currently stored in your database, one row per entry. Open it
          in Excel, Google Sheets, or Numbers, or import it into another finance tool.
        </p>
      </Card>
    </div>
  );
}
