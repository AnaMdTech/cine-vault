import { icons } from "@/constants/icons";
import React, { useEffect, useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

interface VaultDetailModalProps {
  item: VaultItem | null;
  visible: boolean;
  onClose: () => void;
  onSave: (rating: number, notes: string) => void;
}

export const VaultDetailModal = ({
  item,
  visible,
  onClose,
  onSave,
}: VaultDetailModalProps) => {
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (item) {
      setRating(item.userRating ?? 5);
      setNotes(item.notes ?? "");
    }
  }, [item]);

  if (!item) return null;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-end bg-black/70" onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-card border-t border-border rounded-t-3xl pb-10 max-h-[90%]"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          >
            <View className="w-full py-4 items-center justify-center">
              <View className="w-12 h-1.5 bg-muted rounded-full" />
            </View>

            <View className="flex-row gap-4 mb-5">
              <View className="w-28 h-40 rounded-xl overflow-hidden bg-muted border border-border">
                <Image
                  source={{ uri: item.posterUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1 justify-center">
                <Text className="text-foreground text-2xl font-sans-extrabold leading-tight">
                  {item.title}
                </Text>
                <Text className="text-muted-foreground text-sm font-sans mt-1">
                  {item.releaseYear} • {item.runtime} min
                </Text>
                <Text className="text-muted-foreground text-sm font-sans mt-2">
                  {item.genres.join(" • ")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-muted-foreground font-sans-bold text-xs uppercase tracking-wider mb-2">
                Overview
              </Text>
              <Text className="text-foreground font-sans text-sm leading-relaxed">
                {item.overview}
              </Text>
            </View>

            <View className="mb-5">
              <Text className="text-muted-foreground font-sans-bold text-xs uppercase tracking-wider mb-2">
                My Rating
              </Text>
              <View className="flex-row items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Pressable
                    key={value}
                    onPress={() => setRating(value)}
                    className="rounded-full p-1"
                  >
                    <Image
                      source={icons.star}
                      className="size-5"
                      style={{
                        tintColor: value <= rating ? "#f59e0b" : "#52525b",
                      }}
                      resizeMode="contain"
                    />
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-muted-foreground font-sans-bold text-xs uppercase tracking-wider mb-2">
                Notes
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="What made this one worth saving?"
                placeholderTextColor="#a1a1aa"
                multiline
                className="rounded-2xl border border-border bg-muted px-4 py-3 text-foreground font-sans text-sm"
                style={{ textAlignVertical: "top", minHeight: 110 }}
              />
            </View>

            <Pressable
              onPress={() => {
                onSave(rating, notes);
                onClose();
              }}
              className="rounded-2xl bg-primary px-4 py-4 items-center justify-center active:scale-[0.95]"
            >
              <Text className="text-foreground font-sans-bold text-base">
                Add to Seen
              </Text>
            </Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
