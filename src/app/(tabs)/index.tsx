import { Image } from "expo-image";
import { Redirect, router } from "expo-router";
import { PencilSimple, Plus, TrashSimple } from "phosphor-react-native";
import { Alert, ScrollView, View } from "react-native";
import Animated, { Easing, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScalePressable } from "@/components/scale-pressable";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";
import { TRAVEL_IMAGES } from "@/lib/travel-images";
import { ACTIVITIES } from "@/lib/trip-data";
import { useTripStore, type Trip } from "@/stores/trip-store";

const EASE = Easing.bezier(0.32, 0.72, 0, 1);
// Keep the last list row clear of the floating tab bar (64 tall + 12 offset + breathing room).
const TAB_BAR_CLEARANCE = 88;

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 items-center">
      <Text className="font-sans-bold text-lg text-foreground">{value}</Text>
      <Text className="mt-0.5 font-sans-medium text-xs text-muted-foreground">
        {label}
      </Text>
    </View>
  );
}

function TripRow({
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
  const colors = useThemeColors();
  const tripActivities = ACTIVITIES.filter((a) =>
    trip.activities.includes(a.id),
  );

  return (
    <Animated.View
      entering={FadeInUp.delay(160 + index * 70)
        .duration(600)
        .easing(EASE)}
    >
      <View className="mb-3 rounded-[24px] bg-card px-5 py-4">
        <View className="flex-row items-center">
          <View className="flex-1 pr-3">
            <Text
              className="font-sans-bold text-lg text-foreground"
              numberOfLines={1}
            >
              {trip.destination}
            </Text>
            <Text className="mt-1 font-sans-medium text-xs text-muted-foreground">
              {trip.days} {trip.days === 1 ? "day" : "days"} · $
              {(trip.budget ?? 0).toLocaleString()}
            </Text>
          </View>

          <View className="flex-row gap-2">
            <ScalePressable
              onPress={onEdit}
              hitSlop={4}
              className="h-10 w-10 items-center justify-center rounded-full bg-primary"
            >
              <PencilSimple size={15} weight="bold" color={colors.primaryForeground} />
            </ScalePressable>
            <ScalePressable
              onPress={onDelete}
              hitSlop={4}
              className="h-10 w-10 items-center justify-center rounded-full bg-muted"
            >
              <TrashSimple size={15} weight="bold" color={colors.destructive} />
            </ScalePressable>
          </View>
        </View>

        {tripActivities.length > 0 ? (
          <View className="mt-3 flex-row flex-wrap gap-1.5">
            {tripActivities.map((activity) => (
              <View
                key={activity.id}
                className="rounded-full bg-muted px-3 py-1.5"
              >
                <Text className="font-sans-semibold text-[11px] text-muted-foreground">
                  {activity.label}
                </Text>
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
  const hasHydrated = useTripStore((s) => s.hasHydrated);
  const startNewTrip = useTripStore((s) => s.startNewTrip);
  const startEditTrip = useTripStore((s) => s.startEditTrip);
  const deleteTrip = useTripStore((s) => s.deleteTrip);
  const colors = useThemeColors();

  // Wait for saved trips to load from disk before deciding where to land —
  // the animated splash is still covering the screen at this point.
  if (!hasHydrated) {
    return null;
  }

  if (trips.length === 0) {
    return <Redirect href="/plan/destination" />;
  }

  const totalDays = trips.reduce((sum, trip) => sum + trip.days, 0);
  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget ?? 0), 0);

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
      {/* Soft decorative blobs */}
      <View
        pointerEvents="none"
        className="absolute -right-16 -top-14 h-44 w-44 rounded-full bg-secondary/70"
      />
      <View
        pointerEvents="none"
        className="absolute -left-16 bottom-28 h-40 w-40 rounded-full bg-accent/60"
      />

      <View className="flex-1 px-6 pt-6">
        <Animated.View entering={FadeInUp.duration(600).easing(EASE)}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-1.5 w-8 rounded-full bg-primary" />
              <Text variant="eyebrow">Tripora</Text>
            </View>
            <Image
              source={TRAVEL_IMAGES.airplane}
              style={{ width: 44, height: 44 }}
              contentFit="contain"
            />
          </View>
          <View className="mt-2 flex-row items-center justify-between">
            <Text variant="h1">My Trips</Text>
            <ScalePressable
              onPress={planNewTrip}
              hitSlop={6}
              className="h-11 flex-row items-center gap-1.5 rounded-full bg-primary pl-4 pr-5"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 5,
              }}
            >
              <Plus size={16} weight="bold" color={colors.primaryForeground} />
              <Text className="font-sans-bold text-sm text-primary-foreground">
                New trip
              </Text>
            </ScalePressable>
          </View>
          <Text className="mt-1 font-sans-medium text-sm text-muted-foreground">
            {trips.length} {trips.length === 1 ? "adventure" : "adventures"} planned
          </Text>
        </Animated.View>

        {/* Summary strip */}
        <Animated.View
          entering={FadeInUp.delay(80).duration(600).easing(EASE)}
          className="mt-5 flex-row items-center rounded-[24px] bg-card py-4"
        >
          <Stat value={String(trips.length)} label="Trips" />
          <View className="h-8 w-px bg-border" />
          <Stat value={String(totalDays)} label="Days" />
          <View className="h-8 w-px bg-border" />
          <Stat value={`$${totalBudget.toLocaleString()}`} label="Budget" />
        </Animated.View>

        <ScrollView
          className="mt-5 flex-1"
          contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE }}
          showsVerticalScrollIndicator={false}
        >
          {trips.map((trip, index) => (
            <TripRow
              key={trip.id}
              trip={trip}
              index={index}
              onEdit={() => editTrip(trip.id)}
              onDelete={() => confirmDelete(trip)}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
