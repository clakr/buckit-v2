import { supabase } from "@/supabase";
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
