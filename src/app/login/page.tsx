"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [key, setKey] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (!res.ok) {
        setError("Incorrect key. Try again.");
        setLoading(false);
        return;
      }

      const from = searchParams.get("from");
      router.replace(from && from !== "/login" ? from : "/");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="glass-card w-full max-w-sm rounded-2xl border border-border p-8">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Locked</h1>
          <p className="text-xs text-muted-foreground">Enter your key to access the dashboard.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="password"
          autoFocus
          placeholder="Secret key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          disabled={loading}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button type="submit" disabled={loading || !key} className="mt-1">
          {loading ? "Checking..." : "Unlock"}
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
