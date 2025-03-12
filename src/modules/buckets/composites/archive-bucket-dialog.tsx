import LoadingButton from "@/components/shared/composites/loading-button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useArchiveBucketMutation } from "@/modules/buckets/hooks";
import { useBucketDropdownMenuStore } from "@/modules/buckets/stores";
import { useShallow } from "zustand/react/shallow";

export default function ArchiveBucketDialog() {
  const { bucketId } = useBucketDropdownMenuStore(
    useShallow((state) => ({ bucketId: state.bucketId })),
  );

  const { mutateAsync, isPending } = useArchiveBucketMutation();

  async function handleArchive() {
    await mutateAsync({
      id: bucketId,
    });

    const closeButtonElement = document.querySelector<HTMLButtonElement>(
      "button[data-button=close]",
    );
    closeButtonElement?.click();
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
