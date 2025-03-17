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
import { ArchiveBucketDialog } from "@/modules/buckets/composites/archive-bucket-dialog";
import { ConvertToGoalDialog } from "@/modules/buckets/composites/convert-to-goal-dialog";
import { CreateBucketTransactionDialog } from "@/modules/buckets/composites/create-bucket-transaction-dialog";
import { UpdateBucketDialog } from "@/modules/buckets/composites/update-bucket-dialog";
import { ViewBucketTransactionsDialog } from "@/modules/buckets/composites/view-bucket-transactions-dialog";
import { useBucketDropdownMenuStore } from "@/modules/buckets/stores";
import { Bucket } from "@/supabase/types";
import { Icon } from "@iconify/react";

type Props = { bucketId: Bucket["id"] };

export function BucketActionsDropdownMenu({ bucketId }: Props) {
  const { dialogContentState, setDialogContentState, setBucketId } =
    useBucketDropdownMenuStore();

  function handleOnOpenChange() {
    setBucketId(bucketId);
  }

  function handleTrigger(value: typeof dialogContentState) {
    setDialogContentState(value);
  }

  function DialogContentState() {
    if (dialogContentState === "update-bucket") {
      return <UpdateBucketDialog />;
    } else if (dialogContentState === "archive-bucket") {
      return <ArchiveBucketDialog />;
    } else if (dialogContentState === "create-transaction") {
      return <CreateBucketTransactionDialog />;
    } else if (dialogContentState === "view-transactions") {
      return <ViewBucketTransactionsDialog />;
    } else if (dialogContentState === "convert-to-goal") {
      return <ConvertToGoalDialog />;
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

          <DropdownMenuLabel>Bucket</DropdownMenuLabel>
          <DialogTrigger onClick={() => handleTrigger("update-bucket")} asChild>
            <DropdownMenuItem>
              <Icon icon="bx:pencil" />
              Update Bucket
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger
            onClick={() => handleTrigger("archive-bucket")}
            asChild
          >
            <DropdownMenuItem>
              <Icon icon="bx:trash" />
              Archive Bucket
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>Others</DropdownMenuLabel>
          <DialogTrigger
            onClick={() => handleTrigger("convert-to-goal")}
            asChild
          >
            <DropdownMenuItem>
              <Icon icon="lucide:goal" />
              Convert To Goal
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
