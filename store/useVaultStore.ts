// store/useVaultStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface VaultState {
    // State
    vaultItems: VaultItem[];

    // Actions
    addToWishlist: (movie: Movie) => void;
    markAsSeen: (id: string, userRating?: number, notes?: string) => void;
    removeFromVault: (id: string) => void;
    toggleSave: (movie: Movie) => void;

    // Getters / Helpers
    isInVault: (id: string) => boolean;
    getItem: (id: string) => VaultItem | undefined;
}

export const useVaultStore = create<VaultState>()(
    persist(
        (set, get) => ({
            vaultItems: [],

            // 1. Add a movie to Wishlist (prevents duplicates)
            addToWishlist: (movie) => {
                const existing = get().vaultItems.find((item) => item.id === movie.id);
                if (existing) return; // Already saved

                const newItem: VaultItem = {
                    ...movie,
                    status: "wishlist",
                    addedAt: new Date().toISOString().split("T")[0], // YYYY-MM-DD
                };

                set((state) => ({
                    vaultItems: [newItem, ...state.vaultItems],
                }));
            },

            // 2. Promote an item to Seen status with star rating and review notes
            markAsSeen: (id, userRating = 5, notes = "") => {
                set((state) => ({
                    vaultItems: state.vaultItems.map((item) =>
                        item.id === id
                            ? {
                                ...item,
                                status: "seen",
                                userRating,
                                notes: notes || item.notes,
                            }
                            : item
                    ),
                }));
            },

            // 3. Remove a movie completely from local storage
            removeFromVault: (id) => {
                set((state) => ({
                    vaultItems: state.vaultItems.filter((item) => item.id !== id),
                }));
            },

            // 4. Quick-toggle helper for Discover screen (+ badge / checkmark)
            toggleSave: (movie) => {
                const exists = get().isInVault(movie.id);
                if (exists) {
                    get().removeFromVault(movie.id);
                } else {
                    get().addToWishlist(movie);
                }
            },

            // 5. Helper: check if a movie ID exists in the vault
            isInVault: (id) => {
                return get().vaultItems.some((item) => item.id === id);
            },

            // 6. Helper: get a specific vault item by ID
            getItem: (id) => {
                return get().vaultItems.find((item) => item.id === id);
            },
        }),
        {
            name: "cinevault-storage", // Unique key in AsyncStorage
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);