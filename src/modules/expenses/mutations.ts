import {
  createExpense,
  createExpenseItems,
  createExpenseItemsDistributions,
  createExpenseParticipants,
} from "@/lib/actions";
import {
  Expense,
  ExpenseInsert,
  ExpenseParticipantInsert,
  ExpenseItemInsert,
  ExpenseItemDistributionInsert,
} from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: ExpenseInsert & {
        participants: ExpenseParticipantInsert[];
        items: (ExpenseItemInsert & {
          distributions: ExpenseItemDistributionInsert[];
        })[];
      },
    ) => {
      try {
        const {
          participants: participantsPayload,
          items,
          ...expensePayload
        } = payload;

        await createExpense(expensePayload);

        const expenseParticipantsData =
          await createExpenseParticipants(participantsPayload);

        const expenseItemsPayload: ExpenseItemInsert[] = items.map((item) => ({
          id: item.id,
          expense_id: item.expense_id,
          expense_participant_id:
            expenseParticipantsData.find(
              (participant) => participant.name === item.expense_participant_id,
            )?.id ?? "",
          amount: item.amount,
          description: item.description,
          type: item.type,
        }));

        await createExpenseItems(expenseItemsPayload);

        const expenseItemDistributionsPayload: ExpenseItemDistributionInsert[] =
          items.flatMap((item) =>
            item.distributions.map((distribution) => ({
              expense_item_id: distribution.expense_item_id,
              expense_participant_id:
                expenseParticipantsData.find(
                  (participant) =>
                    participant.name === distribution.expense_participant_id,
                )?.id ?? "",
              amount: distribution.amount,
              type: distribution.type,
            })),
          );

        await createExpenseItemsDistributions(expenseItemDistributionsPayload);
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
