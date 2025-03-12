import { Button } from "@/components/ui/button";
import { useCreateBucketDialogStore } from "@/modules/buckets/stores";
import { Icon } from "@iconify/react";

export default function EmptyBucketsSection() {
  const toggleCreateBucketDialog = useCreateBucketDialogStore(
    (state) => state.toggleDialog,
  );

  return (
    <section className="grid min-h-[25svh] place-content-center place-items-center gap-y-4 text-center">
      <Icon
        icon="qlementine-icons:empty-slot-16"
        className="text-muted-foreground size-12"
      />
      <div>
        <h2 className="text-xl font-medium">No buckets found</h2>
        <p className="text-muted-foreground text-sm">
          Get started by creating your first bucket.
        </p>
      </div>
      <Button onClick={toggleCreateBucketDialog}>Create Bucket</Button>
    </section>
  );
}
