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
import LoadingBucketsSection from "@/modules/buckets/sections/loading-buckets-section";
import IndexTemplate from "@/modules/buckets/templates/index-template";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/buckets/")({
  component: BucketsRoute,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(bucketsQueryOptions),
  validateSearch: (search: Record<string, unknown>) => ({
    bucketId: (search.bucketId as string) ?? "",
  }),
  pendingComponent() {
    return (
      <IndexTemplate>
        <LoadingBucketsSection />
      </IndexTemplate>
    );
  },
});

export default function BucketsRoute() {
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
