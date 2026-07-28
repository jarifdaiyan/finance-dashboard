import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const accessKey = process.env.ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json(
      { error: "ACCESS_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let key: unknown;
  try {
    ({ key } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof key !== "string" || key !== accessKey) {
    // Deliberately generic message — don't tell an attacker whether the
    // key was close or not.
    return NextResponse.json({ error: "Incorrect key." }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
