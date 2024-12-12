"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { CartItem } from "@/lib/types/commerceTypes";

interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isInCart: (
    productId: string,
    variantName: string,
    productType: string
  ) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "music_store_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Modified initialization
  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      setItems(JSON.parse(saved));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      // Only save after hydration
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      return [...filtered, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (
    productId: string,
    variantName: string,
    productType: string
  ) => {
    const cartId = `${productId}:${variantName}:${productType}`;
    return items.some((item) => item.id === cartId);
  };

  // Add this check before rendering
  if (!isHydrated) {
    return null;
  }

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
