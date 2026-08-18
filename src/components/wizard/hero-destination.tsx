import { View } from "react-native";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useLoop } from "./use-loop";

function Cloud({
  className,
  drift,
  duration,
  delay,
}: {
  className: string;
  drift: number;
  duration: number;
  delay?: number;
}) {
  const t = useLoop({ duration, delay });
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(t.value, [0, 1], [-drift, drift]) }],
  }));

  return (
    <Animated.View style={style} className={className} pointerEvents="none">
      <View className="h-8 w-24 rounded-full bg-white/95 dark:bg-white/20" />
      <View className="-mt-6 ml-6 h-9 w-12 rounded-full bg-white/95 dark:bg-white/20" />
    </Animated.View>
  );
}

export function DestinationHero() {
  const bob = useLoop({ duration: 2200 });
  const pulse = useLoop({ duration: 3000 });

  const plane = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(bob.value, [0, 1], [-12, 12]) },
      { rotate: `${interpolate(bob.value, [0, 1], [-5, 3])}deg` },
    ],
  }));

  const sun = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.12]) }],
  }));

  return (
    <View className="flex-1">
      {/* Sun */}
      <Animated.View
        style={sun}
        className="absolute right-8 top-6 h-20 w-20 rounded-full bg-accent"
      >
        <View className="m-3 flex-1 rounded-full bg-yellow-300" />
      </Animated.View>

      {/* Clouds */}
      <Cloud className="absolute left-6 top-16" drift={26} duration={5200} />
      <Cloud className="absolute right-10 top-36" drift={20} duration={6400} delay={600} />
      <Cloud className="absolute left-16 top-56" drift={32} duration={5800} delay={1200} />

      {/* Rolling hills peeking from behind the form sheet */}
      <View className="absolute -bottom-24 -left-16 h-56 w-72 rounded-full bg-secondary" />
      <View className="absolute -bottom-32 -right-20 h-64 w-80 rounded-full bg-primary/20" />

      {/* Plane */}
      <View className="flex-1 items-center justify-center">
        <Animated.Text style={plane} className="text-8xl">
          ✈️
        </Animated.Text>
      </View>
    </View>
  );
}
