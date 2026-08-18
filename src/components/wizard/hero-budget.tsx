import { View } from "react-native";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useLoop } from "./use-loop";

function Coin({
  left,
  duration,
  delay,
}: {
  left: number;
  duration: number;
  delay: number;
}) {
  const t = useLoop({ duration, delay, reverse: false, linear: true });

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 0.15, 0.75, 1], [0, 1, 1, 0]),
    transform: [
      { translateY: interpolate(t.value, [0, 1], [-150, -14]) },
      { rotate: `${interpolate(t.value, [0, 1], [-30, 25])}deg` },
    ],
  }));

  return (
    <Animated.Text
      style={[{ left: `${left}%` }, style]}
      className="absolute bottom-1/2 text-4xl"
      pointerEvents="none"
    >
      🪙
    </Animated.Text>
  );
}

function Sparkle({
  className,
  duration,
  delay,
}: {
  className: string;
  duration: number;
  delay: number;
}) {
  const t = useLoop({ duration, delay });
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.15, 1]),
    transform: [{ scale: interpolate(t.value, [0, 1], [0.8, 1.15]) }],
  }));

  return (
    <Animated.Text style={style} className={className} pointerEvents="none">
      ✨
    </Animated.Text>
  );
}

export function BudgetHero() {
  const wiggle = useLoop({ duration: 1900 });

  const piggy = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(wiggle.value, [0, 1], [0, -8]) },
      { rotate: `${interpolate(wiggle.value, [0, 1], [-3, 3])}deg` },
    ],
  }));

  return (
    <View className="flex-1">
      {/* Soft backdrop blobs */}
      <View className="absolute -left-12 top-8 h-40 w-40 rounded-full bg-accent/60" />
      <View className="absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-secondary" />

      <Sparkle className="absolute left-10 top-12 text-2xl" duration={1600} delay={0} />
      <Sparkle className="absolute right-12 top-24 text-xl" duration={1900} delay={500} />
      <Sparkle className="absolute left-16 bottom-24 text-xl" duration={1700} delay={900} />

      <Coin left={38} duration={1500} delay={0} />
      <Coin left={52} duration={1700} delay={550} />
      <Coin left={62} duration={1600} delay={1100} />

      <View className="flex-1 items-center justify-end pb-6">
        <Animated.Text style={piggy} className="text-8xl">
          🐷
        </Animated.Text>
      </View>
    </View>
  );
}
