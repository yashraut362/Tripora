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

interface DayTemplate {
  theme: string;
  stops: ItineraryStop[];
}

export function mapsUrl(query: string, destination: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${query} ${destination}`,
  )}`;
}

const ARRIVAL: DayTemplate = {
  theme: "Arrival & first wander",
  stops: [
    {
      slot: "Morning",
      title: "Land and settle in",
      detail: "Drop the bags, grab a coffee, get your bearings.",
      mapsQuery: "airport",
    },
    {
      slot: "Afternoon",
      title: "Old town on foot",
      detail: "No plan, no rush — just the streets and the first photos.",
      mapsQuery: "old town",
    },
    {
      slot: "Evening",
      title: "First dinner out",
      detail: "Somewhere small and busy — busy is always a good sign.",
      mapsQuery: "best rated local restaurants",
    },
  ],
};

const FAREWELL: DayTemplate = {
  theme: "Last looks & goodbyes",
  stops: [
    {
      slot: "Morning",
      title: "One more favorite",
      detail: "Go back to the spot you liked most. It counts double now.",
      mapsQuery: "top attractions",
    },
    {
      slot: "Afternoon",
      title: "Souvenirs & snacks",
      detail: "Something for the shelf, something for the flight.",
      mapsQuery: "souvenir shops",
    },
    {
      slot: "Evening",
      title: "Farewell dinner",
      detail: "The good table. You earned it.",
      mapsQuery: "fine dining restaurants",
    },
  ],
};

const ACTIVITY_TEMPLATES: Record<string, DayTemplate> = {
  beach: {
    theme: "Beach day",
    stops: [
      {
        slot: "Morning",
        title: "Claim a stretch of sand",
        detail: "Early sun, calm water, zero agenda.",
        mapsQuery: "best beaches",
      },
      {
        slot: "Afternoon",
        title: "Lunch with your feet in the sand",
        detail: "Beach shack rules: if it's grilled, order it.",
        mapsQuery: "beach restaurants",
      },
      {
        slot: "Evening",
        title: "Sunset point",
        detail: "Stay for the whole thing, phone down for the last minute.",
        mapsQuery: "sunset viewpoint",
      },
    ],
  },
  hiking: {
    theme: "Trail day",
    stops: [
      {
        slot: "Morning",
        title: "Hit the trailhead early",
        detail: "Cool air, quiet path, best light of the day.",
        mapsQuery: "best hiking trails",
      },
      {
        slot: "Afternoon",
        title: "Summit or lookout lunch",
        detail: "Packed sandwiches taste better at altitude. Fact.",
        mapsQuery: "scenic viewpoint",
      },
      {
        slot: "Evening",
        title: "Recovery dinner",
        detail: "Big portions, no judgment.",
        mapsQuery: "hearty local food",
      },
    ],
  },
  roadtrip: {
    theme: "Open road day",
    stops: [
      {
        slot: "Morning",
        title: "Pick up wheels",
        detail: "Windows down, playlist ready, snacks secured.",
        mapsQuery: "car rental",
      },
      {
        slot: "Afternoon",
        title: "The scenic route",
        detail: "Stop wherever looks good. That's the whole point.",
        mapsQuery: "scenic drive",
      },
      {
        slot: "Evening",
        title: "Roadside classic",
        detail: "The place locals pull over for.",
        mapsQuery: "roadside diner",
      },
    ],
  },
  snorkeling: {
    theme: "Underwater day",
    stops: [
      {
        slot: "Morning",
        title: "Reef time",
        detail: "Clearest water is before noon — mask up.",
        mapsQuery: "best snorkeling spots",
      },
      {
        slot: "Afternoon",
        title: "Boat to the good spot",
        detail: "Ask the crew where they'd swim. Go there.",
        mapsQuery: "boat tours",
      },
      {
        slot: "Evening",
        title: "Seafood, obviously",
        detail: "Today's catch, tonight's dinner.",
        mapsQuery: "seafood restaurants",
      },
    ],
  },
  photography: {
    theme: "Golden hour day",
    stops: [
      {
        slot: "Morning",
        title: "Blue hour start",
        detail: "Empty streets, soft light, no tourists in frame.",
        mapsQuery: "photography spots",
      },
      {
        slot: "Afternoon",
        title: "Markets & details",
        detail: "Color, texture, faces — fill the camera roll.",
        mapsQuery: "local markets",
      },
      {
        slot: "Evening",
        title: "The postcard shot",
        detail: "Tripod out, golden hour on the skyline.",
        mapsQuery: "best city viewpoint",
      },
    ],
  },
  nightlife: {
    theme: "Late night day",
    stops: [
      {
        slot: "Morning",
        title: "Slow start",
        detail: "Brunch counts as breakfast if nobody asks.",
        mapsQuery: "best brunch",
      },
      {
        slot: "Afternoon",
        title: "Nap & get ready",
        detail: "Strategic rest. Tonight is the itinerary.",
        mapsQuery: "coffee shops",
      },
      {
        slot: "Evening",
        title: "Bar crawl, curated",
        detail: "Start with a cocktail, end wherever the music is.",
        mapsQuery: "best bars nightlife",
      },
    ],
  },
  wellness: {
    theme: "Slow day",
    stops: [
      {
        slot: "Morning",
        title: "Stretch it out",
        detail: "Morning class, zero rush afterwards.",
        mapsQuery: "yoga studio",
      },
      {
        slot: "Afternoon",
        title: "Spa hours",
        detail: "The full treatment. This is why you came.",
        mapsQuery: "best spa",
      },
      {
        slot: "Evening",
        title: "Light and early dinner",
        detail: "Something green, something grilled, in bed by ten.",
        mapsQuery: "healthy restaurants",
      },
    ],
  },
  sightseeing: {
    theme: "Highlights day",
    stops: [
      {
        slot: "Morning",
        title: "The big one first",
        detail: "Beat the crowds to the headline sight.",
        mapsQuery: "top attractions",
      },
      {
        slot: "Afternoon",
        title: "Museum or landmark pick",
        detail: "One ticket, taken slowly — not five, taken badly.",
        mapsQuery: "museums",
      },
      {
        slot: "Evening",
        title: "Rooftop wrap-up",
        detail: "See everything you walked today from above.",
        mapsQuery: "rooftop bar",
      },
    ],
  },
};

