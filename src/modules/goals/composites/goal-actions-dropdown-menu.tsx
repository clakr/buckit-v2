import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ArchiveBucketDialog from "@/modules/buckets/composites/archive-bucket-dialog";
import { CreateBucketTransactionDialog } from "@/modules/buckets/composites/create-bucket-transaction-dialog";
import ViewBucketTransactionsDialog from "@/modules/buckets/composites/view-bucket-transactions-dialog";
import UpdateGoalDialog from "@/modules/goals/composites/update-goal-dialog";
import { useGoalDropdownMenuStore } from "@/modules/goals/stores";
import { Goal } from "@/supabase/types";
import { Icon } from "@iconify/react";

type Props = { goalId: Goal["id"] };

export function GoalActionsDropdownMenu({ goalId }: Props) {
  const { dialogContentState, setDialogContentState, setGoalId } =
    useGoalDropdownMenuStore();

  function handleOnOpenChange() {
    setGoalId(goalId);
  }

  function handleTrigger(value: typeof dialogContentState) {
    setDialogContentState(value);
  }

  function DialogContentState() {
    if (dialogContentState === "update-goal") {
      return <UpdateGoalDialog />;
    } else if (dialogContentState === "archive-goal") {
      return <ArchiveBucketDialog />;
    } else if (dialogContentState === "create-transaction") {
      return <CreateBucketTransactionDialog />;
    } else if (dialogContentState === "view-transactions") {
      return <ViewBucketTransactionsDialog />;
    }
    return null;
  }

  return (
    <Dialog>
      <DropdownMenu onOpenChange={handleOnOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="-me-2 -mt-2">
            <Icon icon="bx:dots-vertical-rounded" className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger
            onClick={() => handleTrigger("create-transaction")}
            asChild
          >
            <DropdownMenuItem>
              <Icon icon="bx:plus" />
              Create Transaction
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger
            onClick={() => handleTrigger("view-transactions")}
            asChild
          >
            <DropdownMenuItem>
              <Icon icon="bitcoin-icons:transactions-filled" />
              View Transactions
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger onClick={() => handleTrigger("update-goal")} asChild>
            <DropdownMenuItem>
              <Icon icon="bx:pencil" />
              Update Goal
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger onClick={() => handleTrigger("archive-goal")} asChild>
            <DropdownMenuItem>
              <Icon icon="bx:trash" />
              Archive Goal
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogContentState />
      </DialogContent>
    </Dialog>
  );
}
