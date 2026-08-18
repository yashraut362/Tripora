import { router } from "expo-router";
import { Input } from "@/components/ui/input";
import { DestinationHero } from "@/components/wizard/hero-destination";
import { WizardScreen } from "@/components/wizard/wizard-screen";
import { useTripStore } from "@/stores/trip-store";

export default function DestinationScreen() {
  const destination = useTripStore((s) => s.destination);
  const setDestination = useTripStore((s) => s.setDestination);

  return (
    <WizardScreen
      step={1}
      title="Where do you want to go?"
      subtitle="Type any destination."
      hero={<DestinationHero />}
      nextDisabled={destination.trim().length === 0}
      onNext={() => router.push("/plan/days")}
      avoidKeyboard
    >
      <Input
        value={destination}
        onChangeText={setDestination}
        placeholder="e.g. Paris, Tokyo, Bali…"
        autoCorrect={false}
        autoCapitalize="words"
        returnKeyType="done"
        className="h-14 px-4 text-lg"
      />
    </WizardScreen>
  );
}
