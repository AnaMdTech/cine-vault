// app/(tabs)/dna.tsx
import { icons } from "@/constants/icons";
import { useVault } from "@/contexts/VaultContext";
import { styled, useColorScheme } from "nativewind";
import React, { useMemo } from "react";
import { Image, Pressable, ScrollView, Share, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function CinemaDnaScreen() {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    // 1. Grab live persistent items from your Vault context
    const { items } = useVault();

    const palette = isDark
        ? {
            background: "#09090b",
            foreground: "#fafafa",
            card: "#18181b",
            muted: "#27272a",
            mutedForeground: "#a1a1aa",
            border: "#27272a",
            primary: "#4f46e5",
            accent: "#818cf8",
            surface: "#1e1b4b",
        }
        : {
            background: "#f8fafc",
            foreground: "#111827",
            card: "#ffffff",
            muted: "#e4e4e7",
            mutedForeground: "#52525b",
            border: "#d4d4d8",
            primary: "#4f46e5",
            accent: "#4338ca",
            surface: "#e0e7ff",
        };

    // 2. TRUE live analytics (Zero fake fallbacks!)
    const stats = useMemo(() => {
        const seenMovies = items.filter((item) => item.status === "seen");
        const totalSeen = seenMovies.length; // No more || 48!

        // Watch Time in Hours and Cinema Days
        const totalMinutes = seenMovies.reduce(
            (acc, curr) => acc + curr.runtime,
            0
        );
        const hours = Math.floor(totalMinutes / 60);
        const daysInCinema = (hours / 24).toFixed(1);

        // Average Star Rating (defaults to 0.0 when empty)
        const avgRating =
            totalSeen > 0
                ? (
                    seenMovies.reduce((acc, curr) => acc + (curr.userRating || 5), 0) /
                    totalSeen
                ).toFixed(1)
                : "0.0";

        // Top Genre & Vault Share Percentage
        const genreMap: Record<string, number> = {};
        seenMovies.forEach((movie) => {
            movie.genres.forEach((genre) => {
                genreMap[genre] = (genreMap[genre] || 0) + 1;
            });
        });

        const sortedGenres = Object.entries(genreMap).sort((a, b) => b[1] - a[1]);
        const topGenreName = sortedGenres[0]?.[0] || "None";
        const topGenreCount = sortedGenres[0]?.[1] || 0;
        const totalGenreTags =
            Object.values(genreMap).reduce((a, b) => a + b, 0) || 1;
        const topGenrePercentage =
            totalSeen > 0 ? Math.round((topGenreCount / totalGenreTags) * 100) : 0;

        // Only use real seen movies for favorites
        // Sort seen movies by highest personal rating, then highest TMDB rating
        const favorites = [...seenMovies]
            .sort((a, b) => {
                const userRatingA = a.userRating || 0;
                const userRatingB = b.userRating || 0;

                // 1. Sort by your star rating
                if (userRatingB !== userRatingA) {
                    return userRatingB - userRatingA;
                }

                // 2. Tie-breaker: TMDB overall score
                return (b.rating || 0) - (a.rating || 0);
            })
            .slice(0, 3);

        return {
            totalSeen,
            hours,
            daysInCinema,
            avgRating,
            topGenre: {
                name: topGenreName,
                percentage: topGenrePercentage,
            },
            favorites,
        };
    }, [items]);

    const handleShareStory = async () => {
        const shareText =
            stats.totalSeen > 0
                ? `My Cinema DNA: ${stats.hours} hrs logged across ${stats.totalSeen} films! Top genre: ${stats.topGenre.name}.`
                : "I just started tracking my Cinema DNA on CineVault!";

        try {
            await Share.share({
                message: shareText,
                title: "Share my Cinema DNA",
            });
        } catch (error) {
            console.log("Share Story failed:", error);
        }
    };

    // Prepare podium array safely based on how many films are seen
    const podiumPosters = [
        stats.favorites[1] || null, // Rank #2 (Left)
        stats.favorites[0] || null, // Rank #1 (Center)
        stats.favorites[2] || null, // Rank #3 (Right)
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: palette.background,
                    paddingHorizontal: 16,
                    paddingTop: 48,
                }}
            >
                {/* Header with Title & Theme Toggle Button */}
                <View className="flex-row items-center justify-between mb-5">
                    <View>
                        <Text
                            style={{
                                color: palette.foreground,
                                fontSize: 30,
                                fontWeight: "800",
                            }}
                        >
                            Cinema DNA
                        </Text>
                        <Text
                            style={{
                                color: palette.mutedForeground,
                                marginTop: 4,
                                fontSize: 14,
                            }}
                        >
                            Your lifetime watch archive
                        </Text>
                    </View>

                    {/* Theme Toggle Button */}
                    <Pressable
                        onPress={toggleColorScheme}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 999,
                            backgroundColor: palette.card,
                            borderColor: palette.border,
                            borderWidth: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: "#000",
                            shadowOpacity: 0.12,
                            shadowRadius: 8,
                            shadowOffset: { width: 0, height: 3 },
                            elevation: 4,
                        }}
                        accessibilityLabel="Toggle color scheme"
                    >
                        <Image
                            source={isDark ? icons.sun : icons.moon}
                            className="size-4"
                            style={{
                                tintColor: isDark ? "#f59e0b" : palette.foreground,
                            }}
                            resizeMode="contain"
                        />
                    </Pressable>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 110 }}
                >
                    {/* Hero Stat Banner */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderRadius: 24,
                            backgroundColor: palette.surface,
                            borderColor: `${palette.primary}66`,
                            borderWidth: 1,
                            padding: 24,
                            marginBottom: 24,
                            shadowColor: "#000",
                            shadowOpacity: 0.18,
                            shadowRadius: 10,
                            shadowOffset: { width: 0, height: 4 },
                            elevation: 5,
                        }}
                    >
                        {/* Left: Total Hours */}
                        <View>
                            <Text
                                style={{
                                    color: palette.foreground,
                                    fontSize: 30,
                                    fontWeight: "800",
                                }}
                            >
                                {stats.hours} hrs
                            </Text>
                            <Text
                                style={{
                                    color: palette.mutedForeground,
                                    marginTop: 4,
                                    fontSize: 12,
                                }}
                            >
                                {stats.daysInCinema} Days in Cinema
                            </Text>
                        </View>

                        {/* Right: Total Films Watched */}
                        <View style={{ alignItems: "flex-end" }}>
                            <Text
                                style={{
                                    color: palette.accent,
                                    fontSize: 30,
                                    fontWeight: "800",
                                }}
                            >
                                {stats.totalSeen}
                            </Text>
                            <Text
                                style={{
                                    color: palette.mutedForeground,
                                    marginTop: 4,
                                    fontSize: 12,
                                }}
                            >
                                Films Watched
                            </Text>
                        </View>
                    </View>

                    {/* All-Time Favorites Header + Share Story CTA */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 16,
                        }}
                    >
                        <Text
                            style={{
                                color: palette.foreground,
                                fontSize: 18,
                                fontWeight: "700",
                            }}
                        >
                            All-Time Favorites
                        </Text>
                        <Pressable
                            onPress={handleShareStory}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                                borderRadius: 999,
                                backgroundColor: palette.card,
                                borderColor: palette.border,
                                borderWidth: 1,
                                paddingHorizontal: 14,
                                paddingVertical: 6,
                            }}
                        >
                            <Image
                                source={icons.share}
                                className="size-3.5"
                                style={{ tintColor: palette.mutedForeground }}
                                resizeMode="contain"
                            />
                            <Text style={{ color: palette.mutedForeground, fontSize: 12 }}>
                                Share Story
                            </Text>
                        </Pressable>
                    </View>

                    {/* 3. Dynamic Podium Grid vs Empty State */}
                    {stats.totalSeen === 0 ? (
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 16,
                                backgroundColor: palette.card,
                                borderColor: palette.border,
                                borderWidth: 1,
                                paddingVertical: 36,
                                paddingHorizontal: 20,
                                marginBottom: 24,
                            }}
                        >
                            <Image
                                source={icons.film}
                                className="size-10 mb-3"
                                style={{ tintColor: palette.primary }}
                                resizeMode="contain"
                            />
                            <Text
                                style={{
                                    color: palette.foreground,
                                    fontSize: 16,
                                    fontWeight: "700",
                                    textAlign: "center",
                                }}
                            >
                                No Favorites Logged Yet
                            </Text>
                            <Text
                                style={{
                                    color: palette.mutedForeground,
                                    fontSize: 13,
                                    textAlign: "center",
                                    marginTop: 6,
                                    maxWidth: 240,
                                }}
                            >
                                Mark movies as "Seen" in your Vault to automatically build your
                                top podium!
                            </Text>
                        </View>
                    ) : (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-end",
                                justifyContent: "space-between",
                                gap: 12,
                                marginBottom: 24,
                            }}
                        >
                            {podiumPosters.map((movie, idx) => {
                                const isCenterFavorite = idx === 1;

                                // Render placeholder card if less than 3 movies are seen
                                if (!movie) {
                                    return (
                                        <View
                                            key={`empty-${idx}`}
                                            style={{
                                                flex: 1,
                                                borderRadius: 16,
                                                backgroundColor: palette.muted,
                                                borderColor: palette.border,
                                                borderWidth: 1,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                height: isCenterFavorite ? 176 : 144,
                                            }}
                                        >
                                            <Image
                                                source={icons.film}
                                                className="size-6"
                                                style={{ tintColor: palette.mutedForeground }}
                                                resizeMode="contain"
                                            />
                                        </View>
                                    );
                                }

                                return (
                                    <Pressable
                                        key={`${movie.id}-${idx}`}
                                        style={{
                                            flex: 1,
                                            borderRadius: 16,
                                            overflow: "hidden",
                                            backgroundColor: palette.muted,
                                            borderColor: palette.border,
                                            borderWidth: 1,
                                            shadowColor: "#000",
                                            shadowOpacity: 0.12,
                                            shadowRadius: 8,
                                            shadowOffset: { width: 0, height: 3 },
                                            elevation: 3,
                                            height: isCenterFavorite ? 176 : 144,
                                        }}
                                        onPress={() =>
                                            console.log("Selected Favorite:", movie.title)
                                        }
                                    >
                                        <Image
                                            source={{ uri: movie.posterUrl }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    </Pressable>
                                );
                            })}
                        </View>
                    )}

                    {/* Analytics 2-Card Row */}
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <View
                            style={{
                                flex: 1,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: palette.border,
                                backgroundColor: palette.card,
                                padding: 16,
                                justifyContent: "space-between",
                            }}
                        >
                            <View>
                                <Text style={{ color: palette.mutedForeground, fontSize: 12 }}>
                                    Top Genre
                                </Text>
                                <Text
                                    style={{
                                        color: palette.foreground,
                                        fontSize: 20,
                                        fontWeight: "800",
                                        marginTop: 4,
                                    }}
                                    numberOfLines={1}
                                >
                                    {stats.topGenre.name}
                                </Text>
                            </View>
                            <Text
                                style={{ color: palette.accent, fontSize: 12, marginTop: 12 }}
                            >
                                {stats.topGenre.percentage}% of your vault
                            </Text>
                        </View>

                        <View
                            style={{
                                flex: 1,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: palette.border,
                                backgroundColor: palette.card,
                                padding: 16,
                                justifyContent: "space-between",
                            }}
                        >
                            <View>
                                <Text style={{ color: palette.mutedForeground, fontSize: 12 }}>
                                    Avg Rating
                                </Text>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginTop: 4,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: palette.foreground,
                                            fontSize: 20,
                                            fontWeight: "800",
                                            marginRight: 6,
                                        }}
                                    >
                                        {stats.avgRating}
                                    </Text>
                                    <Image
                                        source={icons.star}
                                        className="size-4"
                                        style={{ tintColor: "#f59e0b" }}
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>
                            <Text
                                style={{
                                    color: palette.mutedForeground,
                                    fontSize: 12,
                                    marginTop: 12,
                                }}
                            >
                                Critical taste
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}