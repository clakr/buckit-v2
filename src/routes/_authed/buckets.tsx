import { StateSection } from "@/components/shared/sections/state-section";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/main";
import { BucketCard } from "@/modules/buckets/composites/bucket-card";
import { CreateBucketDialog } from "@/modules/buckets/composites/create-bucket-dialog";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { useCreateBucketDialogStore } from "@/modules/buckets/stores";
import { IndexTemplate } from "@/modules/buckets/templates/index-template";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, ErrorComponentProps } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";

export const Route = createFileRoute("/_authed/buckets")({
  loader: () => {
    queryClient.ensureQueryData(bucketsQueryOptions);
  },
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  component: RouteComponent,
});

function PendingComponent() {
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

function ErrorComponent({ error }: ErrorComponentProps) {
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

function RouteComponent() {
  const toggleDialog = useCreateBucketDialogStore(
    useShallow((state) => state.toggleDialog),
  );

  const { data: buckets } = useSuspenseQuery(bucketsQueryOptions);

  if (buckets.length === 0) {
    return (
      <>
        <IndexTemplate>
          <StateSection state="empty">
            <div>
              <h2 className="text-xl font-medium">No buckets yet.</h2>
              <p className="text-muted-foreground text-sm">
                Get started by creating your first bucket.
              </p>
            </div>
            <Button onClick={toggleDialog}>Create Bucket</Button>
          </StateSection>
        </IndexTemplate>

        <CreateBucketDialog />
      </>
    );
  }

  return (
    <>
      <IndexTemplate>
        <section className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {buckets.map((bucket) => (
            <BucketCard bucket={bucket} key={bucket.id} />
          ))}
        </section>
      </IndexTemplate>

      <CreateBucketDialog />
    </>
  );
}
