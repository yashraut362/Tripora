import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { TRAVEL_IMAGES } from "@/lib/travel-images";

const EASE = Easing.bezier(0.32, 0.72, 0, 1);
const LETTERS = "Tripora".split("");
const EXIT_AT = 3000;

interface AnimatedSplashProps {
  onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const doneRef = useRef(false);
  const finishRef = useRef<() => void>(() => {});
  const overlayOpacity = useSharedValue(1);
  const bob = useSharedValue(0);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const planeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(bob.value, [0, 1], [5, -7]) },
      { rotate: `${interpolate(bob.value, [0, 1], [-2, 2])}deg` },
    ],
  }));

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    bob.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );

    const finish = (fadeMs: number) => {
      if (doneRef.current) return;
      doneRef.current = true;
      overlayOpacity.value = withTiming(0, { duration: fadeMs, easing: EASE });
      setTimeout(onFinish, fadeMs + 50);
    };

    const timer = setTimeout(() => finish(500), EXIT_AT);
    finishRef.current = () => finish(300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
        overlayStyle,
      ]}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-background"
        onPress={() => finishRef.current()}
      >
        <Animated.View
          entering={ZoomIn.springify().damping(14).stiffness(120)}
          className="items-center justify-center"
        >
          <View className="absolute h-56 w-56 rounded-full bg-secondary/70" />
          <View className="absolute -right-2 top-2 h-10 w-10 rounded-full bg-accent" />
          <View className="absolute -left-4 bottom-6 h-6 w-6 rounded-full bg-primary/25" />
          <Animated.View style={planeStyle}>
            <Image
              source={TRAVEL_IMAGES.airplane}
              style={{ width: 230, height: 230 }}
              contentFit="contain"
              transition={150}
            />
          </Animated.View>
        </Animated.View>

        <View className="mt-6 flex-row">
          {LETTERS.map((letter, index) => (
            <Animated.Text
              key={index}
              entering={FadeInUp.delay(450 + index * 60)
                .duration(600)
                .easing(EASE)}
              className="font-sans-bold text-5xl text-foreground"
            >
              {letter}
            </Animated.Text>
          ))}
          <Animated.Text
            entering={FadeInUp.delay(450 + LETTERS.length * 60)
              .duration(600)
              .easing(EASE)}
            className="font-sans-bold text-5xl text-primary"
          >
            .
          </Animated.Text>
        </View>

        <Animated.View entering={FadeInUp.delay(1500).duration(650).easing(EASE)}>
          <Text className="mt-3 font-sans-medium text-base text-muted-foreground">
            plan your next adventure
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
