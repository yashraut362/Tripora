import { Link } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
      <Text variant="h2" className="border-0">
        Tripora
      </Text>
      <Text variant="muted">React Native Reusables is wired up.</Text>
      <Button>
        <Text>Primary button</Text>
      </Button>
      <Button variant="secondary">
        <Text>Secondary</Text>
      </Button>
      <Link href="/settings" className="text-primary underline">
        Go to Settings
      </Link>
    </View>
  );
}
