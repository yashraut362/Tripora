import Slider from "@react-native-community/slider";
import { View } from "react-native";
import { SelectPill } from "@/components/form/select-pill";
import { StepIllustration } from "@/components/form/step-illustration";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";
import { TRAVEL_IMAGES } from "@/lib/travel-images";
import { BUDGET_PRESETS, DEFAULT_BUDGET } from "@/lib/trip-data";

export function BudgetStep({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const colors = useThemeColors();

  const handleChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "");
    onChange(digits.length > 0 ? parseInt(digits, 10) : null);
  };

  return (
    <View>
      <StepIllustration source={TRAVEL_IMAGES.lifebuoy} size={150} />

      <View className="mt-6 flex-row items-center overflow-hidden rounded-full bg-card">
        <View className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-primary/15">
          <Text className="font-sans-bold text-base text-primary">$</Text>
        </View>
        <Input
          value={value !== null ? String(value) : ""}
          onChangeText={handleChange}
          placeholder="1,000"
          keyboardType="number-pad"
          className="flex-1 bg-transparent pl-3"
        />
      </View>

      <Slider
        style={{ marginTop: 20, height: 40 }}
        minimumValue={100}
        maximumValue={10000}
        step={100}
        value={value ?? DEFAULT_BUDGET}
        onValueChange={onChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.muted}
        thumbTintColor={colors.primary}
      />
      <View className="flex-row justify-between px-1">
        <Text className="font-sans-medium text-xs text-muted-foreground">
          $100
        </Text>
        <Text className="font-sans-medium text-xs text-muted-foreground">
          $10,000
        </Text>
      </View>

      <View className="mt-5 flex-row flex-wrap gap-2">
        {BUDGET_PRESETS.map((preset) => (
          <SelectPill
            key={preset}
            label={`$${preset.toLocaleString()}`}
            selected={value === preset}
            onPress={() => onChange(preset)}
          />
        ))}
      </View>
    </View>
  );
}
