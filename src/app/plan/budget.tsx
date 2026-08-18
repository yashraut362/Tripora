import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { BudgetHero } from "@/components/wizard/hero-budget";
import { WizardScreen } from "@/components/wizard/wizard-screen";
import { cn } from "@/lib/utils";
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
          <View className="absolute bottom-0 left-4 top-0 z-10 justify-center">
            <Text className="text-lg font-bold text-muted-foreground">$</Text>
          </View>
          <Input
            value={budget !== null ? String(budget) : ""}
            onChangeText={handleChange}
            placeholder="0"
            keyboardType="number-pad"
            className="h-14 pl-9 text-lg"
            autoFocus
          />
        </View>

        <View className="mt-4 flex-row flex-wrap gap-2">
          {BUDGET_PRESETS.map((preset) => {
            const isSelected = budget === preset;
            return (
              <Pressable
                key={preset}
                onPress={() => setBudget(preset)}
                hitSlop={4}
                className={cn(
                  "h-11 items-center justify-center rounded-full border-2 px-5 active:opacity-80",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-border bg-muted/50 active:bg-muted",
                )}
              >
                <Text
                  className={cn(
                    "font-bold",
                    isSelected ? "text-primary-foreground" : "text-foreground",
                  )}
                >
                  ${preset.toLocaleString()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </WizardScreen>
  );
}
