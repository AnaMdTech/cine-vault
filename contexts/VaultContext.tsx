// contexts/VaultContext.tsx
import React, { createContext, useContext, useMemo } from "react";
import { useVaultStore } from "@/store/useVaultStore";

interface VaultContextValue {
  items: VaultItem[];
  addToVault: (movie: Movie) => void;
  removeFromVault: (id: string) => void;
  markSeen: (id: string, rating?: number, notes?: string) => void;
  updateItem: (id: string, updates: Partial<VaultItem>) => void;
}

const VaultContext = createContext<VaultContextValue | null>(null);

export const VaultProvider = ({ children }: { children: React.ReactNode }) => {
  // 1. Grab permanent state and disk actions directly from Zustand + AsyncStorage!
  const vaultItems = useVaultStore((state) => state.vaultItems);
  const addToWishlist = useVaultStore((state) => state.addToWishlist);
  const removeFromVaultStore = useVaultStore((state) => state.removeFromVault);
  const markAsSeenStore = useVaultStore((state) => state.markAsSeen);

  // 2. Map them to the exact function names your UI screens expect
  const value = useMemo(
      () => ({
        items: vaultItems,
        addToVault: (movie: Movie) => addToWishlist(movie),
        removeFromVault: (id: string) => removeFromVaultStore(id),
        markSeen: (id: string, rating = 5, notes = "") =>
            markAsSeenStore(id, rating, notes),
        updateItem: (id: string, updates: Partial<VaultItem>) => {
          // Custom update fallback for notes/ratings
          useVaultStore.setState((state) => ({
            vaultItems: state.vaultItems.map((item) =>
                item.id === id ? { ...item, ...updates } : item
            ),
          }));
        },
      }),
      [vaultItems, addToWishlist, removeFromVaultStore, markAsSeenStore]
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