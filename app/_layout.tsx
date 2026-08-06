// app/_layout.tsx
import { VaultProvider } from "@/contexts/VaultContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import "../global.css";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <VaultProvider>
      <View
        style={{ flex: 1, backgroundColor: isDark ? "#09090b" : "#f8fafc" }}
      >
        <StatusBar style={isDark ? "light" : "dark"} />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: isDark ? "#09090b" : "#f8fafc",
            },
          }}
        >
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </VaultProvider>
  );
}
