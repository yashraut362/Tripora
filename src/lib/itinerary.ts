import type { Trip } from "@/stores/trip-store";

export interface ItineraryStop {
  slot: "Morning" | "Afternoon" | "Evening";
  title: string;
  detail: string;
  mapsQuery: string;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  stops: ItineraryStop[];
}

export interface TripDetail extends Trip {
  intro: string;
  itinerary: ItineraryDay[];
}

export function mapsUrl(query: string, destination: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${query} ${destination}`,
  )}`;
}
