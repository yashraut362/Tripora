import { Redirect, router, useLocalSearchParams } from "expo-router";
import { CaretLeft, MapPin, PencilSimple } from "phosphor-react-native";
import { Linking, ScrollView, View } from "react-native";
import Animated, { Easing, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScalePressable } from "@/components/scale-pressable";
import { Text } from "@/components/ui/text";
import { StepIllustration } from "@/components/wizard/step-illustration";
import {
  buildItinerary,
  buildTripIntro,
  mapsUrl,
  type ItineraryDay,
} from "@/lib/itinerary";
import { useThemeColors } from "@/lib/theme";
import { TRAVEL_IMAGES } from "@/lib/travel-images";
import { ACTIVITIES } from "@/lib/trip-data";
import { useTripStore } from "@/stores/trip-store";
import { cn } from "@/lib/utils";

const EASE = Easing.bezier(0.32, 0.72, 0, 1);

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

function DaySection({
  itineraryDay,
  index,
  destination,
}: {
  itineraryDay: ItineraryDay;
  index: number;
  destination: string;
}) {
  const colors = useThemeColors();
  const inkDay = index % 2 === 1;

  return (
    <Animated.View
      entering={FadeInUp.delay(240 + index * 70)
        .duration(600)
        .easing(EASE)}
      className="mb-5"
    >
      <View className="flex-row items-center gap-3">
        <View
          className={cn(
            "rounded-full px-4 py-1.5",
            inkDay ? "bg-foreground" : "bg-primary",
          )}
        >
          <Text
            className={cn(
              "font-sans-bold text-xs",
              inkDay ? "text-background" : "text-primary-foreground",
            )}
          >
            Day {itineraryDay.day}
          </Text>
        </View>
        <Text className="flex-1 font-sans-bold text-base text-foreground">
          {itineraryDay.theme}
        </Text>
      </View>

      {/* Stops hang off a left rail */}
      <View className="ml-4 mt-3 border-l border-border pl-4">
        {itineraryDay.stops.map((stop) => (
          <View key={stop.slot} className="relative mb-3">
            <View className="absolute -left-[21.5px] top-5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
            <View className="rounded-[20px] bg-card px-4 py-3">
              <View className="flex-row items-center justify-between">
                <Text className="font-sans-bold text-[10px] uppercase tracking-[2px] text-muted-foreground">
                  {stop.slot}
                </Text>
                <ScalePressable
                  onPress={() =>
                    Linking.openURL(mapsUrl(stop.mapsQuery, destination))
                  }
                  hitSlop={6}
                  className="flex-row items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5"
                >
                  <MapPin size={12} weight="fill" color={colors.primary} />
                  <Text className="font-sans-bold text-[11px] text-primary">
                    Map
                  </Text>
                </ScalePressable>
              </View>
              <Text className="mt-1 font-sans-bold text-base text-foreground">
                {stop.title}
              </Text>
              <Text className="mt-0.5 font-sans-medium text-xs leading-4 text-muted-foreground">
                {stop.detail}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = useTripStore((s) => s.trips.find((t) => t.id === id));
  const startEditTrip = useTripStore((s) => s.startEditTrip);
  const colors = useThemeColors();

  if (!trip) {
    return <Redirect href="/" />;
  }

  const tripActivities = ACTIVITIES.filter((a) =>
    trip.activities.includes(a.id),
  );
  const artwork = tripActivities[0]?.image ?? TRAVEL_IMAGES.airplane;
  const itinerary = buildItinerary(trip);
  const stopCount = itinerary.reduce((sum, d) => sum + d.stops.length, 0);

  const editTrip = () => {
    startEditTrip(trip.id);
    router.push("/plan/destination");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 py-3">
        <ScalePressable
          onPress={() => router.back()}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full bg-card"
        >
          <CaretLeft size={18} weight="bold" color={colors.foreground} />
        </ScalePressable>
        <ScalePressable
          onPress={editTrip}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full bg-card"
        >
          <PencilSimple size={16} weight="bold" color={colors.primary} />
        </ScalePressable>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Animated.View entering={FadeInUp.duration(600).easing(EASE)}>
          <StepIllustration source={artwork} size={150} />
          <View className="mt-2 flex-row items-center gap-3">
            <View className="h-1.5 w-8 rounded-full bg-primary" />
            <Text variant="eyebrow">Itinerary</Text>
          </View>
          <Text variant="h1" className="mt-3">
            {trip.destination}
          </Text>
          <Text className="mt-2 font-sans-medium text-sm leading-5 text-muted-foreground">
            {buildTripIntro(trip)}
          </Text>
        </Animated.View>

        {/* Trip facts */}
        <Animated.View
          entering={FadeInUp.delay(80).duration(600).easing(EASE)}
          className="mt-5 flex-row items-center rounded-[24px] bg-card py-4"
        >
          <Stat
            value={String(trip.days)}
            label={trip.days === 1 ? "Day" : "Days"}
          />
          <View className="h-8 w-px bg-border" />
          <Stat value={`$${(trip.budget ?? 0).toLocaleString()}`} label="Budget" />
          <View className="h-8 w-px bg-border" />
          <Stat value={String(stopCount)} label="Stops" />
        </Animated.View>

        {tripActivities.length > 0 ? (
          <Animated.View
            entering={FadeInUp.delay(140).duration(600).easing(EASE)}
            className="mt-3 flex-row flex-wrap gap-1.5"
          >
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
          </Animated.View>
        ) : null}

        {/* Day-by-day timeline */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(600).easing(EASE)}
          className="mb-4 mt-7 flex-row items-center gap-3"
        >
          <View className="h-1.5 w-8 rounded-full bg-primary" />
          <Text variant="eyebrow">Day by day</Text>
        </Animated.View>

        {itinerary.map((itineraryDay, index) => (
          <DaySection
            key={itineraryDay.day}
            itineraryDay={itineraryDay}
            index={index}
            destination={trip.destination}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
