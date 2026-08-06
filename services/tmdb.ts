// services/tmdb.ts

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;

// Map TMDB genre IDs to our app's readable genre strings
const GENRE_MAP: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
};

interface TMDBMovieRaw {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
}

// Helper: Safely convert raw TMDB JSON into our app's Movie type
const mapTMDBToMovie = (raw: TMDBMovieRaw): Movie => {
    const releaseYear = raw.release_date
        ? parseInt(raw.release_date.split("-")[0], 10) || new Date().getFullYear()
        : new Date().getFullYear();

    const genres =
        raw.genre_ids && raw.genre_ids.length > 0
            ? raw.genre_ids
                .map((id) => GENRE_MAP[id])
                .filter(Boolean)
                .slice(0, 3)
            : ["Drama"];

    const posterUrl = raw.poster_path
        ? `${TMDB_IMAGE_BASE}${raw.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Poster";

    return {
        id: String(raw.id),
        title: raw.title || "Untitled",
        releaseYear,
        runtime: 120,
        genres: genres.length > 0 ? genres : ["Drama"],
        rating: Number((raw.vote_average || 0).toFixed(1)),
        overview: raw.overview || "No synopsis available for this film.",
        posterUrl,
        mediaType: "movie", // Required by Movie interface
    };
};

// 1. Fetch Today's Trending Movies (NOW USING &page=${page})
export const fetchTrendingMovies = async (page: number = 1): Promise<Movie[]> => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US&page=${page}`
        );

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();
        return (data.results as TMDBMovieRaw[]).map(mapTMDBToMovie);
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};

// 2. Search Movies by Title Query (NOW USING &page=${page})
export const searchMovies = async (
    query: string,
    page: number = 1
): Promise<Movie[]> => {
    if (!query.trim()) return fetchTrendingMovies(page);

    try {
        const encodedQuery = encodeURIComponent(query.trim());
        const response = await fetch(
            `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodedQuery}&page=${page}&include_adult=false`
        );

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();
        return (data.results as TMDBMovieRaw[]).map(mapTMDBToMovie);
    } catch (error) {
        console.error("Error searching movies:", error);
        return [];
    }
};