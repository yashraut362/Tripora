import { router, Stack, useSegments } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { WIZARD_STEPS } from "@/lib/trip-data";

export default function PlanLayout() {
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  const currentSegment = segments[segments.length - 1];
  const stepIndex = Math.max(
    0,
    WIZARD_STEPS.indexOf(currentSegment as (typeof WIZARD_STEPS)[number]),
  );

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 px-4 py-2">
        {stepIndex > 0 || router.canGoBack() ? (
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <Icon as={ChevronLeft} className="size-6" />
          </Button>
        ) : (
          <View className="h-10 w-10" />
        )}
        <View className="flex-1 pr-4">
          <Progress value={((stepIndex + 1) / WIZARD_STEPS.length) * 100} indicatorClassName="bg-primary" />
        </View>
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </View>
  );
}
