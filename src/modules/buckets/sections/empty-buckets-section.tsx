import { Button } from "@/components/ui/button";
import { useCreateBucketDialogStore } from "@/modules/buckets/stores";

export default function EmptyBucketsSection() {
  const toggleCreateBucketDialog = useCreateBucketDialogStore(
    (state) => state.toggleDialog,
  );

  return (
    <section className="grid min-h-[25svh] place-content-center text-center">
      <h2 className="text-xl font-medium">No buckets found</h2>
      <p className="text-muted-foreground text-sm">
        Get started by creating your first bucket.
      </p>
      <Button
        className="mt-4 justify-self-center"
        onClick={toggleCreateBucketDialog}
      >
        Create Bucket
      </Button>
    </section>
  );
}
