// app/(tabs)/index.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled, useColorScheme } from "nativewind";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import { useVault } from "@/contexts/VaultContext";
import { fetchTrendingMovies, searchMovies } from "@/services/tmdb";

const SafeAreaView = styled(RNSafeAreaView);
const GENRES = ["All", "Sci-Fi", "Action", "Drama", "Animation", "Adventure"];

export default function DiscoverScreen() {
  const router = useRouter();
  const { items, addToVault, removeFromVault } = useVault();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // --- 1. Live TMDB & Infinite Scroll State ---
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // --- Filter & UI State ---
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // --- 2. Fetch Initial Page 1 (With Debounce for Search & Error Handling) ---
  const loadInitialMovies = useCallback(async (query: string) => {
    try {
      setError(false);
      const results = query.trim()
          ? await searchMovies(query, 1)
          : await fetchTrendingMovies(1);

      // If TMDB returns 0 results on an empty query, flag as offline/network error
      if (results.length === 0 && !query.trim()) {
        setError(true);
      } else {
        setMovies(results);
        setPage(1);
        setHasMore(results.length >= 20);
      }
    } catch (err) {
      console.error("Failed to load TMDB movies:", err);
      setError(true);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const delayDebounceFn = setTimeout(
        async () => {
          if (isMounted) {
            await loadInitialMovies(searchQuery);
            setLoading(false);
          }
        },
        searchQuery.trim() ? 500 : 0 // Instant for trending, 500ms delay when typing
    );

    return () => {
      isMounted = false;
      clearTimeout(delayDebounceFn);
    };
  }, [searchQuery, loadInitialMovies]);

  // --- 3. Pull-to-Refresh Handler ---
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialMovies(searchQuery);
    setRefreshing(false);
  }, [searchQuery, loadInitialMovies]);

  // --- 4. Infinite Scroll: Load Next Page ---
  const handleLoadMore = useCallback(async () => {
    if (loading || loadingMore || refreshing || !hasMore || error) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const newResults = searchQuery.trim()
          ? await searchMovies(searchQuery, nextPage)
          : await fetchTrendingMovies(nextPage);

      if (newResults.length > 0) {
        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const uniqueNew = newResults.filter((m) => !existingIds.has(m.id));
          return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
        setHasMore(newResults.length >= 20);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more movies:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, refreshing, hasMore, error, page, searchQuery]);

  // --- 5. Save/Remove Toggle ---
  const toggleSave = (id: string) => {
    const alreadySaved = items.some((item) => item.id === id);

    if (alreadySaved) {
      removeFromVault(id);
    } else {
      const movie = movies.find((entry) => entry.id === id);
      if (movie) {
        addToVault(movie);
      }
    }
  };

  // --- 6. Client-Side Genre Filter ---
  const filteredMovies = useMemo(() => {
    if (selectedGenre === "All") return movies;
    return movies.filter((movie) => movie.genres.includes(selectedGenre));
  }, [movies, selectedGenre]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenre("All");
  };

  // --- Custom Empty State (Handles Offline & Search No-Results) ---
  const renderEmptyState = () => {
    if (loading) return null;

    // 1. OFFLINE / NETWORK ERROR STATE
    if (error) {
      return (
          <View className="empty-state-container mt-12">
            <View className="empty-icon-badge">
              <Image
                  source={icons.film}
                  className="size-7"
                  style={{ tintColor: "#f59e0b" }}
                  resizeMode="contain"
              />
            </View>
            <View className="items-center">
              <Text className="text-foreground text-lg font-sans-bold text-center">
                You're Offline
              </Text>
              <Text className="text-muted-foreground text-sm font-sans text-center mt-1.5 max-w-[260px]">
                We couldn't reach Hollywood right now. Luckily, your saved titles
                are stored locally on your device!
              </Text>
            </View>
            <Pressable
                onPress={() => router.push("/vault")}
                className="mt-3 rounded-xl bg-primary px-6 py-3 active:scale-[0.95]"
            >
              <Text className="text-foreground font-sans-bold text-sm">
                Open My Vault (Offline)
              </Text>
            </Pressable>
          </View>
      );
    }

    // 2. STANDARD SEARCH NO-RESULTS STATE
    return (
        <View className="empty-state-container mt-12">
          <View className="empty-icon-badge">
            <Image
                source={icons.search}
                className="size-7"
                style={{ tintColor: "#a1a1aa" }}
                resizeMode="contain"
            />
          </View>
          <View className="items-center">
            <Text className="text-foreground text-lg font-sans-bold text-center">
              No movies found
            </Text>
            <Text className="text-muted-foreground text-sm font-sans text-center mt-1.5 max-w-[260px]">
              We couldn't find any films matching "{searchQuery || selectedGenre}".
              Try another search term.
            </Text>
          </View>
          <Pressable
              onPress={resetFilters}
              className="mt-2 rounded-xl bg-primary px-5 py-3 active:scale-[0.95]"
          >
            <Text className="text-foreground font-sans-bold text-sm">
              Reset All Filters
            </Text>
          </Pressable>
        </View>
    );
  };

  // --- Footer Loader for Infinite Scroll ---
  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 20 }} />;
    return (
        <View className="py-6 items-center justify-center">
          <ActivityIndicator size="small" color="#4f46e5" />
        </View>
    );
  };

  return (
      <SafeAreaView
          className="flex-1"
          style={{ backgroundColor: isDark ? "#09090b" : "#f8fafc" }}
      >
        <View
            className="vault-screen"
            style={{ backgroundColor: isDark ? "#09090b" : "#f8fafc" }}
        >
          {/* Title */}
          <View className="mb-3">
            <Text
                className={`screen-title ${
                    isDark ? "text-foreground" : "text-foreground-light"
                }`}
            >
              Discover
            </Text>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-card border border-border rounded-2xl px-4 py-3.5 mb-4">
            <Image
                source={icons.search}
                className="size-5 mr-3"
                style={{ tintColor: "#a1a1aa" }}
                resizeMode="contain"
            />
            <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search TMDB for movies..."
                placeholderTextColor="#a1a1aa"
                className="flex-1 text-foreground font-sans text-sm p-0"
                selectionColor="#4f46e5"
                returnKeyType="search"
            />
            {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")} className="px-2 py-1">
                  <Text className="text-muted-foreground text-xs font-sans-medium">
                    Clear
                  </Text>
                </Pressable>
            )}
          </View>

          {/* Horizontal Genre Filter Bar */}
          <View className="mb-6">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
            >
              {GENRES.map((genre) => {
                const isSelected = selectedGenre === genre;
                return (
                    <Pressable
                        key={genre}
                        onPress={() => setSelectedGenre(genre)}
                        className={`rounded-full px-4 py-2 border active:scale-[0.95] ${
                            isSelected
                                ? "bg-primary border-primary"
                                : "bg-card border-border"
                        }`}
                    >
                      <Text
                          className={`text-xs ${
                              isSelected
                                  ? "text-foreground font-sans-bold"
                                  : "text-muted-foreground font-sans-medium"
                          }`}
                      >
                        {genre}
                      </Text>
                    </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Loading Spinner OR Live TMDB Infinite Scroll Grid */}
          {loading ? (
              <View className="flex-1 items-center justify-center py-20">
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text className="text-muted-foreground font-sans text-xs mt-3">
                  Fetching Hollywood's latest...
                </Text>
              </View>
          ) : (
              <FlatList
                  data={filteredMovies}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 110,
                    flexGrow: 1,
                  }}
                  columnWrapperStyle={
                    filteredMovies.length > 0
                        ? { justifyContent: "space-between" }
                        : undefined
                  }
                  ListEmptyComponent={renderEmptyState}
                  // --- Infinite Scrolling & Pull-to-Refresh ---
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.2}
                  ListFooterComponent={renderFooter}
                  refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#4f46e5"
                        colors={["#4f46e5"]}
                    />
                  }
                  // ---------------------------------------------
                  renderItem={({ item }) => (
                      <MovieCard
                          movie={item}
                          isSaved={items.some((vaultItem) => vaultItem.id === item.id)}
                          onQuickAdd={() => toggleSave(item.id)}
                          onPress={() => setSelectedMovie(item)}
                      />
                  )}
              />
          )}
        </View>

        {/* Slide-Up Movie Detail Modal */}
        <MovieDetailModal
            movie={selectedMovie}
            visible={!!selectedMovie}
            isSaved={
              selectedMovie
                  ? items.some((vaultItem) => vaultItem.id === selectedMovie.id)
                  : false
            }
            onClose={() => setSelectedMovie(null)}
            onToggleSave={() => {
              if (selectedMovie) {
                toggleSave(selectedMovie.id);
              }
            }}
        />
      </SafeAreaView>
  );
}