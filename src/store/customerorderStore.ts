import { create } from "zustand";
import { persist } from "zustand/middleware"; // To use localStorage
import { CustomerOrderDetail } from "@/interface";

interface CustomerOrderState {
  customerOrder: CustomerOrderDetail | null;
  setCustomerOrder: (customerOrder: CustomerOrderDetail) => void;
  resetCustomerOrder: () => void;
}

// Zustand store with localStorage persistence
export const useCustomerOrderStore = create(
  persist<CustomerOrderState>(
    (set) => ({
      customerOrder: null,
      setCustomerOrder: (customerOrder) => set({ customerOrder }),
      resetCustomerOrder: () => set({ customerOrder: null }),
    }),
    {
      name: "customer-order-storage", // The key in localStorage
    }
  )
);
