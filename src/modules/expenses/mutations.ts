import {
  createExpense,
  createExpenseItems,
  createExpenseParticipants,
} from "@/lib/actions";
import {
  Expense,
  ExpenseInsert,
  ExpenseParticipantInsert,
  ExpenseItemInsert,
} from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: ExpenseInsert & {
        participants: ExpenseParticipantInsert[];
        items: ExpenseItemInsert[];
      },
    ) => {
      try {
        const { participants, items, ...expensePayload } = payload;

        const expenseData = await createExpense(expensePayload);

        const expenseParticipantsPayload = participants.map((participant) => ({
          ...participant,
          expense_id: expenseData.id,
        }));

        const expenseParticipantsData = await createExpenseParticipants(
          expenseParticipantsPayload,
        );

        const expenseItemsPayload = items.map((item) => ({
          ...item,
          expense_id: expenseData.id,
          expense_participant_id:
            expenseParticipantsData.find(
              (participant) => participant.name === item.expense_participant_id,
            )?.id ?? "",
        }));

        await createExpenseItems(expenseItemsPayload);

        return expenseData;
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
