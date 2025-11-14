import { create } from "zustand";

export const useTaxiStore = create((set) => ({
  //state
  isNightMode: false,
  activeRide: null,
  rideHistory: [],

  //actions
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
          activeRide: null ,
        };
      }
      return state;
    }),
    cancelRide : ()=>
      set({
        activeRide: null,
      })
}));
