import {
  Compass,
  Landmark,
  Martini,
  Mountain,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from "lucide-react-native";

export interface Destination {
  name: string;
  country: string;
  flag: string;
}

export const DESTINATIONS: Destination[] = [
  { name: "Paris", country: "France", flag: "🇫🇷" },
  { name: "Tokyo", country: "Japan", flag: "🇯🇵" },
  { name: "Bali", country: "Indonesia", flag: "🇮🇩" },
  { name: "New York", country: "United States", flag: "🇺🇸" },
  { name: "Rome", country: "Italy", flag: "🇮🇹" },
  { name: "Barcelona", country: "Spain", flag: "🇪🇸" },
  { name: "London", country: "United Kingdom", flag: "🇬🇧" },
  { name: "Dubai", country: "United Arab Emirates", flag: "🇦🇪" },
  { name: "Bangkok", country: "Thailand", flag: "🇹🇭" },
  { name: "Sydney", country: "Australia", flag: "🇦🇺" },
  { name: "Lisbon", country: "Portugal", flag: "🇵🇹" },
  { name: "Reykjavik", country: "Iceland", flag: "🇮🇸" },
  { name: "Cape Town", country: "South Africa", flag: "🇿🇦" },
  { name: "Rio de Janeiro", country: "Brazil", flag: "🇧🇷" },
  { name: "Kyoto", country: "Japan", flag: "🇯🇵" },
  { name: "Santorini", country: "Greece", flag: "🇬🇷" },
  { name: "Amsterdam", country: "Netherlands", flag: "🇳🇱" },
  { name: "Marrakech", country: "Morocco", flag: "🇲🇦" },
  { name: "Goa", country: "India", flag: "🇮🇳" },
  { name: "Jaipur", country: "India", flag: "🇮🇳" },
];

export interface Activity {
  id: string;
  label: string;
  icon: LucideIcon;
  emoji: string;
}

export const ACTIVITIES: Activity[] = [
  { id: "beach", label: "Beach", icon: Waves, emoji: "🏖️" },
  { id: "hiking", label: "Hiking", icon: Mountain, emoji: "🥾" },
  { id: "food", label: "Food", icon: UtensilsCrossed, emoji: "🍜" },
  { id: "nightlife", label: "Nightlife", icon: Martini, emoji: "🍸" },
  { id: "museums", label: "Museums", icon: Landmark, emoji: "🏛️" },
  { id: "shopping", label: "Shopping", icon: ShoppingBag, emoji: "🛍️" },
  { id: "adventure", label: "Adventure", icon: Compass, emoji: "🧭" },
  { id: "wellness", label: "Wellness", icon: Sparkles, emoji: "🧘" },
];

export const BUDGET_PRESETS = [500, 1000, 2500, 5000];

export const MIN_DAYS = 1;
export const MAX_DAYS = 30;

export const WIZARD_STEPS = ["destination", "days", "budget", "activities"] as const;
