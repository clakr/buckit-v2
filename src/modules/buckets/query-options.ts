import { supabase } from "@/supabase";
import { queryOptions } from "@tanstack/react-query";

export const bucketsQueryOptions = queryOptions({
  queryKey: ["buckets"],
  queryFn: async () => {
    const { error, data } = await supabase
      .from("buckets")
      .select()
      .eq("is_active", true);

    if (error) throw new Error(error.message);

    return data;
  },
});
