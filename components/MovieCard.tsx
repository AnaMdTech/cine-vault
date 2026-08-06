import { icons } from "@/constants/icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import {useColorScheme} from "nativewind";

export const MovieCard = ({
  movie,
  isSaved,
  onQuickAdd,
  onPress,
}: MovieCardProps) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
  return (
    <Pressable onPress={onPress} className="discover-card active:opacity-80">
      {/* Poster Image Container */}
      <View className="relative overflow-hidden discover-poster border border-border">
        <Image
          source={{ uri: movie.posterUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Dynamic Quick-Add Badge using your @layer classes */}
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onQuickAdd();
          }}
          className="quick-add-badge"
          style={{ backgroundColor: isSaved ? "#16a34a" : "#4f46e5" }}
        >
          <Image
            source={isSaved ? icons.check : icons.plus}
            className="size-4"
            style={{ tintColor: "#FAFAFA" }}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* Movie Metadata Below Poster */}
      <View className="px-1">
        <Text
          className={`font-sans-semibold text-base leading-tight ${ isDark ? "text-foreground" : "text-foreground-light"}`}
          numberOfLines={1}
        >
          {movie.title}
        </Text>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-muted-foreground font-sans text-xs">
            {movie.releaseYear}
          </Text>
          {movie.rating && (
            <View className="flex-row items-center">
              <Image
                source={icons.star}
                className="size-3 mr-1"
                style={{ tintColor: "#f59e0b" }}
                resizeMode="contain"
              />
              <Text className="text-muted-foreground text-xs font-sans-medium">
                {movie.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};
