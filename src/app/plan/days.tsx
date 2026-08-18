import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { Platform, useColorScheme, View } from "react-native";
import { Text } from "@/components/ui/text";
import { DaysHero } from "@/components/wizard/hero-days";
import { WizardScreen } from "@/components/wizard/wizard-screen";
import { THEME } from "@/lib/theme";
import { MAX_DAYS, MIN_DAYS } from "@/lib/trip-data";
import { useTripStore } from "@/stores/trip-store";

export default function DaysScreen() {
  const days = useTripStore((s) => s.days);
  const setDays = useTripStore((s) => s.setDays);

  const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
  const theme = THEME[colorScheme];

  return (
    <WizardScreen
      step={2}
      title="How many days?"
      subtitle="Drag the slider to set your trip length."
      hero={<DaysHero days={days} />}
      onNext={() => router.push("/plan/budget")}
    >
      <View>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={MIN_DAYS}
          maximumValue={MAX_DAYS}
          step={1}
          value={days}
          onValueChange={setDays}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.border}
          thumbTintColor={Platform.OS === "android" ? theme.primary : undefined}
        />
        <View className="mt-1 w-full flex-row justify-between">
          <Text variant="muted">{MIN_DAYS} day</Text>
          <Text variant="muted">{MAX_DAYS} days</Text>
        </View>
      </View>
    </WizardScreen>
  );
}
