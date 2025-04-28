import {
  fetchDistribution,
  fetchDistributions,
  fetchDistributionTargets,
} from "@/lib/actions";
import { queryClient } from "@/main";
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
    placeholderData: () => {
      const distributions = queryClient.getQueryData<Distribution[]>([
        "distributions",
      ]);
      if (!distributions) return undefined;

      const distribution = distributions.find(
        (distribution) => distribution.id === distributionId,
      );

      if (!distribution) return undefined;

      return {
        ...distribution,
        distribution_targets: [],
      };
    },
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
