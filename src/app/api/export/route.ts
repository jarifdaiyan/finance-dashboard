import { NextResponse } from "next/server";
import type { Transaction } from "@prisma/client";
import { prisma } from "@/lib/db";

function escapeCsv(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const transactions = await prisma.transaction.findMany({ orderBy: { date: "desc" } });

  const header = ["Date", "Description", "Category", "Type", "Amount"];
  const rows = transactions.map((t: Transaction) =>
    [
      t.date.toISOString().split("T")[0],
      escapeCsv(t.description),
      t.category,
      t.type,
      t.amount.toFixed(2),
    ].join(",")
  );

  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="transactions-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
