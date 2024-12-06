import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import { CustomerDetail } from "@/interface";

// Custom wrapper for localStorage
const localStorageWrapper: PersistStorage<CustomerState> = {
  getItem: (name) => {
    const storedValue = localStorage.getItem(name);
    return storedValue ? JSON.parse(storedValue) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

interface CustomerState {
  customer: CustomerDetail | null;
  setCustomer: (customer: CustomerDetail) => void;
  resetCustomer: () => void;
}

export const useCustomerStore = create(
  persist<CustomerState>(
    (set) => ({
      customer: null,
      setCustomer: (customer) => set({ customer }),
      resetCustomer: () => set({ customer: null }),
    }),
    {
      name: "customer-storage", // Key for localStorage
      storage: localStorageWrapper, // Use the custom wrapper
    }
  )
);
