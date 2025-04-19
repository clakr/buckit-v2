import { supabase } from "@/supabase";
import {
  Distribution,
  DistributionInsert,
  DistributionTargetInsert,
} from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateDistributionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: DistributionInsert & {
        distributions: DistributionTargetInsert[];
      },
    ) => {
      const { distributions, ...distributionPayload } = payload;

      const { error, data } = await supabase
        .from("distributions")
        .insert(distributionPayload)
        .select()
        .single();

      if (error) throw new Error(error.message);

      const distributionTargetsPayload = distributions.map((distribution) => ({
        ...distribution,
        distribution_id: data.id,
      }));

      await supabase
        .from("distribution_targets")
        .insert(distributionTargetsPayload)
        .select();

      return data;
    },
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Distribution[]>(["distributions"], (prev) => {
        if (!prev) return undefined;

        return [...prev, payload];
      });
    },
  });
}
