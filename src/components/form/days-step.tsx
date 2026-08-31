import { Minus, Plus } from "phosphor-react-native";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SelectPill } from "@/components/form/select-pill";
import { StepIllustration } from "@/components/form/step-illustration";
import { ScalePressable } from "@/components/scale-pressable";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";
import { TRAVEL_IMAGES } from "@/lib/travel-images";
import { MAX_DAYS, MIN_DAYS } from "@/lib/trip-data";
import { cn } from "@/lib/utils";

const DURATION_PRESETS = [
  { label: "Weekend · 3", days: 3 },
  { label: "One week · 7", days: 7 },
  { label: "Two weeks · 14", days: 14 },
];

export function DaysStep({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const colors = useThemeColors();

  const adjust = (delta: number) =>
    onChange(Math.min(MAX_DAYS, Math.max(MIN_DAYS, value + delta)));

  return (
    <View className="flex-1 items-center justify-center">
      <StepIllustration
        source={TRAVEL_IMAGES.suitcase}
        size={150}
        blobClass="bg-accent/80"
      />

      <View className="mt-4 flex-row items-center gap-3">
        <Animated.View key={value} entering={FadeIn.duration(200)}>
          <Text className="font-sans-bold text-[64px] leading-[72px] text-foreground">
            {value}
          </Text>
        </Animated.View>
        <View className="rounded-full bg-card px-4 py-1.5">
          <Text className="font-sans-semibold text-sm text-muted-foreground">
            {value === 1 ? "day" : "days"}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row gap-4">
        <ScalePressable
          onPress={() => adjust(-1)}
          disabled={value <= MIN_DAYS}
          hitSlop={6}
          className={cn(
            "h-14 w-14 items-center justify-center rounded-full bg-card",
            value <= MIN_DAYS && "opacity-30",
          )}
        >
          <Minus size={20} weight="bold" color={colors.foreground} />
        </ScalePressable>
        <ScalePressable
          onPress={() => adjust(1)}
          disabled={value >= MAX_DAYS}
          hitSlop={6}
          className={cn(
            "h-14 w-14 items-center justify-center rounded-full bg-primary",
            value >= MAX_DAYS && "opacity-30",
          )}
        >
          <Plus size={20} weight="bold" color={colors.primaryForeground} />
        </ScalePressable>
      </View>

      <View className="mt-6 flex-row flex-wrap justify-center gap-2">
        {DURATION_PRESETS.map((preset) => (
          <SelectPill
            key={preset.days}
            label={preset.label}
            selected={value === preset.days}
            onPress={() => onChange(preset.days)}
          />
        ))}
      </View>
    </View>
  );
}
