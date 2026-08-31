import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TripMap, tripStops } from "@/components/trip-map";
import type { MapStop } from "@/components/trip-map";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import type { Trip, TripDetail } from "@/lib/api";

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [stops, setStops] = useState<MapStop[]>([]);

  useFocusEffect(
    useCallback(() => {
      api<Trip[]>("/api/trips")
        .then((trips) =>
          Promise.all(trips.map((t) => api<TripDetail>(`/api/trips/${t.id}`))),
        )
        .then((details) => setStops(details.flatMap((d) => tripStops(d))))
        .catch(() => {});
    }, []),
  );

  return (
    <View className="flex-1 bg-background">
      <TripMap stops={stops} clearance={88} />

      <View
        pointerEvents="none"
        style={{ position: "absolute", top: insets.top + 10, left: 24 }}
        className="flex-row items-center gap-2 rounded-full bg-card/95 px-4 py-2"
      >
        <View className="h-1.5 w-6 rounded-full bg-primary" />
        <Text className="font-sans-bold text-sm text-foreground">
          {stops.length > 0 ? `Map · ${stops.length} spots` : "Map"}
        </Text>
      </View>
    </View>
  );
}
