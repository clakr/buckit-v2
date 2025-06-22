import { fetchTransactions } from "@/lib/actions";

export type Dialog = {
  isOpen: boolean;
  toggleDialog: () => void;
};

export type Transaction = Awaited<ReturnType<typeof fetchTransactions>>[number];

export type SummaryBreakdown = {
  participant: string;
  paid: number;
  owes: number;
  netBalance: number;
};

export type SummarySettlementPlan = {
  payer_participant_id: string;
  receiver_participant_id: string;
  amount: number;
};
