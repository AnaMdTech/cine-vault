// app/(tabs)/_layout.tsx
import React from "react";
import { View, Image } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, components } from "@/constants/theme";
import { tabs } from "@/constants/data";

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const { floatingTabBar } = components;

    const TabIcon = ({ focused, icon }: TabIconProps) => {
        return (
            <View className="tabs-icon">
                <View className={focused ? "tabs-pill tabs-active" : "tabs-pill"}>
                    <Image
                        source={icon}
                        className="tabs-glyph"
                        style={{ tintColor: focused ? "#FAFAFA" : "#71717A" }}
                        resizeMode="contain"
                    />
                </View>
            </View>
        );
    };

    return (
        <Tabs
            initialRouteName="index"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: Math.max(insets.bottom, floatingTabBar.horizontalInset),
                    height: floatingTabBar.height,
                    marginHorizontal: floatingTabBar.horizontalInset,
                    borderRadius: floatingTabBar.radius,
                    backgroundColor: colors.card,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    elevation: 0,
                },
                tabBarItemStyle: {
                    paddingVertical:
                        floatingTabBar.height / 2 - floatingTabBar.iconFrame / 1.6,
                },
                tabBarIconStyle: {
                    width: floatingTabBar.iconFrame,
                    height: floatingTabBar.iconFrame,
                    alignItems: "center",
                },
            }}
        >
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={tab.icon} />
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
}