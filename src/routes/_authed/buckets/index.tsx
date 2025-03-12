import Main from "@/components/shared/main";
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
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/buckets/")({
  component: BucketsTemplate,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(bucketsQueryOptions),
  validateSearch: (search: Record<string, unknown>) => ({
    bucketId: (search.bucketId as string) ?? "",
  }),
});

export default function BucketsTemplate() {
  const { data: buckets } = useSuspenseQuery(bucketsQueryOptions);

  return (
    <Main className="grid gap-y-4">
      <section className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Buckets</h1>
        <CreateBucketDialog />
      </section>
      <section className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
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
    </Main>
  );
}
