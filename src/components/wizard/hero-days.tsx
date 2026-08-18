import { View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  ZoomIn,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useLoop } from "./use-loop";

const ORBIT_RADIUS = 118;

export function DaysHero({ days }: { days: number }) {
  const spin = useLoop({ duration: 14000, reverse: false, linear: true });
  const breathe = useLoop({ duration: 2600 });

  const orbit = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));

  const disc = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(breathe.value, [0, 1], [1, 1.04]) }],
  }));

  return (
    <View className="flex-1 items-center justify-center">
      {/* Orbit ring with sun and moon on opposite sides */}
      <Animated.View
        style={orbit}
        className="absolute items-center justify-center"
        pointerEvents="none"
      >
        <View style={{ width: ORBIT_RADIUS * 2, height: ORBIT_RADIUS * 2 }}>
          <Text className="absolute left-1/2 top-0 -ml-4 text-3xl">☀️</Text>
          <Text className="absolute bottom-0 left-1/2 -ml-4 text-3xl">🌙</Text>
        </View>
      </Animated.View>

      {/* Day counter disc */}
      <Animated.View
        style={disc}
        className="h-44 w-44 items-center justify-center rounded-full bg-accent shadow-lg shadow-black/10"
      >
        <Animated.View key={days} entering={ZoomIn.springify().damping(12)}>
          <Text className="text-7xl font-extrabold leading-none text-accent-foreground">
            {days}
          </Text>
        </Animated.View>
        <Text className="text-base font-semibold text-accent-foreground/70">
          {days === 1 ? "day" : "days"}
        </Text>
      </Animated.View>
    </View>
  );
}
