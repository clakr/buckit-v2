import { fetchGoal, fetchGoals, fetchGoalTransactions } from "@/lib/actions";
import { Transaction } from "@/lib/types";
import { queryClient } from "@/main";
import { Goal, GoalTransaction } from "@/supabase/types";
import { queryOptions } from "@tanstack/react-query";

export const goalsQueryOptions = queryOptions({
  queryKey: ["goals"],
  queryFn: fetchGoals,
});

export function goalQueryOptions(goalId: Goal["id"]) {
  return queryOptions({
    queryKey: ["goals", goalId],
    queryFn: () => fetchGoal(goalId),
    initialData: () => {
      const goalsQueryData = queryClient.getQueryData<Goal[]>(["goals"]);
      if (!goalsQueryData) return undefined;

      return goalsQueryData.find((goal) => goalId === goal.id);
    },
  });
}

export function goalTransactionsQueryOptions(goalId: Goal["id"]) {
  return queryOptions({
    queryKey: ["goals", goalId, "transactions"],
    queryFn: () => fetchGoalTransactions(goalId),
    initialData: () => {
      const transactions = queryClient.getQueryData<Transaction[]>([
        "transactions",
      ]);
      if (!transactions) return undefined;

      return transactions.reduce<GoalTransaction[]>((prev, transaction) => {
        if ("goal_id" in transaction && transaction.goal_id === goalId) {
          delete transaction.goals;

          prev.push(transaction);
        }

        return prev;
      }, []);
    },
  });
}
