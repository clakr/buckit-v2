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
  const routeApi = getRouteApi("/_authed/buckets/");

  const navigate = routeApi.useNavigate();
  const { bucketId } = routeApi.useSearch();

  const { mutateAsync, isPending } = useArchiveBucketMutation();

  async function handleArchive() {
    await mutateAsync({
      id: bucketId,
    });

    await navigate({
      search: {
        bucketId: "",
      },
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
