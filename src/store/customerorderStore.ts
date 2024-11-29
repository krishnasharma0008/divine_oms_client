import { create } from "zustand";
import { CustomerOrderDetail } from "@/interface";

interface CustomerOrderState {
  customerOrder: CustomerOrderDetail | null;
  setCustomerOrder: (customerOrder: CustomerOrderDetail) => void;
  resetCustomerOrder: () => void;
}

export const useCustomerOrderStore = create<CustomerOrderState>((set) => ({
  customerOrder: null,
  setCustomerOrder: (customerOrder) => set({ customerOrder }),
  resetCustomerOrder: () => set({ customerOrder: null }),
}));
