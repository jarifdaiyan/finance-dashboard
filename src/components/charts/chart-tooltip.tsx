"use client";

import * as React from "react";

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: { name: string; value: number; color?: string }[];
  formatter: (n: number) => string;
}

export function ChartTooltip({ active, label, payload, formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card rounded-xl px-3.5 py-2.5 text-xs shadow-glass">
      {label && <p className="mb-1.5 font-medium text-foreground">{label}</p>}
      <div className="flex flex-col gap-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">{formatter(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
