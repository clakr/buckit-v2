import LoadingButton from "@/components/shared/composites/loading-button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { closeDialog } from "@/lib/utils";
import { useArchiveGoalMutation } from "@/modules/goals/hooks";
import { useGoalDropdownMenuStore } from "@/modules/goals/stores";
import { useShallow } from "zustand/react/shallow";

export default function ArchiveGoalDialog() {
  const { goalId } = useGoalDropdownMenuStore(
    useShallow((state) => ({ goalId: state.goalId })),
  );

  const { mutateAsync, isPending } = useArchiveGoalMutation();

  async function handleArchive() {
    await mutateAsync({
      id: goalId,
    });

    closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Archive Goal?</DialogTitle>
        <DialogDescription>
          This will move the bucket to your archived section. You can restore it
          later.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <LoadingButton
          type="button"
          isLoading={isPending}
          onClick={handleArchive}
        >
          Archive
        </LoadingButton>
      </DialogFooter>
    </>
  );
}
