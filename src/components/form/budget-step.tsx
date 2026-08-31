import { View } from "react-native";
import { SelectPill } from "@/components/form/select-pill";
import { StepIllustration } from "@/components/form/step-illustration";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { TRAVEL_IMAGES } from "@/lib/travel-images";
import { BUDGET_PRESETS } from "@/lib/trip-data";

export function BudgetStep({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
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
