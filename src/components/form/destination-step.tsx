import { MapPin } from "phosphor-react-native";
import { View } from "react-native";
import { StepIllustration } from "@/components/form/step-illustration";
import { Input } from "@/components/ui/input";
import { useThemeColors } from "@/lib/theme";
import { TRAVEL_IMAGES } from "@/lib/travel-images";

export function DestinationStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const colors = useThemeColors();

  return (
    <View>
      <StepIllustration source={TRAVEL_IMAGES.camperVanMap} size={180} />

      <View className="mt-6 flex-row items-center overflow-hidden rounded-full bg-card">
        <View className="pl-5">
          <MapPin size={20} weight="bold" color={colors.primary} />
        </View>
        <Input
          value={value}
          onChangeText={onChange}
          placeholder="e.g. Bali, Tokyo, Lisbon…"
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="done"
          className="flex-1 bg-transparent pl-3"
        />
      </View>
    </View>
  );
}
