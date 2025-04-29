import { Distribution } from "@/supabase/types";
import { create } from "zustand";

type DialogContentState = "distribute-funds" | "archive-distribution";

export const useDistributeDropdownMenuStore = create<{
  dialogContentState: DialogContentState;
  setDialogContentState: (dialogContentState: DialogContentState) => void;

  distributionId: Distribution["id"];
  setDistributionId: (distributionId: Distribution["id"]) => void;
}>((set) => ({
  dialogContentState: "distribute-funds",
  setDialogContentState: (dialogContentState) =>
    set(() => ({ dialogContentState })),

  distributionId: "",
  setDistributionId: (distributionId) => set(() => ({ distributionId })),
}));
