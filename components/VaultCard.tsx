// components/VaultCard.tsx
import { icons } from "@/constants/icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

export const VaultCard = ({ item, onToggleSeen, onPress }: VaultCardProps) => {
  // Generates array of 5 stars for the Seen list rating
  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, idx) => (
      <Image
        key={idx}
        source={icons.star}
        className="size-3.5 mr-1"
        style={{ tintColor: idx < rating ? "#f59e0b" : "#27272a" }}
        resizeMode="contain"
      />
    ));
  };

  return (
    <Pressable onPress={onPress} className="vault-card active:opacity-80">
      {/* Left: Poster Image */}
      <View className="relative overflow-hidden vault-poster border border-border">
        <Image
          source={{ uri: item.posterUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Right: Movie Details & Dynamic Footer */}
      <View className="flex-1 justify-between py-1">
        <View>
          <Text
            className="text-foreground font-sans-bold text-base leading-tight"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text
            className="text-muted-foreground font-sans text-xs mt-1"
            numberOfLines={1}
          >
            {item.releaseYear} • {item.runtime} min • {item.genres[0]}
          </Text>
        </View>

        {/* Dynamic Action Area: Wishlist CTA vs Seen Stars */}
        <View className="mt-3 flex-row items-center">
          {item.status === "wishlist" ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onToggleSeen();
              }}
              className="flex-row items-center justify-center bg-primary/90 border border-primary px-4 py-2 rounded-xl active:scale-[0.95]"
            >
              <Image
                source={icons.check}
                className="size-3.5 mr-1.5"
                style={{ tintColor: "#FAFAFA" }}
                resizeMode="contain"
              />
              <Text className="text-foreground font-sans-bold text-xs">
                Mark as Seen
              </Text>
            </Pressable>
          ) : (
            <View className="flex-row items-center py-1">
              {renderStars(item.userRating || 5)}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};
