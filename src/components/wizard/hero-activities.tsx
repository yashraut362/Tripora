import { View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ACTIVITIES } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { useLoop } from "./use-loop";

// Scattered, hand-placed positions (percentages of the stage)
const BUBBLE_LAYOUT: {
  left: number;
  top: number;
  size: number;
  bg: string;
  duration: number;
  delay: number;
}[] = [
  { left: 8, top: 8, size: 76, bg: "bg-primary/15", duration: 2400, delay: 0 },
  { left: 40, top: 2, size: 64, bg: "bg-accent", duration: 2800, delay: 300 },
  { left: 70, top: 10, size: 80, bg: "bg-secondary", duration: 2600, delay: 600 },
  { left: 14, top: 38, size: 68, bg: "bg-destructive/15", duration: 3000, delay: 200 },
  { left: 44, top: 34, size: 84, bg: "bg-secondary", duration: 2500, delay: 800 },
  { left: 76, top: 44, size: 64, bg: "bg-primary/15", duration: 2900, delay: 400 },
  { left: 24, top: 66, size: 72, bg: "bg-accent", duration: 2700, delay: 1000 },
  { left: 58, top: 68, size: 76, bg: "bg-destructive/15", duration: 2300, delay: 500 },
];

function Bubble({
  emoji,
  selected,
  layout,
}: {
  emoji: string;
  selected: boolean;
  layout: (typeof BUBBLE_LAYOUT)[number];
}) {
  const bob = useLoop({ duration: layout.duration, delay: layout.delay });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(bob.value, [0, 1], [-7, 7]) },
      { scale: withSpring(selected ? 1.18 : 1, { damping: 14 }) },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          left: `${layout.left}%`,
          top: `${layout.top}%`,
          width: layout.size,
          height: layout.size,
        },
        style,
      ]}
      className={cn(
        "absolute items-center justify-center rounded-full",
        layout.bg,
        selected && "border-2 border-primary",
      )}
      pointerEvents="none"
    >
      <Text style={{ fontSize: layout.size * 0.45 }}>{emoji}</Text>
    </Animated.View>
  );
}

export function ActivitiesHero({ selected }: { selected: string[] }) {
  return (
    <View className="mx-4 flex-1">
      {ACTIVITIES.map((activity, i) => (
        <Bubble
          key={activity.id}
          emoji={activity.emoji}
          selected={selected.includes(activity.id)}
          layout={BUBBLE_LAYOUT[i % BUBBLE_LAYOUT.length]}
        />
      ))}
    </View>
  );
}
