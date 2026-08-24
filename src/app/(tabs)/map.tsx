import { View } from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";

// Leaflet + OpenStreetMap: fully interactive and needs no API key, so it
// works in Expo Go (Google Maps does not — Expo Go's bundled key is dead).
const MAP_HTML = `<!DOCTYPE html>
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
    }).setView([19.076, 72.8777], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Test pin: Mumbai — coral dot with a soft halo, matching the app's primary color.
    L.circleMarker([19.076, 72.8777], {
      radius: 14, color: '#E17A60', weight: 2, opacity: 0.35, fillColor: '#E17A60', fillOpacity: 0.15,
    }).addTo(map);
    L.circleMarker([19.076, 72.8777], {
      radius: 7, color: '#ffffff', weight: 2, fillColor: '#E17A60', fillOpacity: 1,
    }).addTo(map).bindPopup('Mumbai').openPopup();
  </script>
</body>
</html>`;

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <View className="flex-1 bg-background">
      <WebView
        source={{ html: MAP_HTML }}
        style={{ flex: 1, backgroundColor: colors.background }}
        originWhitelist={["*"]}
        setSupportMultipleWindows={false}
        webviewDebuggingEnabled={false}
        overScrollMode="never"
        bounces={false}
      />

      {/* Floating title chip */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: insets.top + 10, left: 24 }}
        className="flex-row items-center gap-2 rounded-full bg-card/95 px-4 py-2"
      >
        <View className="h-1.5 w-6 rounded-full bg-primary" />
        <Text className="font-sans-bold text-sm text-foreground">Map</Text>
      </View>
    </View>
  );
}
