import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildDashboardStats } from "@/lib/calculations";

export async function GET() {
  const [transactions, settings] = await Promise.all([
    prisma.transaction.findMany({ orderBy: { date: "asc" } }),
    prisma.settings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    }),
  ]);

  const stats = buildDashboardStats(transactions, settings.startingBalance);
  return NextResponse.json(stats);
}
