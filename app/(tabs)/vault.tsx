// app/(tabs)/vault.tsx
import { VaultCard } from "@/components/VaultCard";
import { VaultDetailModal } from "@/components/VaultDetailModal";
import { icons } from "@/constants/icons";
import { useVault } from "@/contexts/VaultContext";
import { useRouter } from "expo-router";
import { styled, useColorScheme } from "nativewind";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const MEDIA_TYPES: { label: string; value: "all" | MediaType }[] = [
  { label: "All", value: "all" },
  { label: "Movies", value: "movie" },
  { label: "TV Shows", value: "tv" },
];

const GENRES = ["All", "Romance", "Sci-Fi", "Action", "Drama", "Adventure"];

export default function VaultScreen() {
  const router = useRouter();
  const { items, markSeen } = useVault();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [activeTab, setActiveTab] = useState<MediaStatus>("wishlist");
  const [selectedType, setSelectedType] = useState<"all" | MediaType>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedVaultItem, setSelectedVaultItem] = useState<VaultItem | null>(
    null,
  );

  // Calculate live counts for the segmented pill control
  const wishlistCount = useMemo(
    () => items.filter((item) => item.status === "wishlist").length,
    [items],
  );
  const seenCount = useMemo(
    () => items.filter((item) => item.status === "seen").length,
    [items],
  );
  const totalCount = wishlistCount + seenCount;

  // Filter items by status tab, media type, and genre
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab = item.status === activeTab;
      const matchesType =
        selectedType === "all" || item.mediaType === selectedType;
      const matchesGenre =
        selectedGenre === "All" || item.genres.includes(selectedGenre);
      return matchesTab && matchesType && matchesGenre;
    });
  }, [items, activeTab, selectedType, selectedGenre]);

  const handleToggleSeen = (id: string) => {
    const item = items.find((entry) => entry.id === id);

    if (item) {
      setSelectedVaultItem(item);
    }
  };

  const handleSaveDetails = (rating: number, notes: string) => {
    if (!selectedVaultItem) return;

    markSeen(selectedVaultItem.id, rating, notes);
    setActiveTab("seen");
    setSelectedVaultItem(null);
  };

  // Custom Empty State matching Screenshot 1
  const renderEmptyState = () => (
    <View className="empty-state-container mt-16">
      <View className="empty-icon-badge">
        <Image
          source={icons.film}
          className="size-8"
          style={{ tintColor: "#818cf8" }}
          resizeMode="contain"
        />
      </View>
      <View className="items-center">
        <Text className="text-foreground text-xl font-sans-bold text-center">
          Your {activeTab === "wishlist" ? "Wishlist" : "Seen List"} is Empty
        </Text>
        <Text className="text-muted-foreground text-sm font-sans text-center mt-2 max-w-[280px]">
          {activeTab === "wishlist"
            ? "Explore trending films on TMDB and save them to watch later."
            : "Mark films as seen from your wishlist to build your personal rating history."}
        </Text>
      </View>
      <Pressable
        onPress={() => router.push("/")}
        className="mt-3 rounded-2xl bg-primary px-6 py-3.5 active:scale-[0.95]"
      >
        <Text className="text-foreground font-sans-bold text-sm">
          + Discover Movies
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
        {/* 1. Header with Title & Total Count Badge */}
        <View className="flex-row items-center gap-3 mb-4">
          <Text className={`screen-title ${ isDark ? "text-foreground" : "text-foreground-light" }` }>My Vault</Text>
          <View className="rounded-full bg-card border border-border px-3 py-1">
            <Text className="text-muted-foreground font-sans-medium text-xs">
              {totalCount} {totalCount === 1 ? "Title" : "Titles"}
            </Text>
          </View>
        </View>

        {/* 2. Segmented Pill Control (Wishlist vs Seen) */}
        <View className="segmented-track mb-4">
          <Pressable
            onPress={() => setActiveTab("wishlist")}
            className={
              activeTab === "wishlist"
                ? "segmented-item-active"
                : "segmented-item-inactive"
            }
          >
            <Text
              className={`text-sm ${
                activeTab === "wishlist"
                  ? "text-foreground font-sans-bold"
                  : "text-muted-foreground font-sans-medium"
              }`}
            >
              Wishlist • {wishlistCount}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("seen")}
            className={
              activeTab === "seen"
                ? "segmented-item-active"
                : "segmented-item-inactive"
            }
          >
            <Text
              className={`text-sm ${
                activeTab === "seen"
                  ? "text-foreground font-sans-bold"
                  : "text-muted-foreground font-sans-medium"
              }`}
            >
              Seen • {seenCount}
            </Text>
          </Pressable>
        </View>

        {/* 3. Media Type Filters (All / Movies / TV Shows) */}
        <View className="flex-row gap-2 mb-3">
          {MEDIA_TYPES.map((type) => {
            const isSelected = selectedType === type.value;
            return (
              <Pressable
                key={type.value}
                onPress={() => setSelectedType(type.value)}
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
                  {type.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 4. Horizontal Genre Filter Bar */}
        <View className="mb-5">
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
                      ? "bg-muted border-border"
                      : "bg-card/60 border-border"
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

        {/* 5. Filtered Vault Items List */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 110,
            flexGrow: 1,
          }}
          ListEmptyComponent={renderEmptyState}
          renderItem={({ item }) => (
            <VaultCard
              item={item}
              onToggleSeen={() => handleToggleSeen(item.id)}
              onPress={() => {
                setSelectedVaultItem(item);
              }}
            />
          )}
        />
      </View>

      <VaultDetailModal
        item={selectedVaultItem}
        visible={!!selectedVaultItem}
        onClose={() => setSelectedVaultItem(null)}
        onSave={handleSaveDetails}
      />
    </SafeAreaView>
  );
}
