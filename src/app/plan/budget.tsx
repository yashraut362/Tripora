import { router } from "expo-router";
import { View } from "react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { SelectPill } from "@/components/wizard/select-pill";
import { StepIllustration } from "@/components/wizard/step-illustration";
import { WizardScreen } from "@/components/wizard/wizard-screen";
import { TRAVEL_IMAGES } from "@/lib/travel-images";
import { BUDGET_PRESETS } from "@/lib/trip-data";
import { useTripStore } from "@/stores/trip-store";

export default function BudgetScreen() {
  const budget = useTripStore((s) => s.budget);
  const setBudget = useTripStore((s) => s.setBudget);

  const handleChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "");
    setBudget(digits.length > 0 ? parseInt(digits, 10) : null);
  };

  return (
    <WizardScreen
      step={3}
      eyebrow="Budget"
      title="And the budget?"
      subtitle="Total for the whole trip, in US dollars — it keeps the plan afloat."
      nextDisabled={budget === null || budget <= 0}
      onNext={() => router.push("/plan/activities")}
      avoidKeyboard
    >
      <View>
        <StepIllustration source={TRAVEL_IMAGES.lifebuoy} size={150} />

        <View className="mt-6 flex-row items-center overflow-hidden rounded-full bg-card">
          <View className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-primary/15">
            <Text className="font-sans-bold text-base text-primary">$</Text>
          </View>
          <Input
            value={budget !== null ? String(budget) : ""}
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
              selected={budget === preset}
              onPress={() => setBudget(preset)}
            />
          ))}
        </View>
      </View>
    </WizardScreen>
  );
}
