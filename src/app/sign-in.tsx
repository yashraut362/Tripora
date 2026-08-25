import { Image } from "expo-image";
import { GoogleLogo } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScalePressable } from "@/components/scale-pressable";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/api";
import { useThemeColors } from "@/lib/theme";
import { TRAVEL_IMAGES } from "@/lib/travel-images";

const EASE = Easing.bezier(0.32, 0.72, 0, 1);

export default function SignIn() {
  const colors = useThemeColors();
  const [connecting, setConnecting] = useState(false);
  const bob = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [bob]);

  const planeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(bob.value, [0, 1], [5, -7]) },
      { rotate: `${interpolate(bob.value, [0, 1], [-2, 2])}deg` },
    ],
  }));

  const connect = async () => {
    setConnecting(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      if (error) {
        Alert.alert("Sign-in failed", error.message ?? "Please try again.");
      }
    } catch {
      Alert.alert("Sign-in failed", "Could not reach the server.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center">
        <View className="items-center justify-center">
          <View className="absolute h-56 w-56 rounded-full bg-secondary/70" />
          <View className="absolute -right-2 top-2 h-10 w-10 rounded-full bg-accent" />
          <View className="absolute -left-4 bottom-6 h-6 w-6 rounded-full bg-primary/25" />
          <Animated.View style={planeStyle}>
            <Image
              source={TRAVEL_IMAGES.airplane}
              style={{ width: 230, height: 230 }}
              contentFit="contain"
            />
          </Animated.View>
        </View>

        <View className="mt-6 flex-row">
          <Text className="font-sans-bold text-5xl text-foreground">
            Tripora
          </Text>
          <Text className="font-sans-bold text-5xl text-primary">.</Text>
        </View>

        <Text className="mt-3 font-sans-medium text-base text-muted-foreground">
          plan your next adventure
        </Text>
      </View>

      <Animated.View
        entering={FadeInUp.delay(250).duration(650).easing(EASE)}
        className="absolute inset-x-0 bottom-0 px-8 pb-14"
      >
        <ScalePressable
          onPress={connect}
          disabled={connecting}
          className="h-16 flex-row items-center justify-center gap-3 rounded-full bg-foreground"
        >
          <GoogleLogo size={20} weight="bold" color={colors.background} />
          <Text className="font-sans-bold text-base text-background">
            {connecting ? "Connecting…" : "Continue with Google"}
          </Text>
        </ScalePressable>
        <Text className="mt-4 text-center font-sans-medium text-xs text-muted-foreground">
          Sign in to keep your trips with you.
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}
