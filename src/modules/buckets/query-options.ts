import { queryClient } from "@/main";
import { supabase } from "@/supabase";
import { Tables } from "@/supabase/database.types";
import { queryOptions } from "@tanstack/react-query";

export const bucketsQueryOptions = queryOptions({
  queryKey: ["buckets"],
  queryFn: async () => {
    await new Promise((r) => setTimeout(r, 3000));

    const { error, data } = await supabase
      .from("buckets")
      .select()
      .eq("is_active", true);

    if (error) throw new Error(error.message);

    return data;
  },
});

export function bucketQueryOptions(bucketId: Tables<"buckets">["id"]) {
  return queryOptions({
    queryKey: ["buckets", bucketId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 3000));

      const { error, data } = await supabase
        .from("buckets")
        .select()
        .eq("id", bucketId);

      if (error) throw new Error(error.message);

      return data.at(0);
    },
    initialData: () => {
      const bucketsQueryData = queryClient.getQueryData([
        "buckets",
      ]) as Tables<"buckets">[];
      if (!bucketsQueryData) return undefined;

      return bucketsQueryData.find((bucket) => bucketId === bucket.id);
    },
  });
}
