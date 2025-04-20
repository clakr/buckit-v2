import { supabase } from "@/supabase";
import { Distribution } from "@/supabase/types";
import { queryOptions } from "@tanstack/react-query";

export const distributionsQueryOptions = queryOptions({
  queryKey: ["distributions"],
  queryFn: async () => {
    const { error, data } = await supabase
      .from("distributions")
      .select()
      .eq("is_active", true);

    if (error) throw new Error(error.message);

    return data;
  },
});

export function distributionQueryOptions(distributionId: Distribution["id"]) {
  return queryOptions({
    queryKey: ["distributions", distributionId],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("distributions")
        .select(`*, distribution_targets(*)`)
        .eq("id", distributionId)
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
  });
}
export function distributionTargetsQueryOptions(
  distributionId: Distribution["id"],
) {
  return queryOptions({
    queryKey: ["distributions", distributionId, "targets"],
    queryFn: async () => {
      const { error, data } = await supabase
        .from("distribution_targets")
        .select()
        .eq("distribution_id", distributionId);

      if (error) throw new Error(error.message);

      return data;
    },
  });
}
