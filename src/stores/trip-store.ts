import { create } from "zustand";

export interface TripSelections {
  destination: string;
  days: number;
  budget: number | null;
  activities: string[];
}

interface TripStore extends TripSelections {
  completed: boolean;
  setDestination: (destination: string) => void;
  setDays: (days: number) => void;
  setBudget: (budget: number | null) => void;
  setActivities: (activities: string[]) => void;
  complete: () => void;
  reset: () => void;
}

const initialSelections: TripSelections = {
  destination: "",
  days: 5,
  budget: null,
  activities: [],
};

export const useTripStore = create<TripStore>()((set) => ({
  ...initialSelections,
  completed: false,
  setDestination: (destination) => set({ destination }),
  setDays: (days) => set({ days }),
  setBudget: (budget) => set({ budget }),
  setActivities: (activities) => set({ activities }),
  complete: () => set({ completed: true }),
  reset: () => set({ ...initialSelections, completed: false }),
}));
