"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type CommerceContextValue = {
  cartCount: number;
  addToCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const value = useMemo(
    () => ({
      cartCount,
      addToCart: () => {
        setCartCount((count) => count + 1);
        setCartOpen(true);
      },
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      menuOpen,
      setMenuOpen,
    }),
    [cartCount, cartOpen, menuOpen, searchOpen],
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) throw new Error("useCommerce must be used within CommerceProvider");
  return context;
}
