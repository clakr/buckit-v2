import { fetchTransactions } from "@/modules/dashboard/query-options";

export type Dialog = {
  isOpen: boolean;
  toggleDialog: () => void;
};

export type Transaction = Awaited<ReturnType<typeof fetchTransactions>>[number];
