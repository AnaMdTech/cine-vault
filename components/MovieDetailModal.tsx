// components/MovieDetailModal.tsx
import { icons } from "@/constants/icons";
import React, { useRef } from "react";
import {
    Image,
    Modal,
    PanResponder,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

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
  // Native drag-to-dismiss gesture tracker for downward swipes
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10; // Only respond to downward drags
      },
      onPanResponderRelease: (_, gestureState) => {
        // If dragged down more than 80px or flicked fast downward -> close modal
        if (gestureState.dy > 80 || gestureState.vy > 0.8) {
          onClose();
        }
      },
    }),
  ).current;

  if (!movie) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* 1. Backdrop overlay: Tapping anywhere outside closes the modal */}
      <Pressable className="flex-1 justify-end bg-black/70" onPress={onClose}>
        {/* 2. Sheet Container: stopPropagation prevents inner taps from closing */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-card border-t border-border rounded-t-3xl pb-10 max-h-[85%]"
        >
          {/* 3. Drag Handle Area with PanResponder attached */}
          <View
            {...panResponder.panHandlers}
            className="w-full py-4 items-center justify-center cursor-grab active:opacity-70"
          >
            <View className="w-12 h-1.5 bg-muted rounded-full" />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          >
            {/* Movie Header Info (Poster + Title + Rating) */}
            <View className="flex-row gap-4 mb-5">
              <View className="w-28 h-40 rounded-xl overflow-hidden bg-muted border border-border">
                <Image
                  source={{ uri: movie.posterUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1 justify-center">
                <Text className="text-foreground text-2xl font-sans-extrabold leading-tight">
                  {movie.title}
                </Text>

                <Text className="text-muted-foreground text-sm font-sans mt-1">
                  {movie.releaseYear} • {movie.runtime} min
                </Text>

                {movie.rating && (
                  <View className="flex-row items-center mt-2">
                    <Image
                      source={icons.star}
                      className="size-4 mr-1.5"
                      style={{ tintColor: "#f59e0b" }}
                      resizeMode="contain"
                    />
                    <Text className="text-foreground font-sans-bold text-sm">
                      {movie.rating.toFixed(1)}
                    </Text>
                    <Text className="text-muted-foreground text-xs ml-1 font-sans">
                      / 10
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Genre Pills */}
            <View className="flex-row flex-wrap gap-2 mb-5">
              {movie.genres.map((genre) => (
                <View
                  key={genre}
                  className="rounded-full border border-border bg-muted px-3 py-1"
                >
                  <Text className="text-muted-foreground font-sans-medium text-xs">
                    {genre}
                  </Text>
                </View>
              ))}
            </View>

            {/* Synopsis / Overview */}
            <View className="mb-6">
              <Text className="text-muted-foreground font-sans-bold text-xs uppercase tracking-wider mb-2">
                Synopsis
              </Text>
              <Text className="text-foreground font-sans text-sm leading-relaxed">
                {movie.overview}
              </Text>
            </View>

            {/* CTA Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={onToggleSave}
                className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl active:scale-[0.95] ${
                  isSaved
                    ? "bg-success border border-success"
                    : "bg-primary border border-primary"
                }`}
              >
                <Image
                  source={isSaved ? icons.check : icons.plus}
                  className="size-5 mr-2"
                  style={{ tintColor: "#FAFAFA" }}
                  resizeMode="contain"
                />
                <Text className="text-foreground font-sans-bold text-base">
                  {isSaved ? "Saved in Vault" : "Save to Vault"}
                </Text>
              </Pressable>

              <Pressable
                onPress={onClose}
                className="items-center justify-center px-6 py-4 rounded-2xl bg-muted border border-border active:scale-[0.95]"
              >
                <Text className="text-foreground font-sans-medium text-base">
                  Close
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
