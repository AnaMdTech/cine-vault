// app/_layout.tsx
import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  return (
      <View className="flex-1 bg-background">
        {/* Force light status bar text for our dark #09090B background */}
        <StatusBar style="light" />

        <Stack
            screenOptions={{
              headerShown: false,
              // Ensures any new screen default background stays pure dark zinc
              contentStyle: { backgroundColor: "#09090b" },
            }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
  );
}