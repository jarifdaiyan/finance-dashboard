"use client";

import * as React from "react";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import type { Transaction } from "@/types";

interface ModalContextValue {
  openCreate: () => void;
  openEdit: (tx: Transaction) => void;
}

const ModalContext = React.createContext<ModalContextValue>({
  openCreate: () => {},
  openEdit: () => {},
});

export function TransactionModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Transaction | null>(null);

  const openCreate = React.useCallback(() => {
    setEditing(null);
    setOpen(true);
  }, []);

  const openEdit = React.useCallback((tx: Transaction) => {
    setEditing(tx);
    setOpen(true);
  }, []);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;
      if (isTyping || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        openCreate();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openCreate]);

  return (
    <ModalContext.Provider value={{ openCreate, openEdit }}>
      {children}
      <TransactionModal open={open} onOpenChange={setOpen} editing={editing} />
    </ModalContext.Provider>
  );
}

export function useTransactionModal() {
  return React.useContext(ModalContext);
}
