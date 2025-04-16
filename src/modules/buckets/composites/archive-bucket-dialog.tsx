import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { closeDialog } from "@/lib/utils";
import { useArchiveBucketMutation } from "@/modules/buckets/mutations";
import { useBucketDropdownMenuStore } from "@/modules/buckets/stores";
import { useShallow } from "zustand/react/shallow";

export function ArchiveBucketDialog() {
  const { bucketId } = useBucketDropdownMenuStore(
    useShallow((state) => ({ bucketId: state.bucketId })),
  );

  const mutation = useArchiveBucketMutation();

  async function handleArchive() {
    await mutation.mutateAsync({
      id: bucketId,
    });

    closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Archive Bucket?</DialogTitle>
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
