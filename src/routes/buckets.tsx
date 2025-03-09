import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import BucketsTemplate from "@/modules/buckets/templates/buckets-template";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/buckets")({
  component: BucketsTemplate,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(bucketsQueryOptions),
});
