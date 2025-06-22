import { badgeVariants } from "@/components/ui/badge";
import {
  baseExpenseItemSchema,
  baseExpenseParticipantSchema,
  baseExpenseSettlementSchema,
} from "@/lib/schemas";
import { SummaryBreakdown } from "@/lib/types";
import { Expense } from "@/supabase/types";
import { VariantProps } from "class-variance-authority";
import { z } from "zod";

export const badgeExpenseStatusMapping: Record<
  Expense["status"],
  VariantProps<typeof badgeVariants>["variant"]
> = {
  draft: "outline",
  calculated: "secondary",
  settled: "default",
};

export function calculateBreakdown(
  participants: z.input<typeof baseExpenseParticipantSchema>[],
  items: z.input<typeof baseExpenseItemSchema>[],
) {
  return participants.map((participant) => {
    const paid = items.reduce(
      (acc, item) =>
        item.expense_participant_id === participant.name
          ? acc + Number(item.amount)
          : acc,
      0,
    );

    const owes = items.reduce((acc, item) => {
      const participantDistribution = item.distributions.find(
        (distribution) =>
          participant.name === distribution.expense_participant_id,
      );

      if (!participantDistribution) return acc;

      if (item.type === "percentage")
        return (
          acc +
          (Number(item.amount) * Number(participantDistribution.amount)) / 100
        );

      return acc + Number(participantDistribution.amount);
    }, 0);

    const netBalance = paid - owes;

    return {
      participant: participant.name,
      paid,
      owes,
      netBalance,
    };
  });
}

export function calculateSettlements({
  expenseId,
  breakdown,
}: {
  expenseId: string;
  breakdown: SummaryBreakdown[];
}) {
  const creditors = breakdown
    .filter((p) => p.netBalance > 0)
    .sort((a, b) => b.netBalance - a.netBalance)
    .map((p) => ({ ...p, remainingBalance: p.netBalance }));

  const debtors = breakdown
    .filter((p) => p.netBalance < 0)
    .sort((a, b) => a.netBalance - b.netBalance)
    .map((p) => ({ ...p, remainingBalance: Math.abs(p.netBalance) }));

  let creditorIndex = 0;
  let debtorIndex = 0;

  const settlements: z.input<typeof baseExpenseSettlementSchema>[] = [];

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    if (creditor.remainingBalance <= 0 || debtor.remainingBalance <= 0) break;

    const settlementAmount = Math.min(
      creditor.remainingBalance,
      debtor.remainingBalance,
    );

    settlements.push({
      expense_id: expenseId,
      payer_participant_id: debtor.participant,
      receiver_participant_id: creditor.participant,
      amount: settlementAmount,
    });

    creditor.remainingBalance -= settlementAmount;
    debtor.remainingBalance -= settlementAmount;

    if (creditor.remainingBalance <= 0) creditorIndex++;
    if (debtor.remainingBalance <= 0) debtorIndex++;
  }

  return settlements;
}
