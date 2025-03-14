import { StateSection } from "@/components/shared/sections/state-section";
import { Button } from "@/components/ui/button";
import { BucketCard } from "@/modules/buckets/composites/bucket-card";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { useCreateBucketDialogStore } from "@/modules/buckets/stores";
import IndexTemplate from "@/modules/buckets/templates/index-template";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, ErrorComponentProps } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/buckets")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(bucketsQueryOptions);
  },
  pendingComponent: BucketsLoadingComponent,
  errorComponent: BucketsErrorComponent,
  component: BucketsComponent,
});

function BucketsLoadingComponent() {
  return (
    <IndexTemplate>
      <StateSection state="loading">
        <div>
          <h2 className="text-xl font-medium">Loading buckets...</h2>
          <p className="text-muted-foreground text-sm">
            Please wait while we fetch your buckets.
          </p>
        </div>
      </StateSection>
    </IndexTemplate>
  );
}

function BucketsErrorComponent({ error }: ErrorComponentProps) {
  return (
    <IndexTemplate>
      <StateSection state="error">
        <div>
          <h2 className="text-xl font-medium">Failed to load buckets</h2>
          <p className="text-muted-foreground max-w-[30ch] text-sm text-balance">
            There was en error loading your buckets. Please try again.
          </p>
          <p>{error.message}</p>
        </div>
      </StateSection>
    </IndexTemplate>
  );
}

function BucketsComponent() {
  const toggleCreateBucketDialog = useCreateBucketDialogStore(
    (state) => state.toggleDialog,
  );

  const { data: buckets } = useSuspenseQuery(bucketsQueryOptions);

  if (buckets.length === 0) {
    return (
      <IndexTemplate>
        <StateSection state="empty">
          <div>
            <h2 className="text-xl font-medium">No buckets yet.</h2>
            <p className="text-muted-foreground text-sm">
              Get started by creating your first bucket.
            </p>
          </div>
          <Button onClick={toggleCreateBucketDialog}>Create Bucket</Button>
        </StateSection>
      </IndexTemplate>
    );
  }

  return (
    <IndexTemplate>
      <section className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {buckets.map((bucket) => (
          <BucketCard bucket={bucket} key={bucket.id} />
        ))}
      </section>
    </IndexTemplate>
  );
}
