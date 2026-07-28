import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const settingsSchema = z.object({
  currency: z.enum(["USD", "BDT", "AED"]).optional(),
  accentColor: z.string().optional(),
  theme: z.enum(["dark", "light"]).optional(),
  defaultCategory: z.enum(["INVESTING", "SPENDING", "SAVING"]).optional(),
  startingBalance: z.number().optional(),
});

export async function GET() {
  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  return NextResponse.json(settings);
}
