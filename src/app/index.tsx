import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import {
  PencilSimple,
  Plus,
  SignOut,
  TrashSimple,
  X,
} from "phosphor-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import Animated, { Easing, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScalePressable } from "@/components/scale-pressable";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import type { Trip } from "@/lib/api";
import { authClient } from "@/lib/auth";
import { useThemeColors } from "@/lib/theme";
import { TRAVEL_IMAGES } from "@/lib/travel-images";
import { ACTIVITIES } from "@/lib/trip-data";

const EASE = Easing.bezier(0.32, 0.72, 0, 1);
const FAB_CLEARANCE = 120;
const SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 5,
} as const;

function TripRow({
  trip,
  index,
  onOpen,
  onEdit,
  onDelete,
}: {
  trip: Trip;
  index: number;
  onOpen: () => void;
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
      <ScalePressable
        onPress={onOpen}
        scaleTo={0.98}
        className="mb-3 rounded-[24px] bg-card px-5 py-4"
      >
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
      </ScalePressable>
    </Animated.View>
  );
}

export default function Index() {
  const colors = useThemeColors();
  const { data: session } = authClient.useSession();
  const firstName = session?.user?.name?.split(" ")[0];
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadTrips = useCallback(() => {
    setLoadError(false);
    return api<Trip[]>("/api/trips")
      .then((data) => {
        setTrips(data);
        setLoaded(true);
      })
      .catch(() => setLoadError(true));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [loadTrips]),
  );

  const planNewTrip = () => {
    router.push("/plan" as never);
  };

  const editTrip = (id: string) => {
    router.push({ pathname: "/plan", params: { id } } as never);
  };

  const openTrip = (id: string) => {
    router.push({ pathname: "/trip/[id]", params: { id } } as never);
  };

  const confirmSignOut = () => {
    Alert.alert("Sign out?", "You can sign back in anytime.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => void authClient.signOut(),
      },
    ]);
  };

  const confirmDelete = (trip: Trip) => {
    Alert.alert("Delete trip?", `${trip.destination} will be removed.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          api<void>(`/api/trips/${trip.id}`, { method: "DELETE" })
            .then(() =>
              setTrips((prev) => prev.filter((t) => t.id !== trip.id)),
            )
            .catch(() =>
              Alert.alert("Couldn't delete trip", "Please try again."),
            ),
      },
    ]);
  };

  if (!loaded && loadError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-10">
        <Text className="text-center font-sans-semibold text-base text-foreground">
          Couldn't reach the server.
        </Text>
        <Text className="mt-1 text-center font-sans-medium text-sm text-muted-foreground">
          Check the backend, then try again.
        </Text>
        <ScalePressable
          onPress={loadTrips}
          className="mt-5 h-12 items-center justify-center rounded-full bg-primary px-8"
        >
          <Text className="font-sans-bold text-sm text-primary-foreground">
            Retry
          </Text>
        </ScalePressable>
      </SafeAreaView>
    );
  }

  if (!loaded) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 overflow-hidden bg-background">
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
          <Text variant="h1" className="mt-2">
            My Trips
          </Text>
          <Text className="mt-1 font-sans-medium text-sm text-muted-foreground">
            {firstName ? `Hey ${firstName} — ` : ""}
            {trips.length} {trips.length === 1 ? "adventure" : "adventures"} planned
          </Text>
        </Animated.View>

        {trips.length === 0 ? (
          <Animated.View
            entering={FadeInUp.delay(120).duration(600).easing(EASE)}
            className="flex-1 items-center justify-center pb-24"
          >
            <Image
              source={TRAVEL_IMAGES.camperVanMap}
              style={{ width: 180, height: 180 }}
              contentFit="contain"
            />
            <Text className="mt-4 text-center font-sans-semibold text-base text-foreground">
              No trips yet.
            </Text>
            <Text className="mt-1 text-center font-sans-medium text-sm text-muted-foreground">
              Somewhere out there is waiting for you.
            </Text>
            <ScalePressable
              onPress={planNewTrip}
              className="mt-6 h-14 items-center justify-center rounded-full bg-primary px-8"
            >
              <Text className="font-sans-bold text-base text-primary-foreground">
                Plan your first trip
              </Text>
            </ScalePressable>
          </Animated.View>
        ) : (
          <ScrollView
            className="mt-5 flex-1"
            contentContainerStyle={{ paddingBottom: FAB_CLEARANCE }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadTrips().finally(() => setRefreshing(false));
                }}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          >
            {trips.map((trip, index) => (
              <TripRow
                key={trip.id}
                trip={trip}
                index={index}
                onOpen={() => openTrip(trip.id)}
                onEdit={() => editTrip(trip.id)}
                onDelete={() => confirmDelete(trip)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {menuOpen ? (
        <Pressable
          className="absolute inset-0"
          onPress={() => setMenuOpen(false)}
        />
      ) : null}
      <View className="absolute bottom-6 right-6 items-end gap-3">
        {menuOpen ? (
          <>
            <Animated.View entering={FadeInUp.duration(200)}>
              <ScalePressable
                onPress={() => {
                  setMenuOpen(false);
                  planNewTrip();
                }}
                className="h-12 flex-row items-center gap-2 rounded-full bg-primary pl-4 pr-5"
                style={SHADOW}
              >
                <Plus size={16} weight="bold" color={colors.primaryForeground} />
                <Text className="font-sans-bold text-sm text-primary-foreground">
                  New trip
                </Text>
              </ScalePressable>
            </Animated.View>
            <Animated.View entering={FadeInUp.delay(40).duration(200)}>
              <ScalePressable
                onPress={() => {
                  setMenuOpen(false);
                  confirmSignOut();
                }}
                className="h-12 flex-row items-center gap-2 rounded-full bg-card pl-4 pr-5"
                style={SHADOW}
              >
                <SignOut size={16} weight="bold" color={colors.destructive} />
                <Text className="font-sans-bold text-sm text-foreground">
                  Sign out
                </Text>
              </ScalePressable>
            </Animated.View>
          </>
        ) : null}
        <ScalePressable
          onPress={() => setMenuOpen((open) => !open)}
          hitSlop={6}
          className="h-14 w-14 items-center justify-center rounded-full bg-foreground"
          style={SHADOW}
        >
          {menuOpen ? (
            <X size={22} weight="bold" color={colors.background} />
          ) : (
            <Plus size={22} weight="bold" color={colors.background} />
          )}
        </ScalePressable>
      </View>
    </SafeAreaView>
  );
}
