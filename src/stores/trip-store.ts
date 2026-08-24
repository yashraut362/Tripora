import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  // The flat selection fields above act as the wizard's draft.
  trips: Trip[];
  editingTripId: string | null;
  // True once saved trips have been loaded from disk — gate the
  // "no trips -> wizard" redirect on this so it doesn't fire early.
  hasHydrated: boolean;
  setDestination: (destination: string) => void;
  setDays: (days: number) => void;
  setBudget: (budget: number | null) => void;
  setActivities: (activities: string[]) => void;
  startNewTrip: () => void;
  startEditTrip: (id: string) => void;
  saveTrip: () => void;
  deleteTrip: (id: string) => void;
}

const emptyDraft: TripSelections = {
  destination: "",
  days: 5,
  budget: 1000,
  activities: [],
};

const newTripId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const useTripStore = create<TripStore>()(
  persist(
    (set) => ({
  ...emptyDraft,
  trips: [],
  editingTripId: null,
  hasHydrated: false,
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
  saveTrip: () =>
    set((s) => {
      const selections: TripSelections = {
        destination: s.destination.trim(),
        days: s.days,
        budget: s.budget,
        activities: s.activities,
      };
      if (s.editingTripId) {
        return {
          trips: s.trips.map((t) =>
            t.id === s.editingTripId ? { ...t, ...selections } : t,
          ),
          editingTripId: null,
        };
      }
      return { trips: [...s.trips, { id: newTripId(), ...selections }] };
    }),
  deleteTrip: (id) =>
    set((s) => {
      const trips = s.trips.filter((t) => t.id !== id);
      // Last trip gone -> home redirects into the wizard; hand it a clean draft.
      return trips.length === 0
        ? { trips, ...emptyDraft, editingTripId: null }
        : { trips };
    }),
    }),
    {
      name: "tripora-trips",
      storage: createJSONStorage(() => AsyncStorage),
      // Persist only the saved trips; the wizard draft stays ephemeral.
      partialize: (s) => ({ trips: s.trips }),
      onRehydrateStorage: () => () => {
        useTripStore.setState({ hasHydrated: true });
      },
    },
  ),
);
