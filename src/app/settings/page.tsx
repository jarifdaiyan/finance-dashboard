"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useSettings } from "@/components/settings-provider";
import { cn } from "@/lib/utils";

const ACCENTS = [
  { key: "violet", label: "Violet", hex: "#8B7CF6" },
  { key: "emerald", label: "Emerald", hex: "#34D399" },
  { key: "sky", label: "Sky", hex: "#38BDF8" },
  { key: "amber", label: "Amber", hex: "#F59E0B" },
  { key: "rose", label: "Rose", hex: "#FB7185" },
  { key: "indigo", label: "Indigo", hex: "#6366F1" },
  { key: "teal", label: "Teal", hex: "#2DD4BF" },
  { key: "orange", label: "Orange", hex: "#FB923C" },
  { key: "fuchsia", label: "Fuchsia", hex: "#E879F9" },
  { key: "lime", label: "Lime", hex: "#A3E635" },
];

export default function SettingsPage() {
  const { currency, accentColor, defaultCategory, update, loaded } = useSettings();
  const { theme, setTheme } = useTheme();

  if (!loaded) return null;

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {theme === "light" ? <Sun className="h-4 w-4 text-muted-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark appearance</p>
            </div>
          </div>
          <Switch
            checked={theme !== "light"}
            onCheckedChange={(checked) => {
              const next = checked ? "dark" : "light";
              setTheme(next);
              fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ theme: next }),
              });
            }}
          />
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-1 text-sm font-medium">Color scheme</p>
          <p className="mb-3 text-xs text-muted-foreground">10 schemes, each tuned to look right in both light and dark mode.</p>
          <div className="flex flex-wrap gap-3">
            {ACCENTS.map((a) => (
              <button
                key={a.key}
                onClick={() => update({ accentColor: a.key })}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-transform hover:scale-105",
                  accentColor === a.key ? "border-foreground" : "border-transparent"
                )}
                style={{ backgroundColor: a.hex }}
                aria-label={a.label}
                title={a.label}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Currently: <span className="font-medium text-foreground">{ACCENTS.find((a) => a.key === accentColor)?.label ?? "Violet"}</span>
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle>Currency & defaults</CardTitle>
        </CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label>Currency</Label>
            <Select value={currency} onValueChange={(v) => update({ currency: v as typeof currency })}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="BDT">BDT (৳)</SelectItem>
                <SelectItem value="AED">AED (د.إ)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>Default category</Label>
            <Select
              value={defaultCategory}
              onValueChange={(v) => update({ defaultCategory: v as typeof defaultCategory })}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPENDING">Spending</SelectItem>
                <SelectItem value="INVESTING">Investing</SelectItem>
                <SelectItem value="SAVING">Saving</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
}
