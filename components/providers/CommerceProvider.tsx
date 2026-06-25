"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import {
  addToCartAction,
  getCartAction,
  removeFromCartAction,
  setQuantityAction,
} from "@/app/actions/cart";
import type { CartLine, CartView } from "@/lib/cart";

type CommerceContextValue = {
  items: CartLine[];
  cartCount: number;
  subtotal: number;
  cartLoaded: boolean;
  isUpdating: boolean;
  addItem: (slug: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

const EMPTY: CartView = { items: [], count: 0, subtotal: 0 };

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartView>(EMPTY);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [isUpdating, startTransition] = useTransition();

  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getCartAction()
      .then((view) => {
        if (active) setCart(view);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setCartLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const addItem = useCallback((slug: string) => {
    setCartOpen(true);
    startTransition(async () => {
      const view = await addToCartAction(slug);
      setCart(view);
    });
  }, []);

  const updateQty = useCallback((productId: string, quantity: number) => {
    startTransition(async () => {
      const view = await setQuantityAction(productId, quantity);
      setCart(view);
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    startTransition(async () => {
      const view = await removeFromCartAction(productId);
      setCart(view);
    });
  }, []);

  const value = useMemo(
    () => ({
      items: cart.items,
      cartCount: cart.count,
      subtotal: cart.subtotal,
      cartLoaded,
      isUpdating,
      addItem,
      updateQty,
      removeItem,
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      menuOpen,
      setMenuOpen,
    }),
    [cart, cartLoaded, isUpdating, addItem, updateQty, removeItem, cartOpen, menuOpen, searchOpen],
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) throw new Error("useCommerce must be used within CommerceProvider");
  return context;
}
