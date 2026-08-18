import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { BudgetHero } from "@/components/wizard/hero-budget";
import { WizardScreen } from "@/components/wizard/wizard-screen";
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
      title="What's your budget?"
      subtitle="Total trip budget in US dollars."
      hero={<BudgetHero />}
      nextDisabled={budget === null || budget <= 0}
      onNext={() => router.push("/plan/activities")}
      avoidKeyboard
    >
      <View>
        <View className="relative">
          <View className="absolute bottom-0 left-3 top-0 z-10 justify-center">
            <Text variant="muted" className="text-base">
              $
            </Text>
          </View>
          <Input
            value={budget !== null ? String(budget) : ""}
            onChangeText={handleChange}
            placeholder="0"
            keyboardType="number-pad"
            className="pl-8"
            autoFocus
          />
        </View>

        <View className="mt-4 flex-row flex-wrap gap-2">
          {BUDGET_PRESETS.map((preset) => (
            <Pressable key={preset} onPress={() => setBudget(preset)}>
              <Badge
                variant={budget === preset ? "default" : "outline"}
                className="px-4 py-1.5"
              >
                <Text>${preset.toLocaleString()}</Text>
              </Badge>
            </Pressable>
          ))}
        </View>
      </View>
    </WizardScreen>
  );
}
