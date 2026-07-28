type Listener = () => void;

class FinanceEventBus {
  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit() {
    this.listeners.forEach((l) => l());
  }
}

export const financeEvents = new FinanceEventBus();
