import { supabase } from "@/supabase";
import { queryOptions } from "@tanstack/react-query";

export const goalsQueryOptions = queryOptions({
  queryKey: ["goals"],
  queryFn: async () => {
    const { error, data } = await supabase
      .from("goals")
      .select()
      .eq("is_active", true);

    if (error) throw new Error(error.message);

    return data;
  },
});
