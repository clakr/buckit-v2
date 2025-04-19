import { Dialog } from "@/lib/types";
import { create } from "zustand";

export const useCreateDistributionDialogStore = create<Dialog>((set) => ({
  isOpen: false,
  toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),
}));
