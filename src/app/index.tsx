import { Redirect, router } from "expo-router";
import {
  CalendarDays,
  Pencil,
  Plus,
  Trash2,
  Wallet,
  type LucideIcon,
} from "lucide-react-native";
import { Alert, Pressable, ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ACTIVITIES } from "@/lib/trip-data";
import { useTripStore, type Trip } from "@/stores/trip-store";

const CHIP_EMOJIS = ["🌍", "🏝️", "🗻", "🌆", "🎒", "🗺️"];
const CHIP_COLORS = [
  "bg-primary/15",
  "bg-secondary",
  "bg-accent",
  "bg-destructive/10",
];

function StatPill({ icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
      <Icon as={icon} className="size-3.5 text-muted-foreground" />
      <Text className="text-xs font-semibold text-muted-foreground">{label}</Text>
    </View>
  );
}

function RoundIconButton({
  icon,
  iconClass,
  onPress,
}: {
  icon: LucideIcon;
  iconClass: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      className="h-9 w-9 items-center justify-center rounded-full bg-muted/70 active:bg-muted"
    >
      <Icon as={icon} className={cn("size-4", iconClass)} />
    </Pressable>
  );
}

function TripCard({
  trip,
  index,
  onEdit,
  onDelete,
}: {
  trip: Trip;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const emojis = ACTIVITIES.filter((a) => trip.activities.includes(a.id)).map(
    (a) => a.emoji,
  );

  return (
    <Animated.View entering={FadeInDown.delay(100 + index * 80).duration(400)}>
      <View className="mb-4 rounded-3xl border border-border/60 bg-card p-4 shadow-sm shadow-black/5">
        <View className="flex-row items-center gap-3">
          <View
            className={cn(
              "h-14 w-14 items-center justify-center rounded-2xl",
              CHIP_COLORS[index % CHIP_COLORS.length],
            )}
          >
            <Text className="text-3xl">
              {CHIP_EMOJIS[index % CHIP_EMOJIS.length]}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-xl font-extrabold" numberOfLines={1}>
              {trip.destination}
            </Text>
            <View className="mt-1.5 flex-row gap-2">
              <StatPill
                icon={CalendarDays}
                label={`${trip.days} ${trip.days === 1 ? "day" : "days"}`}
              />
              <StatPill icon={Wallet} label={`$${(trip.budget ?? 0).toLocaleString()}`} />
            </View>
          </View>

          <View className="gap-2">
            <RoundIconButton icon={Pencil} iconClass="text-primary" onPress={onEdit} />
            <RoundIconButton
              icon={Trash2}
              iconClass="text-destructive"
              onPress={onDelete}
            />
          </View>
        </View>

        {emojis.length > 0 ? (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {emojis.map((emoji) => (
              <View
                key={emoji}
                className="h-9 w-9 items-center justify-center rounded-full bg-muted/70"
              >
                <Text className="text-base">{emoji}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

export default function Index() {
  const trips = useTripStore((s) => s.trips);
  const startNewTrip = useTripStore((s) => s.startNewTrip);
  const startEditTrip = useTripStore((s) => s.startEditTrip);
  const deleteTrip = useTripStore((s) => s.deleteTrip);

  if (trips.length === 0) {
    return <Redirect href="/plan/destination" />;
  }

  const planNewTrip = () => {
    startNewTrip();
    router.push("/plan/destination");
  };

  const editTrip = (id: string) => {
    startEditTrip(id);
    router.push("/plan/destination");
  };

  const confirmDelete = (trip: Trip) => {
    Alert.alert("Delete trip?", `${trip.destination} will be removed.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTrip(trip.id) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 overflow-hidden bg-background">
      {/* Soft decorative blobs, matching the wizard heroes */}
      <View
        pointerEvents="none"
        className="absolute -right-16 -top-10 h-48 w-48 rounded-full bg-accent/60"
      />
      <View
        pointerEvents="none"
        className="absolute -left-20 bottom-24 h-56 w-56 rounded-full bg-secondary/50"
      />

      <View className="flex-1 px-6 pt-4">
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text className="text-xs font-bold uppercase tracking-[3px] text-primary">
            Tripora ✈️
          </Text>
          <Text variant="h1" className="mt-1 text-left font-extrabold">
            Your trips
          </Text>
          <Text variant="muted" className="mt-1">
            {trips.length} {trips.length === 1 ? "adventure" : "adventures"} planned
          </Text>
        </Animated.View>

        <ScrollView
          className="mt-6 flex-1"
          contentContainerClassName="pb-4"
          showsVerticalScrollIndicator={false}
        >
          {trips.map((trip, index) => (
            <TripCard
              key={trip.id}
              trip={trip}
              index={index}
              onEdit={() => editTrip(trip.id)}
              onDelete={() => confirmDelete(trip)}
            />
          ))}
        </ScrollView>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="pb-4">
          <Button size="lg" className="h-14 w-full rounded-full" onPress={planNewTrip}>
            <Icon as={Plus} className="size-5 text-primary-foreground" />
            <Text className="text-lg font-bold">Plan a new trip</Text>
          </Button>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
