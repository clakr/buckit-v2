import { Dialog } from "@/lib/types";
import { Bucket } from "@/supabase/types";
import { create } from "zustand";

export const useCreateBucketDialogStore = create<Dialog>((set) => ({
  isOpen: false,
  toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),
}));

type DialogContentState =
  | "archive-bucket"
  | "update-bucket"
  | "create-transaction"
  | "view-transactions"
  | "convert-to-goal";
export const useBucketDropdownMenuStore = create<{
  dialogContentState: DialogContentState;
  setDialogContentState: (dialogContentState: DialogContentState) => void;

  bucketId: Bucket["id"];
  setBucketId: (bucketId: Bucket["id"]) => void;
}>((set) => ({
  dialogContentState: "archive-bucket",
  setDialogContentState: (dialogContentState) =>
    set(() => ({ dialogContentState })),

  bucketId: "",
  setBucketId: (bucketId) => set(() => ({ bucketId })),
}));
