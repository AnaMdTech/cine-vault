// components/MovieDetailModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { icons } from "@/constants/icons";
import { useColorScheme } from "nativewind";
import { fetchMovieDetails, TMDBMovieDetails } from "@/services/tmdb";

interface MovieDetailModalProps {
  movie: Movie | null;
  visible: boolean;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: () => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
                                                                    movie,
                                                                    visible,
                                                                    isSaved,
                                                                    onClose,
                                                                    onToggleSave,
                                                                  }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [details, setDetails] = useState<TMDBMovieDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  // Fetch live runtimes, cast, and trailers whenever a movie is opened
  useEffect(() => {
    if (!movie || !visible) {
      setDetails(null);
      return;
    }

    let isMounted = true;
    setLoadingDetails(true);

    fetchMovieDetails(movie.id)
        .then((res) => {
          if (isMounted) setDetails(res);
        })
        .finally(() => {
          if (isMounted) setLoadingDetails(false);
        });

    return () => {
      isMounted = false;
    };
  }, [movie, visible]);

  if (!movie) return null;

  // Format runtime minutes (e.g. 135 -> "2h 15m")
  const formatRuntime = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hrs > 0 ? `${hrs}h ${remainingMins}m` : `${remainingMins}m`;
  };

  const openTrailer = (key?: string) => {
    if (!key) return;
    Linking.openURL(`https://www.youtube.com/watch?v=${key}`);
  };

  // Safe rating check
  const movieRating = movie.rating ?? 0;

  return (
      <Modal
          visible={visible}
          animationType="slide"
          transparent={true}
          onRequestClose={onClose}
      >
        <View className="flex-1 justify-end bg-black/60">
          <Pressable className="flex-1" onPress={onClose} />

          <View
              className="rounded-t-3xl border-t border-border p-6 max-h-[85%]"
              style={{ backgroundColor: isDark ? "#121215" : "#ffffff" }}
          >
            {/* Modal Handle Bar */}
            <View className="w-12 h-1.5 rounded-full bg-border self-center mb-5" />

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header: Poster + Title + Metadata */}
              <View className="flex-row gap-4 mb-5">
                <Image
                    source={{ uri: movie.posterUrl }}
                    className="w-28 h-40 rounded-xl bg-muted shadow-md"
                    resizeMode="cover"
                />

                <View className="flex-1 justify-between py-1">
                  <View>
                    <Text
                        className={`font-sans-bold text-xl leading-snug ${
                            isDark ? "text-foreground" : "text-foreground-light"
                        }`}
                        numberOfLines={2}
                    >
                      {movie.title}
                    </Text>

                    <View className="flex-row items-center gap-3 mt-2">
                      <Text className="text-muted-foreground font-sans-medium text-xs">
                        {movie.releaseYear}
                      </Text>
                      <Text className="text-muted-foreground text-xs">•</Text>
                      <Text className="text-muted-foreground font-sans-medium text-xs">
                        {loadingDetails
                            ? "Loading..."
                            : formatRuntime(details?.runtime || movie.runtime)}
                      </Text>
                    </View>
                  </View>

                  {/* Rating Badge (Safely checked with ?? 0) */}
                  {movieRating > 0 && (
                      <View className="flex-row items-center bg-card border border-border px-3 py-1.5 rounded-full self-start">
                        <Image
                            source={icons.star}
                            className="size-3.5 mr-1.5"
                            style={{ tintColor: "#f59e0b" }}
                            resizeMode="contain"
                        />
                        <Text
                            className={`font-sans-bold text-xs ${
                                isDark ? "text-foreground" : "text-foreground-light"
                            }`}
                        >
                          {movieRating.toFixed(1)} / 10
                        </Text>
                      </View>
                  )}
                </View>
              </View>

              {/* Action Buttons Row (Save to Wishlist & Watch Trailer) */}
              <View className="flex-row gap-3 mb-6">
                <Pressable
                    onPress={onToggleSave}
                    className={`flex-1 flex-row items-center justify-center py-3.5 rounded-2xl active:scale-[0.98] ${
                        isSaved ? "bg-emerald-600" : "bg-primary"
                    }`}
                >
                  <Image
                      source={isSaved ? icons.check : icons.plus}
                      className="size-4 mr-2"
                      style={{ tintColor: "#FAFAFA" }}
                      resizeMode="contain"
                  />
                  <Text className="text-foreground font-sans-bold text-sm">
                    {isSaved ? "Saved to Vault" : "Add to Wishlist"}
                  </Text>
                </Pressable>

                {details?.trailerKey && (
                    <Pressable
                        onPress={() => openTrailer(details.trailerKey)}
                        className="flex-row items-center justify-center px-5 py-3.5 rounded-2xl bg-card border border-border active:scale-[0.98]"
                    >
                      <Image
                          source={icons.play || icons.film}
                          className="size-4 mr-2"
                          style={{ tintColor: isDark ? "#FAFAFA" : "#111827" }}
                          resizeMode="contain"
                      />
                      <Text
                          className={`font-sans-bold text-sm ${
                              isDark ? "text-foreground" : "text-foreground-light"
                          }`}
                      >
                        Trailer
                      </Text>
                    </Pressable>
                )}
              </View>

              {/* Genres Chips */}
              <View className="flex-row flex-wrap gap-2 mb-5">
                {movie.genres.map((genre) => (
                    <View
                        key={genre}
                        className="rounded-full bg-muted/60 px-3 py-1 border border-border"
                    >
                      <Text className="text-muted-foreground font-sans-medium text-xs">
                        {genre}
                      </Text>
                    </View>
                ))}
              </View>

              {/* Overview / Synopsis */}
              <View className="mb-6">
                <Text
                    className={`font-sans-bold text-sm mb-2 ${
                        isDark ? "text-foreground" : "text-foreground-light"
                    }`}
                >
                  Synopsis
                </Text>
                <Text className="text-muted-foreground font-sans text-sm leading-relaxed">
                  {movie.overview}
                </Text>
              </View>

              {/* Top-Billed Cast Section */}
              {loadingDetails ? (
                  <View className="py-4 items-center">
                    <ActivityIndicator size="small" color="#4f46e5" />
                  </View>
              ) : details?.cast && details.cast.length > 0 ? (
                  <View className="mb-8">
                    <Text
                        className={`font-sans-bold text-sm mb-3 ${
                            isDark ? "text-foreground" : "text-foreground-light"
                        }`}
                    >
                      Top Billed Cast
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12 }}
                    >
                      {details.cast.map((actor) => (
                          <View key={actor.id} className="w-20 items-center">
                            <Image
                                source={
                                  actor.profileUrl
                                      ? { uri: actor.profileUrl }
                                      : {
                                        uri: "https://via.placeholder.com/150?text=No+Image",
                                      }
                                }
                                className="size-16 rounded-full bg-muted mb-2 border border-border"
                                resizeMode="cover"
                            />
                            <Text
                                className={`font-sans-bold text-xs text-center ${
                                    isDark ? "text-foreground" : "text-foreground-light"
                                }`}
                                numberOfLines={1}
                            >
                              {actor.name}
                            </Text>
                            <Text
                                className="text-muted-foreground font-sans text-[10px] text-center mt-0.5"
                                numberOfLines={1}
                            >
                              {actor.character}
                            </Text>
                          </View>
                      ))}
                    </ScrollView>
                  </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
  );
};