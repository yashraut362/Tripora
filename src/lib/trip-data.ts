import type { ImageSourcePropType } from "react-native";
import { TRAVEL_IMAGES } from "@/lib/travel-images";

export interface Activity {
  id: string;
  label: string;
  image: ImageSourcePropType;
}

export const ACTIVITIES: Activity[] = [
  { id: "beach", label: "Beach", image: TRAVEL_IMAGES.beachBall },
  { id: "hiking", label: "Hiking", image: TRAVEL_IMAGES.backpack },
  { id: "roadtrip", label: "Road trip", image: TRAVEL_IMAGES.camperVan },
  { id: "snorkeling", label: "Snorkeling", image: TRAVEL_IMAGES.snorkel },
  { id: "photography", label: "Photography", image: TRAVEL_IMAGES.camera },
  { id: "nightlife", label: "Nightlife", image: TRAVEL_IMAGES.radio },
  { id: "wellness", label: "Wellness", image: TRAVEL_IMAGES.waterBottle },
  { id: "sightseeing", label: "Sightseeing", image: TRAVEL_IMAGES.star },
];

export const BUDGET_PRESETS = [500, 1000, 2500, 5000];

export const MIN_DAYS = 1;
export const MAX_DAYS = 30;
export const DEFAULT_DAYS = 5;
export const DEFAULT_BUDGET = 1000;

export const WIZARD_STEPS = ["destination", "days", "budget", "activities"] as const;
