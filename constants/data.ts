// constants/data.ts
import { icons } from "@/constants/icons";

export const tabs: AppTab[] = [
    {
        name: "index",
        title: "Discover",
        icon: icons.film,
    },
    {
        name: "vault",
        title: "My Vault",
        icon: icons.bookmark,
    },
    {
        name: "dna",
        title: "Cinema DNA",
        icon: icons.chart,
    },
];

export const MOCK_TRENDING_MOVIES: Movie[] = [
    {
        id: "1",
        title: "Dune: Part Two",
        posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        releaseYear: 2024,
        runtime: 166,
        mediaType: "movie",
        genres: ["Sci-Fi", "Adventure"],
        overview:
            "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        rating: 8.5,
    },
    {
        id: "2",
        title: "Oppenheimer",
        posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        releaseYear: 2023,
        runtime: 180,
        mediaType: "movie",
        genres: ["Drama", "History"],
        overview:
            "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        rating: 8.1,
    },
    {
        id: "3",
        title: "Spider-Man: Across the Spider-Verse",
        posterUrl: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
        releaseYear: 2023,
        runtime: 140,
        mediaType: "movie",
        genres: ["Animation", "Action", "Adventure"],
        overview:
            "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
        rating: 8.4,
    },
    {
        id: "4",
        title: "The Dark Knight",
        posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        releaseYear: 2008,
        runtime: 152,
        mediaType: "movie",
        genres: ["Action", "Crime", "Drama"],
        overview:
            "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        rating: 9.0,
    },
    {
        id: "5",
        title: "Interstellar",
        posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        releaseYear: 2014,
        runtime: 169,
        mediaType: "movie",
        genres: ["Adventure", "Drama", "Sci-Fi"],
        overview:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        rating: 8.7,
    },
    {
        id: "6",
        title: "Blade Runner 2049",
        posterUrl: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
        releaseYear: 2017,
        runtime: 163,
        mediaType: "movie",
        genres: ["Sci-Fi", "Drama"],
        overview:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
        rating: 8.0,
    },
];

export const MOCK_VAULT_ITEMS: VaultItem[] = [
    {
        ...MOCK_TRENDING_MOVIES[0],
        status: "wishlist",
        addedAt: "2026-08-01",
    },
    {
        ...MOCK_TRENDING_MOVIES[1],
        status: "seen",
        userRating: 5,
        notes: "Absolute masterpiece. The sound design in IMAX was unforgettable.",
        addedAt: "2026-07-28",
    },
    {
        ...MOCK_TRENDING_MOVIES[3],
        status: "seen",
        userRating: 5,
        notes: "Heath Ledger's Joker is still the greatest villain performance in cinema history.",
        addedAt: "2026-07-15",
    },
    {
        ...MOCK_TRENDING_MOVIES[4],
        status: "seen",
        userRating: 4,
        notes: "Incredible visual effects and Zimmer score, even if the third act is a bit mind-bending.",
        addedAt: "2026-07-10",
    },
];