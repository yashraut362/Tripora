import { Stack } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { PortalHost } from "@rn-primitives/portal";
import { useState } from "react";
import { useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { AnimatedSplash } from "@/components/animated-splash";
import { NAV_THEME } from "@/lib/theme";
import "../../global.css";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const [splashVisible, setSplashVisible] = useState(true);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <StatusBar
        style={
          splashVisible || colorScheme === "dark" ? "light" : "dark"
        }
      />
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost />
      {splashVisible && (
        <AnimatedSplash onFinish={() => setSplashVisible(false)} />
      )}
    </ThemeProvider>
  );
}
