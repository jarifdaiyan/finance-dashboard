"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/70">
      <div
        className="relative flex flex-col items-center justify-center gap-3 px-6 py-14 text-center sm:py-20"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, hsl(var(--accent) / 0.35), transparent 55%), radial-gradient(circle at 80% 80%, hsl(var(--investing) / 0.3), transparent 55%), hsl(var(--surface))",
        }}
      >
        <div className="noise-overlay opacity-30" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent shadow-glow-accent"
        >
          <Crown className="h-6 w-6 text-accent-foreground" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-bold tracking-tight sm:text-5xl"
        >
          DAIYAN FINANCE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-accent sm:text-sm"
        >
          THE UNTOUCHABLE DAIYAN EMPIRE
        </motion.p>
      </div>
    </div>
  );
}
