import { create } from "zustand";

export const useTaxiStore = create((set) => ({
  // State
  isNightMode: false,
  activeRide: null,
  rideHistory: [],

  // Actions
  toggleNightMode: () =>
    set((state) => ({
      isNightMode: !state.isNightMode,
    })),

  startRide: (rideData) =>
    set({
      activeRide: rideData,
    }),

  endRide: () =>
    set((state) => {
      if (state.activeRide) {
        return {
          rideHistory: [
            ...state.rideHistory,
            {
              ...state.activeRide,
              date: new Date().toISOString(),
            },
          ],
          activeRide: null,
        };
      }
      return state;
    }),

  cancelRide: () =>
    set({
      activeRide: null,
    }),
}));