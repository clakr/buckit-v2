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

        const itemsPayload = items.map(
          ({ expense_participant_id: participantName, ...item }) => ({
            id: item.id,
            expense_id: item.id,
            expense_participant_id: findParticipantId(participantName),
            amount: item.amount,
            description: item.description,
            type: item.type,
          }),
        );

        await createExpenseItems(itemsPayload);

        const distributionsPayload = items.flatMap((item) =>
          item.distributions.map(
            ({ expense_participant_id: participantName, ...distribution }) => ({
              ...distribution,
              expense_participant_id: findParticipantId(participantName),
            }),
          ),
        );

        await createExpenseItemsDistributions(distributionsPayload);

        const breakdown = calculateBreakdown(participantsData, items);
        const settlements = calculateSettlements({
          expenseId: expensePayload.id,
          breakdown,
        });

        const settlementsPayload = settlements.map(
          ({
            payer_participant_id: payerName,
            receiver_participant_id: receiverName,
            ...settlement
          }) => ({
            ...settlement,
            payer_participant_id: findParticipantId(payerName),
            receiver_participant_id: findParticipantId(receiverName),
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
