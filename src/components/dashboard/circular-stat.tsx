"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/dashboard/animated-number";
import { formatCurrency } from "@/lib/utils";

interface CircularStatProps {
  label: string;
  sublabel: string;
  value: number;
  currency: string;
  color: string;
  delay?: number;
  size?: number;
}

export function CircularStat({ label, sublabel, value, currency, color, delay = 0, size = 168 }: CircularStatProps) {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // Leave a small gap at the top, like a spinner, rather than a fully closed ring.
  const arcFraction = 0.92;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-3"
    >
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - arcFraction) }}
            transition={{ duration: 1.1, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatedNumber
            value={value}
            formatter={(n) => formatCurrency(n, currency)}
            className="text-2xl font-semibold tracking-tight"
          />
          <span className="mt-1 text-[11px] text-muted-foreground">{sublabel}</span>
        </div>
      </div>
    </motion.div>
  );
}
