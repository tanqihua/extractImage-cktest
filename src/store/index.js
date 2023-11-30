import { create } from "zustand";

export const useStore = create((set, get) => {
  return {
    isReady: false,
    currentInstrument: "null",
    isSoundOn: false,
    actions: {
      setInstrument: (instrument) => {
        set({ currentInstrument: instrument });
      },
      setIsReady: (bool) => {
        set({ isReady: bool });
      },
      setIsSoundOn: (bool) => {
        set({ isSoundOn: bool });
      },
    },

    init: () => {
      window.setIsReady = (bool) => {
        get().actions.setIsReady(bool);
      };
    },
  };
});
