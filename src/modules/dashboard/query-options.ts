import { fetchTransactions } from "@/lib/actions";
import { queryOptions } from "@tanstack/react-query";

export const transactionsQueryOptions = queryOptions({
  queryKey: ["transactions"],
  queryFn: fetchTransactions,
});
