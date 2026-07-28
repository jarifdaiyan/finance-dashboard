import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SettingsProvider } from "@/components/settings-provider";
import { TransactionModalProvider } from "@/components/transactions/transaction-modal-provider";
import { AppShell } from "@/components/app-shell";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: "DAIYAN FINANCE — THE UNTOUCHABLE DAIYAN EMPIRE",
  description: "A private, manually-tracked view of your income, spending, saving, and investing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <SettingsProvider>
            <TransactionModalProvider>
              <div className="ambient-glow" />
              <div className="noise-overlay" />
              <AppShell>{children}</AppShell>
              <Toaster
                theme="dark"
                position="bottom-right"
                toastOptions={{
                  className: "glass-card !text-foreground !border-border",
                }}
              />
            </TransactionModalProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
