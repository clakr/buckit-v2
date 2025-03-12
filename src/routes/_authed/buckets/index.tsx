import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatToCurrency } from "@/lib/utils";
import BucketsActionsDropdownMenu from "@/modules/buckets/composites/buckets-actions-dropdown-menu";
import CreateBucketDialog from "@/modules/buckets/composites/create-bucket-dialog";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import EmptyBucketsSection from "@/modules/buckets/sections/empty-buckets-section";
import IndexTemplate from "@/modules/buckets/templates/index-template";
import { Icon } from "@iconify/react";
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, ErrorComponentProps } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_authed/buckets/")({
  validateSearch: (search: Record<string, unknown>) => ({
    bucketId: (search.bucketId as string) ?? "",
  }),
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(bucketsQueryOptions),
  pendingComponent: BucketsLoadingComponent,
  errorComponent: BucketsErrorComponent,
  component: BucketsComponent,
});

function BucketsLoadingComponent() {
  return (
    <IndexTemplate>
      <section className="grid min-h-[25svh] place-content-center place-items-center gap-y-4 text-center">
        <Icon
          icon="bx:loader-alt"
          className="text-muted-foreground size-12 animate-spin"
        />
        <div>
          <h2 className="text-xl font-medium">Loading buckets...</h2>
          <p className="text-muted-foreground text-sm">
            Please wait while we fetch your buckets.
          </p>
        </div>
      </section>
    </IndexTemplate>
  );
}

function BucketsErrorComponent({ reset }: ErrorComponentProps) {
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  useEffect(() => {
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return (
    <IndexTemplate>
      <section className="grid min-h-[25svh] place-content-center place-items-center gap-y-4 text-center">
        <Icon icon="bx:info-circle" className="text-destructive size-12" />
        <div>
          <h2 className="text-xl font-medium">Failed to load buckets</h2>
          <p className="text-muted-foreground text-sm">
            There was en error loading your buckets. Please try again.
          </p>
        </div>
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
      </section>
    </IndexTemplate>
  );
}

function BucketsComponent() {
  const { data: buckets } = useSuspenseQuery(bucketsQueryOptions);

  const isBucketsEmpty = buckets.length === 0;

  return (
    <>
      <IndexTemplate>
        {isBucketsEmpty ? (
          <EmptyBucketsSection />
        ) : (
          <section className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {buckets.map((bucket) => (
              <Card key={bucket.id} className="justify-between">
                <CardHeader className="grid grid-cols-[1fr_max-content]">
                  <div>
                    <CardTitle>{bucket.name}</CardTitle>
                    <CardDescription>{bucket.description}</CardDescription>
                  </div>
                  <BucketsActionsDropdownMenu bucketId={bucket.id} />
                </CardHeader>
                <CardFooter className="self-end font-bold">
                  {formatToCurrency(bucket.current_amount)}
                </CardFooter>
              </Card>
            ))}
          </section>
        )}
      </IndexTemplate>

      <CreateBucketDialog />
    </>
  );
}
