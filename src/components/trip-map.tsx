import { NavigationArrow } from "phosphor-react-native";
import { useRef } from "react";
import { Linking, ScrollView, View } from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScalePressable } from "@/components/scale-pressable";
import { Text } from "@/components/ui/text";
import type { TripDetail } from "@/lib/api";
import { useThemeColors } from "@/lib/theme";

export interface MapStop {
  tripId: string;
  destination: string;
  day: number;
  slot: string;
  title: string;
  lat: number;
  lng: number;
}

export function tripStops(detail: TripDetail): MapStop[] {
  return detail.itinerary.flatMap((day) =>
    day.stops.flatMap((stop) =>
      stop.lat == null || stop.lng == null
        ? []
        : [
            {
              tripId: detail.id,
              destination: detail.destination,
              day: day.day,
              slot: stop.slot,
              title: stop.title,
              lat: stop.lat,
              lng: stop.lng,
            },
          ],
    ),
  );
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildMapHtml(stops: MapStop[]) {
  const pins = stops.map((stop) => ({
    lat: stop.lat,
    lng: stop.lng,
    popup: `<b>${escapeHtml(stop.title)}</b><br>${escapeHtml(stop.destination)} · Day ${stop.day} · ${escapeHtml(stop.slot)}`,
  }));
  const data = JSON.stringify(pins).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { height: 100%; margin: 0; background: #F8F5ED; }
    .leaflet-control-attribution { font-size: 9px; opacity: 0.75; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      worldCopyJump: true,
      minZoom: 2,
    }).setView([20, 0], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    var pins = ${data};
    var markers = [];
    pins.forEach(function (pin) {
      L.circleMarker([pin.lat, pin.lng], {
        radius: 14, color: '#E17A60', weight: 2, opacity: 0.35, fillColor: '#E17A60', fillOpacity: 0.15,
      }).addTo(map);
      markers.push(L.circleMarker([pin.lat, pin.lng], {
        radius: 7, color: '#ffffff', weight: 2, fillColor: '#E17A60', fillOpacity: 1,
      }).addTo(map).bindPopup(pin.popup));
    });
    function focusPin(i) {
      map.flyTo([pins[i].lat, pins[i].lng], 14);
      markers[i].openPopup();
    }
    if (pins.length > 0) {
      map.fitBounds(L.latLngBounds(pins.map(function (pin) { return [pin.lat, pin.lng]; })).pad(0.2));
    }
  </script>
</body>
</html>`;
}

export function TripMap({
  stops,
  clearance = 12,
}: {
  stops: MapStop[];
  clearance?: number;
}) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const webRef = useRef<WebView>(null);

  const focusStop = (index: number) => {
    webRef.current?.injectJavaScript(`focusPin(${index}); true;`);
  };

  return (
    <View className="flex-1 bg-background">
      <WebView
        ref={webRef}
        source={{ html: buildMapHtml(stops) }}
        style={{ flex: 1, backgroundColor: colors.background }}
        originWhitelist={["*"]}
        setSupportMultipleWindows={false}
        webviewDebuggingEnabled={false}
        overScrollMode="never"
        bounces={false}
      />

      {stops.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: insets.bottom + clearance,
          }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {stops.map((stop, index) => (
            <ScalePressable
              key={`${stop.tripId}-${index}`}
              onPress={() => focusStop(index)}
              className="w-[250px] flex-row items-center gap-3 rounded-[20px] bg-card/95 px-4 py-3"
            >
              <View className="flex-1">
                <Text
                  className="font-sans-bold text-sm text-foreground"
                  numberOfLines={1}
                >
                  {stop.title}
                </Text>
                <Text className="mt-0.5 font-sans-medium text-[11px] text-muted-foreground">
                  Day {stop.day} · {stop.slot}
                </Text>
              </View>
              <ScalePressable
                onPress={() =>
                  Linking.openURL(
                    `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`,
                  )
                }
                hitSlop={6}
                className="h-9 w-9 items-center justify-center rounded-full bg-primary"
              >
                <NavigationArrow
                  size={14}
                  weight="fill"
                  color={colors.primaryForeground}
                />
              </ScalePressable>
            </ScalePressable>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}
