import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ArchiveGoalDialog } from "@/modules/goals/composites/archive-goal-dialog";
import { ConvertToBucketDialog } from "@/modules/goals/composites/convert-to-bucket-dialog";
import { CreateGoalTransactionDialog } from "@/modules/goals/composites/create-goal-transaction-dialog";
import { UpdateGoalDialog } from "@/modules/goals/composites/update-goal-dialog";
import { ViewGoalTransactionsDialog } from "@/modules/goals/composites/view-goal-transactions-dialog";
import { useGoalDropdownMenuStore } from "@/modules/goals/stores";
import { Goal } from "@/supabase/types";
import { Icon } from "@iconify/react";
import { useShallow } from "zustand/react/shallow";

type Props = { goalId: Goal["id"] };

export function GoalActionsDropdownMenu({ goalId }: Props) {
  const { dialogContentState, setDialogContentState, setGoalId } =
    useGoalDropdownMenuStore(
      useShallow((state) => ({
        dialogContentState: state.dialogContentState,
        setDialogContentState: state.setDialogContentState,
        setGoalId: state.setGoalId,
      })),
    );

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
      return <ArchiveGoalDialog />;
    } else if (dialogContentState === "create-transaction") {
      return <CreateGoalTransactionDialog />;
    } else if (dialogContentState === "view-transactions") {
      return <ViewGoalTransactionsDialog />;
    } else if (dialogContentState === "convert-to-bucket") {
      return <ConvertToBucketDialog />;
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
          <DropdownMenuLabel>Transactions</DropdownMenuLabel>
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
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Goal</DropdownMenuLabel>
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
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Others</DropdownMenuLabel>
          <DialogTrigger
            onClick={() => handleTrigger("convert-to-bucket")}
            asChild
          >
            <DropdownMenuItem>
              <Icon icon="lucide:piggy-bank" />
              Convert To Bucket
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent
        className={cn(
          "grid max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)]",
          dialogContentState === "view-transactions" && "sm:max-w-3xl",
        )}
      >
        <DialogContentState />
      </DialogContent>
    </Dialog>
  );
}
