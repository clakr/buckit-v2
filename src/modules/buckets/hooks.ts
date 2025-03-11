import { queryClient } from "@/main";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { supabase } from "@/supabase";
import { TablesInsert, TablesUpdate } from "@/supabase/database.types";
import { useMutation } from "@tanstack/react-query";

export function useCreateBucketMutation() {
  return useMutation({
    mutationFn: async (payload: TablesInsert<"buckets">) => {
      await new Promise((r) => setTimeout(r, 3000));

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
      await new Promise((r) => setTimeout(r, 3000));

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

export function useUpdateBucketMutation() {
  return useMutation({
    mutationFn: async (payload: TablesUpdate<"buckets">) => {
      if (!payload.id) throw new Error("Bucket ID not provided");

      const { error, data } = await supabase
        .from("buckets")
        .update(payload)
        .eq("id", payload.id);

      if (error) throw new Error(error.message);

      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: bucketsQueryOptions.queryKey,
      }),
  });
}
