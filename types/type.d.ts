// types/index.d.ts
import type { ImageSourcePropType } from "react-native";

declare global {
    /* --- Navigation & Tab Bar --- */
    interface AppTab {
        name: string;
        title: string;
        icon: ImageSourcePropType;
    }

    interface TabIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }

    /* --- Core Movie & Vault Domain --- */
    type MediaType = "movie" | "tv";
    type MediaStatus = "wishlist" | "seen";

    interface Movie {
        id: string;
        title: string;
        posterUrl: string;
        releaseYear: number;
        runtime: number;
        mediaType: MediaType;
        genres: string[];
        overview: string;
        rating?: number; // TMDB rating out of 10
    }

    interface VaultItem extends Movie {
        status: MediaStatus;
        userRating?: number; // User's 1-5 star rating
        notes?: string;      // Personal review snippet
        addedAt: string;
    }

    /* --- Component Props --- */
    interface MovieCardProps {
        movie: Movie;
        isSaved: boolean;
        onQuickAdd: () => void;
        onPress: () => void;
    }

    interface VaultCardProps {
        item: VaultItem;
        onToggleSeen: () => void;
        onPress: () => void;
    }

    interface SegmentedControlProps {
        activeTab: MediaStatus;
        wishlistCount: number;
        seenCount: number;
        onChange: (status: MediaStatus) => void;
    }

    interface SmartFilterProps {
        selectedType: "all" | MediaType;
        selectedGenre: string | null;
        onSelectType: (type: "all" | MediaType) => void;
        onSelectGenre: (genre: string | null) => void;
    }

    interface ListHeadingProps {
        title: string;
        count?: number;
    }
}

export {};