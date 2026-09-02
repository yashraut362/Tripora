import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  CalendarPlus,
  CaretLeft,
  MapPin,
  PaperPlaneRight,
  PencilSimple,
  TrashSimple,
} from "phosphor-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { Easing, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddToCalendarModal } from "@/components/add-to-calendar-modal";
import { SelectPill } from "@/components/form/select-pill";
import { ScalePressable } from "@/components/scale-pressable";
import { TripMap, tripStops } from "@/components/trip-map";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { api, ApiError } from "@/lib/api";
import type { ItineraryDay, ItineraryStop, TripDetail } from "@/lib/api";
import { useThemeColors } from "@/lib/theme";
import { TRAVEL_IMAGES } from "@/lib/travel-images";
import { ACTIVITIES } from "@/lib/trip-data";
import { cn, mapsUrl } from "@/lib/utils";

const EASE = Easing.bezier(0.32, 0.72, 0, 1);

function DaySection({
  itineraryDay,
  index,
  destination,
  onAddToCalendar,
}: {
  itineraryDay: ItineraryDay;
  index: number;
  destination: string;
  onAddToCalendar: (stop: ItineraryStop) => void;
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

      <View className="ml-4 mt-3 border-l border-border pl-4">
        {itineraryDay.stops.map((stop) => (
          <View key={stop.slot} className="relative mb-3">
            <View className="absolute -left-[21.5px] top-5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
            <View className="overflow-hidden rounded-[20px] bg-card">
              {stop.photoUrl ? (
                <Image
                  source={{ uri: stop.photoUrl }}
                  style={{ width: "100%", height: 128 }}
                  contentFit="cover"
                  transition={200}
                />
              ) : null}
              <View className="px-4 py-3">
                <View className="flex-row items-center justify-between">
                  <Text className="font-sans-bold text-[10px] uppercase tracking-[2px] text-muted-foreground">
                    {stop.slot}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <ScalePressable
                      onPress={() => onAddToCalendar(stop)}
                      hitSlop={6}
                      className="flex-row items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5"
                    >
                      <CalendarPlus
                        size={12}
                        weight="fill"
                        color={colors.primary}
                      />
                      <Text className="font-sans-bold text-[11px] text-primary">
                        Calendar
                      </Text>
                    </ScalePressable>
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
                </View>
                <Text className="mt-1 font-sans-bold text-base text-foreground">
                  {stop.title}
                </Text>
                <Text className="mt-0.5 font-sans-medium text-xs leading-4 text-muted-foreground">
                  {stop.detail}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const { height: windowHeight } = useWindowDimensions();
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [tab, setTab] = useState<"itinerary" | "map" | "edit">("itinerary");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<{
    stop: ItineraryStop;
    day: number;
  } | null>(null);

  const loadTrip = useCallback(() => {
    if (!id) return;
    setLoadError(false);
    api<TripDetail>(`/api/trips/${id}`)
      .then(setTrip)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setLoadError(true);
        }
      });
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadTrip();
    }, [loadTrip]),
  );

  const tripActivities = trip
    ? ACTIVITIES.filter((a) => trip.activities.includes(a.id))
    : [];
  const artwork = tripActivities[0]?.image ?? TRAVEL_IMAGES.airplane;
  const stopCount =
    trip?.itinerary.reduce((sum, d) => sum + d.stops.length, 0) ?? 0;

  const editTrip = () => {
    if (!trip) return;
    router.push({ pathname: "/plan", params: { id: trip.id } } as never);
  };

  const confirmDelete = () => {
    if (!trip) return;
    Alert.alert("Delete trip?", `${trip.destination} will be removed.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          api<void>(`/api/trips/${trip.id}`, { method: "DELETE" })
            .then(() => router.back())
            .catch(() =>
              Alert.alert("Couldn't delete trip", "Please try again."),
            ),
      },
    ]);
  };

  const sendEdit = () => {
    const message = draft.trim();
    if (!message || sending || !trip) return;
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setDraft("");
    setSending(true);
    api<TripDetail & { note: string }>(`/api/trips/${trip.id}/edit`, {
      method: "POST",
      body: { message },
      timeoutMs: 90000,
    })
      .then((updated) => {
        setTrip(updated);
        setMessages((prev) => [...prev, { role: "ai", text: updated.note }]);
      })
      .catch(() =>
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: "Couldn't update the itinerary. Try again." },
        ]),
      )
      .finally(() => setSending(false));
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
        {trip ? (
          <View className="flex-row gap-2">
            <ScalePressable
              onPress={editTrip}
              hitSlop={8}
              className="h-10 w-10 items-center justify-center rounded-full bg-card"
            >
              <PencilSimple size={16} weight="bold" color={colors.primary} />
            </ScalePressable>
            <ScalePressable
              onPress={confirmDelete}
              hitSlop={8}
              className="h-10 w-10 items-center justify-center rounded-full bg-card"
            >
              <TrashSimple size={16} weight="bold" color={colors.destructive} />
            </ScalePressable>
          </View>
        ) : null}
      </View>

      {notFound ? (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-center font-sans-semibold text-base text-foreground">
            Trip not found.
          </Text>
        </View>
      ) : loadError && !trip ? (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-center font-sans-semibold text-base text-foreground">
            Couldn't load this trip.
          </Text>
          <ScalePressable
            onPress={loadTrip}
            className="mt-5 h-12 items-center justify-center rounded-full bg-primary px-8"
          >
            <Text className="font-sans-bold text-sm text-primary-foreground">
              Retry
            </Text>
          </ScalePressable>
        </View>
      ) : !trip ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            entering={FadeInUp.duration(600).easing(EASE)}
            className="flex-row items-center gap-4 pt-1"
          >
            <View className="h-16 w-16 items-center justify-center rounded-full bg-secondary/70">
              <Image
                source={artwork}
                style={{ width: 52, height: 52 }}
                contentFit="contain"
              />
            </View>
            <View className="flex-1">
              <Text variant="h2" numberOfLines={1}>
                {trip.destination}
              </Text>
              <Text className="mt-0.5 font-sans-medium text-xs text-muted-foreground">
                {trip.days} {trip.days === 1 ? "day" : "days"} · $
                {(trip.budget ?? 0).toLocaleString()}
                {stopCount > 0 ? ` · ${stopCount} stops` : ""}
              </Text>
            </View>
          </Animated.View>

          {trip.intro ? (
            <Animated.View
              entering={FadeInUp.delay(80).duration(600).easing(EASE)}
            >
              <Text
                className="mt-3 font-sans-medium text-sm leading-5 text-muted-foreground"
                numberOfLines={2}
              >
                {trip.intro}
              </Text>
            </Animated.View>
          ) : null}

          <View className="mt-5 flex-row gap-2">
            <SelectPill
              label="Itinerary"
              selected={tab === "itinerary"}
              onPress={() => setTab("itinerary")}
            />
            <SelectPill
              label="Map"
              selected={tab === "map"}
              onPress={() => setTab("map")}
            />
            <SelectPill
              label="Edit"
              selected={tab === "edit"}
              onPress={() => setTab("edit")}
            />
          </View>

          {tab === "map" ? (
            <View
              className="mt-4 overflow-hidden rounded-[24px]"
              style={{ height: Math.max(440, windowHeight - 320) }}
            >
              <TripMap stops={tripStops(trip)} />
            </View>
          ) : tab === "edit" ? (
            <View className="mt-4">
              {messages.length === 0 && !sending ? (
                <Text className="mb-3 font-sans-medium text-sm leading-5 text-muted-foreground">
                  Tell me what to change — "no plans for day 3 evening, I have a
                  flight", "swap day 1 and day 2", "more food spots".
                </Text>
              ) : null}
              {messages.map((message, index) => (
                <View
                  key={index}
                  className={cn(
                    "mb-2 max-w-[85%] rounded-[18px] px-4 py-2.5",
                    message.role === "user"
                      ? "self-end bg-primary"
                      : "self-start bg-card",
                  )}
                >
                  <Text
                    className={cn(
                      "font-sans-medium text-sm leading-5",
                      message.role === "user"
                        ? "text-primary-foreground"
                        : "text-foreground",
                    )}
                  >
                    {message.text}
                  </Text>
                </View>
              ))}
              {sending ? (
                <View className="mb-2 self-start rounded-[18px] bg-card px-4 py-2.5">
                  <Text className="font-sans-medium text-sm text-muted-foreground">
                    Updating your itinerary…
                  </Text>
                </View>
              ) : null}
              <View className="mt-2 flex-row items-center gap-2">
                <Input
                  value={draft}
                  onChangeText={setDraft}
                  placeholder="Ask for a change…"
                  editable={!sending}
                  returnKeyType="send"
                  onSubmitEditing={sendEdit}
                  className="h-12 flex-1 rounded-full bg-card px-5 text-sm"
                />
                <ScalePressable
                  onPress={sendEdit}
                  disabled={sending || draft.trim().length === 0}
                  hitSlop={6}
                  className={cn(
                    "h-12 w-12 items-center justify-center rounded-full bg-primary",
                    (sending || draft.trim().length === 0) && "opacity-30",
                  )}
                >
                  <PaperPlaneRight
                    size={18}
                    weight="fill"
                    color={colors.primaryForeground}
                  />
                </ScalePressable>
              </View>
            </View>
          ) : (
            <>
              <Animated.View
                entering={FadeInUp.delay(200).duration(600).easing(EASE)}
                className="mb-4 mt-5 flex-row items-center gap-3"
              >
                <View className="h-1.5 w-8 rounded-full bg-primary" />
                <Text variant="eyebrow">Day by day</Text>
              </Animated.View>

              {trip.itinerary.length === 0 ? (
                <View className="items-center rounded-[24px] bg-card px-6 py-10">
                  <Text className="text-center font-sans-semibold text-sm text-foreground">
                    Crafting your itinerary…
                  </Text>
                  <Text className="mt-1 text-center font-sans-medium text-xs text-muted-foreground">
                    Our AI is picking real spots for your trip — this usually
                    takes 1–2 minutes.
                  </Text>
                  <ScalePressable
                    onPress={loadTrip}
                    className="mt-5 h-11 items-center justify-center rounded-full bg-primary px-6"
                  >
                    <Text className="font-sans-bold text-sm text-primary-foreground">
                      Check again
                    </Text>
                  </ScalePressable>
                </View>
              ) : (
                trip.itinerary.map((itineraryDay, index) => (
                  <DaySection
                    key={itineraryDay.day}
                    itineraryDay={itineraryDay}
                    index={index}
                    destination={trip.destination}
                    onAddToCalendar={(stop) =>
                      setCalendarTarget({ stop, day: itineraryDay.day })
                    }
                  />
                ))
              )}
            </>
          )}
        </ScrollView>
      )}
      {trip && calendarTarget ? (
        <AddToCalendarModal
          target={calendarTarget}
          destination={trip.destination}
          onClose={() => setCalendarTarget(null)}
        />
      ) : null}
    </SafeAreaView>
  );
}
