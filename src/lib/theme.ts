import {
  DarkTheme,
  DefaultTheme,
  type Theme,
} from "expo-router/react-navigation";
import { useColorScheme } from "react-native";

export const THEME = {
  light: {
    background: "hsl(45 42% 95%)",
    foreground: "hsl(45 6% 24%)",
    card: "hsl(45 50% 99%)",
    cardForeground: "hsl(45 6% 24%)",
    popover: "hsl(45 50% 99%)",
    popoverForeground: "hsl(45 6% 24%)",
    primary: "hsl(12 68% 63%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(187 24% 82%)",
    secondaryForeground: "hsl(190 15% 25%)",
    muted: "hsl(45 25% 90%)",
    mutedForeground: "hsl(45 6% 45%)",
    accent: "hsl(66 28% 82%)",
    accentForeground: "hsl(68 15% 25%)",
    destructive: "hsl(8 65% 52%)",
    border: "hsl(45 20% 86%)",
    input: "hsl(45 20% 86%)",
    ring: "hsl(12 68% 63%)",
    radius: "1.5rem",
  },
  dark: {
    background: "hsl(45 8% 9%)",
    foreground: "hsl(45 25% 92%)",
    card: "hsl(45 7% 13%)",
    cardForeground: "hsl(45 25% 92%)",
    popover: "hsl(45 7% 13%)",
    popoverForeground: "hsl(45 25% 92%)",
    primary: "hsl(12 65% 62%)",
    primaryForeground: "hsl(0 0% 100%)",
    secondary: "hsl(190 15% 22%)",
    secondaryForeground: "hsl(187 25% 80%)",
    muted: "hsl(45 6% 16%)",
    mutedForeground: "hsl(45 8% 63%)",
    accent: "hsl(66 12% 22%)",
    accentForeground: "hsl(66 25% 80%)",
    destructive: "hsl(8 60% 55%)",
    border: "hsl(45 6% 19%)",
    input: "hsl(45 6% 19%)",
    ring: "hsl(12 65% 62%)",
    radius: "1.5rem",
  },
};

export function useThemeColors() {
  const scheme = useColorScheme();
  return THEME[scheme === "dark" ? "dark" : "light"];
}

export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