const GENERIC_TEMPLATES: DayTemplate[] = [
  {
    theme: "Local life day",
    stops: [
      {
        slot: "Morning",
        title: "Neighborhood café",
        detail: "Order what the regulars order.",
        mapsQuery: "best local cafe",
      },
      {
        slot: "Afternoon",
        title: "Market wander",
        detail: "Buy fruit you can't name. Eat it immediately.",
        mapsQuery: "street market",
      },
      {
        slot: "Evening",
        title: "Dinner off the main street",
        detail: "Two streets back is where the good food hides.",
        mapsQuery: "hidden gem restaurants",
      },
    ],
  },
  {
    theme: "Day trip day",
    stops: [
      {
        slot: "Morning",
        title: "Out of town early",
        detail: "The best thing nearby is rarely in town.",
        mapsQuery: "day trips",
      },
      {
        slot: "Afternoon",
        title: "Explore & get lost a little",
        detail: "Lost within reason. Keep the return ticket handy.",
        mapsQuery: "nature park",
      },
      {
        slot: "Evening",
        title: "Back for a late bite",
        detail: "Something quick, then feet up.",
        mapsQuery: "late night food",
      },
    ],
  },
];

export function buildItinerary(trip: Trip): ItineraryDay[] {
  const days: ItineraryDay[] = [];
  const middlePool = [
    ...trip.activities
      .map((id) => ACTIVITY_TEMPLATES[id])
      .filter((t): t is DayTemplate => t !== undefined),
    ...GENERIC_TEMPLATES,
  ];

  for (let day = 1; day <= trip.days; day++) {
    let template: DayTemplate;
    if (day === 1) {
      template = ARRIVAL;
    } else if (day === trip.days && trip.days >= 3) {
      template = FAREWELL;
    } else {
      template = middlePool[(day - 2) % middlePool.length];
    }
    days.push({ day, theme: template.theme, stops: template.stops });
  }
  return days;
}

const INTROS = [
  "Slow mornings, long walks, and very good food.",
  "A few must-sees, plenty of maybe-laters.",
  "Pack light, wander far, eat everything.",
  "The kind of trip you plan loosely and remember forever.",
];

export function buildTripIntro(trip: Trip) {
  let hash = 0;
  for (const char of trip.id) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return INTROS[hash % INTROS.length];
}
