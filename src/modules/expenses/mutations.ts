import { createExpense } from "@/lib/actions";
import { Expense, ExpenseInsert } from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ExpenseInsert) => {
      try {
        const data = await createExpense(payload);

        return data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);

        throw new Error("An unknown error occurred");
      }
    },
    onSettled: (payload) => {
      if (!payload) return undefined;

      queryClient.setQueryData<Expense[]>(["expenses"], (prev) => {
        if (!prev) return undefined;

        return [...prev, payload];
      });
    },
  });
}
