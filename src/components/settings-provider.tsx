"use client";

import * as React from "react";
import { useTheme } from "next-themes";

interface SettingsState {
  currency: "USD" | "BDT" | "AED";
  accentColor: string;
  defaultCategory: "INVESTING" | "SPENDING" | "SAVING";
  startingBalance: number;
  loaded: boolean;
}

interface SettingsContextValue extends SettingsState {
  update: (patch: Partial<Omit<SettingsState, "loaded">>) => Promise<void>;
}

const defaultState: SettingsState = {
  currency: "USD",
  accentColor: "violet",
  defaultCategory: "SPENDING",
  startingBalance: 0,
  loaded: false,
};

const SettingsContext = React.createContext<SettingsContextValue>({
  ...defaultState,
  update: async () => {},
});

export const ACCENT_HSL: Record<string, string> = {
  violet: "248 87% 71%",
  emerald: "158 64% 52%",
  sky: "199 89% 61%",
  amber: "38 92% 55%",
  rose: "351 91% 71%",
  indigo: "239 84% 67%",
  teal: "172 66% 50%",
  orange: "27 96% 61%",
  fuchsia: "292 91% 73%",
  lime: "82 78% 55%",
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<SettingsState>(defaultState);
  const { setTheme } = useTheme();

  React.useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setState({
          currency: data.currency,
          accentColor: data.accentColor,
          defaultCategory: data.defaultCategory,
          startingBalance: data.startingBalance,
          loaded: true,
        });
        if (data.theme) setTheme(data.theme);
      })
      .catch(() => setState((s) => ({ ...s, loaded: true })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const hsl = ACCENT_HSL[state.accentColor] ?? ACCENT_HSL.violet;
    document.documentElement.style.setProperty("--accent", hsl);
    document.documentElement.style.setProperty("--ring", hsl);
  }, [state.accentColor]);

  const update = React.useCallback(async (patch: Partial<Omit<SettingsState, "loaded">>) => {
    setState((s) => ({ ...s, ...patch }));
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }, []);

  return <SettingsContext.Provider value={{ ...state, update }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return React.useContext(SettingsContext);
}
