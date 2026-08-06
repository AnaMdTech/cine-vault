import { MOCK_VAULT_ITEMS } from "@/constants/data";
import React, { createContext, useContext, useMemo, useState } from "react";

interface VaultContextValue {
  items: VaultItem[];
  addToVault: (movie: Movie) => void;
  removeFromVault: (id: string) => void;
  markSeen: (id: string, rating?: number, notes?: string) => void;
  updateItem: (id: string, updates: Partial<VaultItem>) => void;
}

const VaultContext = createContext<VaultContextValue | null>(null);

export const VaultProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<VaultItem[]>(MOCK_VAULT_ITEMS);

  const addToVault = (movie: Movie) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === movie.id)) {
        return prev;
      }

      return [
        {
          ...movie,
          status: "wishlist",
          addedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const removeFromVault = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const markSeen = (id: string, rating = 5, notes = "") => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "seen",
              userRating: rating,
              notes,
            }
          : item,
      ),
    );
  };

  const updateItem = (id: string, updates: Partial<VaultItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const value = useMemo(
    () => ({
      items,
      addToVault,
      removeFromVault,
      markSeen,
      updateItem,
    }),
    [items],
  );

  return (
    <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);

  if (!context) {
    throw new Error("useVault must be used within a VaultProvider");
  }

  return context;
};
