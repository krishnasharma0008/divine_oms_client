"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartDetail } from "@/interface";

interface CartContextProps {
  cartData: CartDetail[];
  setCartData: React.Dispatch<React.SetStateAction<CartDetail[]>>;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartData, setCartData] = useState<CartDetail[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <CartContext.Provider
      value={{ cartData, setCartData, selectedItems, setSelectedItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
