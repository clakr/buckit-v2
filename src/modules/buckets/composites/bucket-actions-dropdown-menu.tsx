import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ArchiveBucketDialog from "@/modules/buckets/composites/archive-bucket-dialog";
import UpdateBucketDialog from "@/modules/buckets/composites/update-bucket-dialog";
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
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogContentState />
      </DialogContent>
    </Dialog>
  );
}
