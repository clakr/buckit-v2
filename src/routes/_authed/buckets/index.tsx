import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import BucketsTemplate from "@/modules/buckets/templates/index-template";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/buckets/")({
  component: BucketsTemplate,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(bucketsQueryOptions),
});
