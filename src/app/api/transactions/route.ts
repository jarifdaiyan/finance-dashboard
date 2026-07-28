import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const transactionSchema = z.object({
  amount: z.number().positive("Amount must be greater than zero"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.enum(["INVESTING", "SPENDING", "SAVING"]),
  description: z.string().min(1, "Description is required").max(200),
  date: z.string().min(1, "Date is required"),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};
  if (category && category !== "ALL") where.category = category;
  if (type && type !== "ALL") where.type = type;
  if (search) where.description = { contains: search };
  if (from || to) {
    where.date = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    };
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = transactionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
    },
  });

  return NextResponse.json(transaction, { status: 201 });
}
