import { queryClient } from "@/main";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { supabase } from "@/supabase";
import { TablesInsert, TablesUpdate } from "@/supabase/database.types";
import { useMutation } from "@tanstack/react-query";

export function useCreateBucketsMutation() {
  return useMutation({
    mutationFn: async (payload: TablesInsert<"buckets">) => {
      const { error, data } = await supabase.from("buckets").insert([payload]);

      if (error) throw new Error(error.message);

      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: bucketsQueryOptions.queryKey,
      }),
  });
}

export function useArchiveBucketMutation() {
  return useMutation({
    mutationFn: async (payload: {
      id: NonNullable<TablesUpdate<"buckets">["id"]>;
    }) => {
      const { error, data } = await supabase
        .from("buckets")
        .update({
          is_active: false,
        })
        .eq("id", payload.id)
        .select();

      if (error) throw new Error(error.message);

      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: bucketsQueryOptions.queryKey,
      }),
  });
}
