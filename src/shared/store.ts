import { create } from "zustand";

type StoreState = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

export const useStore = create<StoreState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
