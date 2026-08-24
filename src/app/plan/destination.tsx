import { router } from "expo-router";
import { MapPin } from "phosphor-react-native";
import { View } from "react-native";
import { Input } from "@/components/ui/input";
import { StepIllustration } from "@/components/wizard/step-illustration";
import { WizardScreen } from "@/components/wizard/wizard-screen";
import { useThemeColors } from "@/lib/theme";
import { TRAVEL_IMAGES } from "@/lib/travel-images";
import { useTripStore } from "@/stores/trip-store";

export default function DestinationScreen() {
  const destination = useTripStore((s) => s.destination);
  const setDestination = useTripStore((s) => s.setDestination);
  const colors = useThemeColors();

  return (
    <WizardScreen
      step={1}
      eyebrow="Destination"
      title="Where to?"
      subtitle="A city, an island, a country — anywhere you've been meaning to go."
      nextDisabled={destination.trim().length === 0}
      onNext={() => router.push("/plan/days")}
      avoidKeyboard
    >
      <View>
        <StepIllustration source={TRAVEL_IMAGES.camperVanMap} size={180} />

        <View className="mt-6 flex-row items-center overflow-hidden rounded-full bg-card">
          <View className="pl-5">
            <MapPin size={20} weight="bold" color={colors.primary} />
          </View>
          <Input
            value={destination}
            onChangeText={setDestination}
            placeholder="e.g. Bali, Tokyo, Lisbon…"
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="done"
            className="flex-1 bg-transparent pl-3"
          />
        </View>
      </View>
    </WizardScreen>
  );
}
