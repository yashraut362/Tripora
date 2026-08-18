import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background p-6">
      <Text variant="h1">Tripora</Text>
      <Text variant="muted" className="tracking-widest">
        your ai travel planner
      </Text>
    </View>
  );
}
