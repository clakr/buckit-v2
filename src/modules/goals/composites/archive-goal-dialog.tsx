import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { closeDialog } from "@/lib/utils";
import { useArchiveGoalMutation } from "@/modules/goals/mutations";
import { useGoalDropdownMenuStore } from "@/modules/goals/stores";
import { useShallow } from "zustand/react/shallow";

export function ArchiveGoalDialog() {
  const { goalId } = useGoalDropdownMenuStore(
    useShallow((state) => ({ goalId: state.goalId })),
  );

  const mutation = useArchiveGoalMutation();

  async function handleArchive() {
    await mutation.mutateAsync(goalId);

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
        <Button type="button" onClick={handleArchive}>
          Archive
        </Button>
      </DialogFooter>
    </>
  );
}
