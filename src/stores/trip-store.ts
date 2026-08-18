import { create } from "zustand";

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
  budget: null,
  activities: [],
};

const newTripId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const useTripStore = create<TripStore>()((set) => ({
  ...emptyDraft,
  trips: [],
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
}));
