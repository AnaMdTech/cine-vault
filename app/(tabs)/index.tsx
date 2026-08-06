// app/(tabs)/index.tsx
import { MovieCard } from "@/components/MovieCard";
import { MovieDetailModal } from "@/components/MovieDetailModal";
import { MOCK_TRENDING_MOVIES } from "@/constants/data";
import { icons } from "@/constants/icons";
import { useVault } from "@/contexts/VaultContext";
import { styled, useColorScheme } from "nativewind";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const GENRES = ["All", "Sci-Fi", "Action", "Drama", "Animation", "Adventure"];

export default function DiscoverScreen() {
  const { items, addToVault, removeFromVault } = useVault();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const toggleSave = (id: string) => {
    const alreadySaved = items.some((item) => item.id === id);

    if (alreadySaved) {
      removeFromVault(id);
    } else {
      const movie = MOCK_TRENDING_MOVIES.find((entry) => entry.id === id);
      if (movie) {
        addToVault(movie);
      }
    }
  };

  // Filter mock movies by both Search Query AND Genre Chip
  const filteredMovies = useMemo(() => {
    return MOCK_TRENDING_MOVIES.filter((movie) => {
      const matchesGenre =
        selectedGenre === "All" || movie.genres.includes(selectedGenre);
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesGenre && matchesSearch;
    });
  }, [selectedGenre, searchQuery]);

  // Reset helper for when no results are found
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenre("All");
  };

  // Custom Empty State when search/filter returns zero movies
  const renderEmptyState = () => (
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

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? "#09090b" : "#f8fafc" }}
    >
      <View
        className="vault-screen"
        style={{ backgroundColor: isDark ? "#09090b" : "#f8fafc" }}
      >
        {/* 1. Clean Title */}
        <View className="mb-3">
          <Text className={`screen-title ${ isDark ? "text-foreground" : "text-foreground-light" }` }>Discover</Text>
        </View>

        {/* 2. Full-Width Search Bar */}
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

        {/* 3. Horizontal Genre Filter Bar */}
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

        {/* 4. 2-Column Poster Grid + Empty State Handling */}
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 110,
            flexGrow: 1, // Ensures EmptyState centers nicely
          }}
          columnWrapperStyle={
            filteredMovies.length > 0
              ? { justifyContent: "space-between" }
              : undefined
          }
          ListEmptyComponent={renderEmptyState}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              isSaved={items.some((vaultItem) => vaultItem.id === item.id)}
              onQuickAdd={() => toggleSave(item.id)}
              onPress={() => setSelectedMovie(item)}
            />
          )}
        />
      </View>

      {/* 5. Slide-Up Movie Detail Modal */}
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
