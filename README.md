# Tripora ✈️

The mobile app for **Tripora, an AI travel planner**. Plan a trip in a five-step wizard and get a day-by-day itinerary of real places with photos, an interactive map, a curated food guide, and a chat assistant that reshapes the plan on request.

All AI generation, auth and data live in the [Tripora backend](https://github.com/) <!-- TODO: link Tripora-backend repo -->.

> 🎬 **Demo video:** _coming soon_ <!-- TODO: drag your screen recording (.mp4) here on GitHub -->

## Screens

- **Sign-in** — Google, via Better Auth (session cookie in SecureStore).
- **Home** — trip cards with destination photos, pull-to-refresh, bubble menu for new trip / sign out.
- **Plan wizard** — destination, duration, budget (slider + presets), activities, and a free-text "wishes" step that steers the AI.
- **Trip detail** — four tabs:
  - **Itinerary** — day-by-day timeline; every stop has Map and Calendar actions.
  - **Map** — Leaflet + OpenStreetMap in a WebView: photo pins, scrollable place cards, one-tap Google Maps navigation.
  - **Food** — curated guide with *what to try* and tags (Must try, Locals' favourite, Michelin star…).
  - **Edit** — chat that edits the itinerary or the food guide in natural language.
- **Add to calendar** — any stop becomes a Google Calendar event with an editable AI prep note and native date/time pickers.

## Stack

Expo SDK 57 · React Native 0.86 · React 19 · TypeScript (strict) · expo-router · NativeWind · Reanimated 4 · Better Auth (Expo plugin) · react-native-webview

No global state library — screens fetch their own data on focus.

## Run

```bash
npm install
npx expo start
```

Requires the backend running on `http://localhost:3000` — see the backend repo. On an Android emulator, forward the port once:

```bash
adb reverse tcp:3000 tcp:3000
```

Optional: set `EXPO_PUBLIC_API_URL` to point at a different API host.
