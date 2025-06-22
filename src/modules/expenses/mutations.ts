import {
  createExpense,
  createExpenseItems,
  createExpenseItemsDistributions,
  createExpenseParticipants,
  createExpenseSettlements,
} from "@/lib/actions";
import { createExpenseSchema } from "@/lib/schemas";
import {
  calculateBreakdown,
  calculateSettlements,
} from "@/modules/expenses/utils";
import {
  ExpenseItemInsert,
  ExpenseItemDistributionInsert,
  ExpenseSettlementInsert,
} from "@/supabase/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: z.output<typeof createExpenseSchema>) => {
      try {
        const {
          participants: participantsPayload,
          items,
          ...expensePayload
        } = payload;

        await createExpense(expensePayload);

        const participantsData =
          await createExpenseParticipants(participantsPayload);

        function findParticipantId(participantName: string) {
          return (
            participantsData.find(
              (participant) => participant.name === participantName,
            )?.id ?? "NO_PARTICIPANT_ID"
          );
        }

        const itemsPayload: ExpenseItemInsert[] = items.map((item) => ({
          id: item.id,
          expense_id: item.expense_id,
          expense_participant_id: findParticipantId(
            item.expense_participant_id,
          ),
          amount: item.amount,
          description: item.description,
          type: item.type,
        }));

        await createExpenseItems(itemsPayload);

        const distributionsPayload: ExpenseItemDistributionInsert[] =
          items.flatMap((item) =>
            item.distributions.map((distribution) => ({
              expense_item_id: distribution.expense_item_id,
              expense_participant_id: findParticipantId(
                distribution.expense_participant_id,
              ),
              amount: distribution.amount,
            })),
          );

        await createExpenseItemsDistributions(distributionsPayload);

        const breakdown = calculateBreakdown(participantsData, items);
        const settlements = calculateSettlements({
          expenseId: expensePayload.id ?? "",
          breakdown,
        });

        const settlementsPayload: ExpenseSettlementInsert[] = settlements.map(
          (settlement) => ({
            ...settlement,
            payer_participant_id: findParticipantId(
              settlement.payer_participant_id,
            ),
            receiver_participant_id: findParticipantId(
              settlement.receiver_participant_id,
            ),
          }),
        );

        await createExpenseSettlements(settlementsPayload);
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);

        throw new Error("An unknown error occurred");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
