import { create } from "zustand";

export const useCreateBucketDialogStore = create<{
  isOpen: boolean;
  toggleDialog: () => void;
}>((set) => ({
  isOpen: false,
  toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),
}));
