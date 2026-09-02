import { View } from "react-native";
import { StepIllustration } from "@/components/form/step-illustration";
import { Input } from "@/components/ui/input";
import { TRAVEL_IMAGES } from "@/lib/travel-images";

export function NotesStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View>
      <StepIllustration source={TRAVEL_IMAGES.suitcase} size={150} />

      <Input
        value={value}
        onChangeText={onChange}
        multiline
        textAlignVertical="top"
        placeholder="e.g. street food every day, one sunrise hike, slow mornings, skip museums…"
        className="mt-6 h-auto min-h-[130px] rounded-[24px] px-5 py-4 text-base leading-6"
      />
    </View>
  );
}
