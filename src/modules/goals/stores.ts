import { Goal } from "@/supabase/types";
import { create } from "zustand";

export const useCreateGoalDialogStore = create<{
  isOpen: boolean;
  toggleDialog: () => void;
}>((set) => ({
  isOpen: false,
  toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),
}));

type DialogContentState =
  | "archive-goal"
  | "update-goal"
  | "create-transaction"
  | "view-transactions";
export const useGoalDropdownMenuStore = create<{
  dialogContentState: DialogContentState;
  setDialogContentState: (dialogContentState: DialogContentState) => void;

  goalId: Goal["id"];
  setGoalId: (goalId: Goal["id"]) => void;
}>((set) => ({
  dialogContentState: "archive-goal",
  setDialogContentState: (dialogContentState) =>
    set(() => ({ dialogContentState })),

  goalId: "",
  setGoalId: (goalId) => set(() => ({ goalId })),
}));
