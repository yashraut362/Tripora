import { Image } from "expo-image";
import type { ImageSourcePropType } from "react-native";
import { View } from "react-native";
import { cn } from "@/lib/utils";

interface StepIllustrationProps {
  source: ImageSourcePropType;
  size?: number;
  /** Pastel blob behind the illustration. */
  blobClass?: string;
}

/** A travel illustration floating on a soft pastel blob. */
export function StepIllustration({
  source,
  size = 160,
  blobClass = "bg-secondary/70",
}: StepIllustrationProps) {
  return (
    <View className="items-center justify-center py-2">
      <View
        className={cn("absolute rounded-full", blobClass)}
        style={{ width: size, height: size }}
      />
      <View className="absolute -right-1 top-1 h-8 w-8 rounded-full bg-primary/20" />
      <View className="absolute -left-3 bottom-4 h-5 w-5 rounded-full bg-accent" />
      <Image
        source={source}
        style={{ width: size, height: size }}
        contentFit="contain"
        transition={150}
      />
    </View>
  );
}
