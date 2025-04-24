import {
  fetchDistribution,
  fetchDistributions,
  fetchDistributionTargets,
} from "@/lib/actions";
import { Distribution } from "@/supabase/types";
import { queryOptions } from "@tanstack/react-query";

export const distributionsQueryOptions = queryOptions({
  queryKey: ["distributions"],
  queryFn: fetchDistributions,
});

export function distributionQueryOptions(distributionId: Distribution["id"]) {
  return queryOptions({
    queryKey: ["distributions", distributionId],
    queryFn: () => fetchDistribution(distributionId),
  });
}

export function distributionTargetsQueryOptions(
  distributionId: Distribution["id"],
) {
  return queryOptions({
    queryKey: ["distributions", distributionId, "targets"],
    queryFn: () => fetchDistributionTargets(distributionId),
  });
}
