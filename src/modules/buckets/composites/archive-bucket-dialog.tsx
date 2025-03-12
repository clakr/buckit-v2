import LoadingButton from "@/components/shared/composites/loading-button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useArchiveBucketMutation } from "@/modules/buckets/hooks";
import { getRouteApi } from "@tanstack/react-router";

export default function ArchiveBucketDialog() {
  const { bucketId } = getRouteApi("/_authed/buckets/").useSearch();

  const { mutateAsync, isPending } = useArchiveBucketMutation();

  async function handleArchive() {
    await mutateAsync({
      id: bucketId,
    });
  }

  return (
    <DialogContent>
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
    </DialogContent>
  );
}
