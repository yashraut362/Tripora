import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useColorScheme } from "react-native";
import { AnimatedSplash } from "@/components/animated-splash";
import { NAV_THEME } from "@/lib/theme";
import "../../global.css";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const [splashVisible, setSplashVisible] = useState(true);
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  // Native splash stays up until fonts resolve; the animated splash takes over from there.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
      {splashVisible && (
        <AnimatedSplash onFinish={() => setSplashVisible(false)} />
      )}
    </ThemeProvider>
  );
}
