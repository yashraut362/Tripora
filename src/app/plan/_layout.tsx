import { router, Stack, useSegments } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";
import { WIZARD_STEPS } from "@/lib/trip-data";

const EASE = Easing.bezier(0.32, 0.72, 0, 1);

export default function PlanLayout() {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const colors = useThemeColors();

  const currentSegment = segments[segments.length - 1];
  const stepIndex = Math.max(
    0,
    WIZARD_STEPS.indexOf(currentSegment as (typeof WIZARD_STEPS)[number]),
  );

  const progress = useSharedValue((stepIndex + 1) / WIZARD_STEPS.length);

  useEffect(() => {
    progress.value = withTiming((stepIndex + 1) / WIZARD_STEPS.length, {
      duration: 650,
      easing: EASE,
    });
  }, [stepIndex, progress]);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));

  const canGoBack = stepIndex > 0 || router.canGoBack();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-4 px-6 py-3">
        {canGoBack ? (
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full bg-card active:bg-muted"
          >
            <CaretLeft size={18} weight="bold" color={colors.foreground} />
          </Pressable>
        ) : (
          <View className="h-10 w-10" />
        )}

        <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <Animated.View
            style={[barStyle, { transformOrigin: "left" }]}
            className="h-full w-full rounded-full bg-primary"
          />
        </View>

        <Text className="font-sans-semibold text-[11px] tracking-[2px] text-muted-foreground">
          {String(stepIndex + 1).padStart(2, "0")} / 0{WIZARD_STEPS.length}
        </Text>
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </View>
  );
}
