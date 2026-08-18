import { Redirect } from "expo-router";
import { CalendarDays, MapPin, Wallet, type LucideIcon } from "lucide-react-native";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ACTIVITIES } from "@/lib/trip-data";
import { useTripStore } from "@/stores/trip-store";

function SummaryRow({
  icon,
  label,
  value,
  chipClass,
  iconClass,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  chipClass: string;
  iconClass: string;
}) {
  return (
    <View className="flex-row items-center gap-4 py-3">
      <View className={`h-11 w-11 items-center justify-center rounded-full ${chipClass}`}>
        <Icon as={icon} className={`size-5 ${iconClass}`} />
      </View>
      <View className="flex-1">
        <Text variant="muted">{label}</Text>
        <Text className="text-lg font-bold">{value}</Text>
      </View>
    </View>
  );
}

export default function Index() {
  const completed = useTripStore((s) => s.completed);
  const destination = useTripStore((s) => s.destination);
  const days = useTripStore((s) => s.days);
  const budget = useTripStore((s) => s.budget);
  const activities = useTripStore((s) => s.activities);
  const reset = useTripStore((s) => s.reset);

  if (!completed) {
    return <Redirect href="/plan/destination" />;
  }

  const selectedActivities = ACTIVITIES.filter((a) => activities.includes(a.id));

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-4">
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text variant="muted" className="uppercase tracking-widest">
            Tripora
          </Text>
          <Text variant="h1" className="mt-1 text-left">
            Your trip
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Card className="mt-6">
            <CardContent className="py-2">
              <SummaryRow
                icon={MapPin}
                label="Destination"
                value={destination}
                chipClass="bg-primary/15"
                iconClass="text-primary"
              />
              <View className="h-px bg-border/50" />
              <SummaryRow
                icon={CalendarDays}
                label="Duration"
                value={`${days} ${days === 1 ? "day" : "days"}`}
                chipClass="bg-secondary"
                iconClass="text-secondary-foreground"
              />
              <View className="h-px bg-border/50" />
              <SummaryRow
                icon={Wallet}
                label="Budget"
                value={`$${(budget ?? 0).toLocaleString()}`}
                chipClass="bg-accent"
                iconClass="text-accent-foreground"
              />
            </CardContent>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mt-6">
          <Text variant="muted" className="mb-3 uppercase tracking-widest">
            Activities
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {selectedActivities.map((activity) => (
              <Badge key={activity.id} variant="secondary" className="px-3 py-1.5">
                <Text>{activity.emoji}</Text>
                <Text className="font-semibold">{activity.label}</Text>
              </Badge>
            ))}
          </View>
        </Animated.View>

        <View className="flex-1" />

        <Animated.View entering={FadeInDown.delay(450).duration(400)} className="pb-4">
          <Button size="lg" variant="outline" className="w-full" onPress={reset}>
            <Text>Plan a new trip</Text>
          </Button>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
