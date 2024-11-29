import { create } from "zustand";
import { CartDetail } from "@/interface";

interface CartState {
  cart: CartDetail | null;
  setCartDetail: (cart: CartDetail) => void;
  resetCartDetail: () => void;
}

export const useCartDetailStore = create<CartState>((set) => ({
  cart: null,
  setCartDetail: (cart) => set({ cart }),
  resetCartDetail: () => set({ cart: null }),
}));
