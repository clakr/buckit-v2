import { createExpense, createExpenseParticipants } from "@/lib/actions";
import {
  Expense,
  ExpenseInsert,
  ExpenseParticipantInsert,
} from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: ExpenseInsert & { participants: ExpenseParticipantInsert[] },
    ) => {
      try {
        const { participants, ...expensePayload } = payload;

        const data = await createExpense(expensePayload);

        const expenseParticipantsPayload = participants.map((participant) => ({
          ...participant,
          expense_id: data.id,
        }));

        await createExpenseParticipants(expenseParticipantsPayload);

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
