// constants/theme.ts
export const colors = {
    background: "#09090b",
    foreground: "#fafafa",
    card: "#18181b",
    muted: "#27272a",
    mutedForeground: "#a1a1aa",
    primary: "#4f46e5",
    accent: "#818cf8",
    border: "#27272a",
    rating: "#f59e0b",
    surface: "#1e1b4b",
    success: "#16a34a",
    destructive: "#dc2626",
} as const;

export const spacing = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    18: 72,
    20: 80,
    24: 96,
    30: 120,
} as const;

export const components = {
    floatingTabBar: {
        height: spacing[16],
        horizontalInset: spacing[6],
        radius: spacing[7],
        iconFrame: spacing[10],
    },
    posterCard: {
        discoverWidth: 168,
        discoverHeight: 240,
        vaultWidth: 80,
        vaultHeight: 120,
    },
} as const;

export const theme = {
    colors,
    spacing,
    components,
} as const;