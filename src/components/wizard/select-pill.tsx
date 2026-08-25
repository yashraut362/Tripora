import { ScalePressable } from "@/components/scale-pressable";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface SelectPillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectPill({ label, selected, onPress }: SelectPillProps) {
  return (
    <ScalePressable
      onPress={onPress}
      hitSlop={4}
      className={cn(
        "items-center justify-center rounded-full px-5 py-3",
        selected ? "bg-foreground" : "bg-card",
      )}
    >
      <Text
        className={cn(
          "font-sans-semibold text-sm",
          selected ? "text-background" : "text-foreground",
        )}
      >
        {label}
      </Text>
    </ScalePressable>
  );
}
