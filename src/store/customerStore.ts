import { create } from "zustand";
import { CustomerDetail } from "@/interface";

interface CustomerState {
  customer: CustomerDetail | null;
  setCustomer: (customer: CustomerDetail) => void;
  resetCustomer: () => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customer: null,
  setCustomer: (customer) => set({ customer }),
  resetCustomer: () => set({ customer: null }),
}));
