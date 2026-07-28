import { toast } from "sonner";
import { financeEvents } from "@/lib/events";
import type { TransactionInput } from "@/types";

export async function createTransactionApi(input: TransactionInput) {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    toast.error("Couldn't save that transaction. Check the form and try again.");
    return false;
  }
  toast.success("Transaction added");
  financeEvents.emit();
  return true;
}

export async function updateTransactionApi(id: string, input: Partial<TransactionInput>) {
  const res = await fetch(`/api/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    toast.error("Couldn't update that transaction.");
    return false;
  }
  toast.success("Transaction updated");
  financeEvents.emit();
  return true;
}

export async function deleteTransactionApi(id: string) {
  const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
  if (!res.ok) {
    toast.error("Couldn't delete that transaction.");
    return false;
  }
  toast.success("Transaction deleted");
  financeEvents.emit();
  return true;
}
