import { create } from "zustand";
import { api } from "@/lib/api";

export interface TripSelections {
  destination: string;
  days: number;
  budget: number | null;
  activities: string[];
}

export interface Trip extends TripSelections {
  id: string;
}

interface TripStore extends TripSelections {
  trips: Trip[];
  tripsLoaded: boolean;
  editingTripId: string | null;
  setDestination: (destination: string) => void;
  setDays: (days: number) => void;
  setBudget: (budget: number | null) => void;
  setActivities: (activities: string[]) => void;
  startNewTrip: () => void;
  startEditTrip: (id: string) => void;
  loadTrips: () => Promise<void>;
  saveTrip: () => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  reset: () => void;
}

const emptyDraft: TripSelections = {
  destination: "",
  days: 5,
  budget: 1000,
  activities: [],
};

export const useTripStore = create<TripStore>()((set, get) => ({
  ...emptyDraft,
  trips: [],
  tripsLoaded: false,
  editingTripId: null,
  setDestination: (destination) => set({ destination }),
  setDays: (days) => set({ days }),
  setBudget: (budget) => set({ budget }),
  setActivities: (activities) => set({ activities }),
  startNewTrip: () => set({ ...emptyDraft, editingTripId: null }),
  startEditTrip: (id) =>
    set((s) => {
      const trip = s.trips.find((t) => t.id === id);
      if (!trip) return {};
      return {
        destination: trip.destination,
        days: trip.days,
        budget: trip.budget,
        activities: trip.activities,
        editingTripId: id,
      };
    }),
  loadTrips: async () => {
    const trips = await api<Trip[]>("/api/trips");
    set({ trips, tripsLoaded: true });
  },
  saveTrip: async () => {
    const s = get();
    const body: TripSelections = {
      destination: s.destination.trim(),
      days: s.days,
      budget: s.budget,
      activities: s.activities,
    };
    if (s.editingTripId) {
      const updated = await api<Trip>(`/api/trips/${s.editingTripId}`, {
        method: "PUT",
        body,
      });
      set({
        trips: s.trips.map((t) => (t.id === updated.id ? updated : t)),
        editingTripId: null,
      });
    } else {
      const created = await api<Trip>("/api/trips", { method: "POST", body });
      set({ trips: [...s.trips, created] });
    }
  },
  deleteTrip: async (id) => {
    await api<void>(`/api/trips/${id}`, { method: "DELETE" });
    const trips = get().trips.filter((t) => t.id !== id);
    set(
      trips.length === 0
        ? { trips, ...emptyDraft, editingTripId: null }
        : { trips },
    );
  },
  reset: () =>
    set({ ...emptyDraft, trips: [], tripsLoaded: false, editingTripId: null }),
}));
