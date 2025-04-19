import { supabase } from "@/supabase";
import { Distribution, DistributionInsert } from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateDistributionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DistributionInsert) => {
      const { error, data } = await supabase
        .from("distributions")
        .insert(payload)
        .select()
        .single();

      if (error) throw new Error(error.message);

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
