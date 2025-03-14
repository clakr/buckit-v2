import { create } from "zustand";

export const useCreateGoalDialogStore = create<{
  isOpen: boolean;
  toggleDialog: () => void;
}>((set) => ({
  isOpen: false,
  toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),
}));
