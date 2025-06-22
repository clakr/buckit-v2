import {
  createExpense,
  createExpenseItems,
  createExpenseItemsDistributions,
  createExpenseParticipants,
  createExpenseSettlements,
} from "@/lib/actions";
import {
  calculateBreakdown,
  calculateSettlements,
} from "@/modules/expenses/utils";
import {
  Expense,
  ExpenseInsert,
  ExpenseParticipantInsert,
  ExpenseItemInsert,
  ExpenseItemDistributionInsert,
  ExpenseSettlementInsert,
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

        const participantsData =
          await createExpenseParticipants(participantsPayload);

        const itemsPayload: ExpenseItemInsert[] = items.map((item) => ({
          id: item.id,
          expense_id: item.expense_id,
          expense_participant_id:
            participantsData.find(
              (participant) => participant.name === item.expense_participant_id,
            )?.id ?? "",
          amount: item.amount,
          description: item.description,
          type: item.type,
        }));

        await createExpenseItems(itemsPayload);

        const distributionsPayload: ExpenseItemDistributionInsert[] =
          items.flatMap((item) =>
            item.distributions.map((distribution) => ({
              expense_item_id: distribution.expense_item_id,
              expense_participant_id:
                participantsData.find(
                  (participant) =>
                    participant.name === distribution.expense_participant_id,
                )?.id ?? "",
              amount: distribution.amount,
            })),
          );

        await createExpenseItemsDistributions(distributionsPayload);

        const breakdown = calculateBreakdown(participantsPayload, items);
        const settlements = calculateSettlements({
          expenseId: expensePayload.id ?? "",
          breakdown,
        });

        const settlementsPayload: ExpenseSettlementInsert[] = settlements.map(
          (settlement) => ({
            ...settlement,
            payer_participant_id:
              participantsData.find(
                (participant) =>
                  participant.name === settlement.payer_participant_id,
              )?.id ?? "",
            receiver_participant_id:
              participantsData.find(
                (participant) =>
                  participant.name === settlement.receiver_participant_id,
              )?.id ?? "",
          }),
        );

        await createExpenseSettlements(settlementsPayload);
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
