import { fetchExpenses } from "@/lib/actions";
import { queryOptions } from "@tanstack/react-query";

export const expensesQueryOptions = queryOptions({
  queryKey: ["expenses"],
  queryFn: fetchExpenses,
});
