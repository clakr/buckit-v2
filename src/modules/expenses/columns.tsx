import { Badge } from "@/components/ui/badge";
import { SummaryBreakdown, SummarySettlementPlan } from "@/lib/types";
import { cn, formatToCurrency, formatToDate } from "@/lib/utils";
import { badgeExpenseStatusMapping } from "@/modules/expenses/utils";
import { Expense, ExpenseSettlement } from "@/supabase/types";
import { ColumnDef } from "@tanstack/react-table";

export const indexColumns: ColumnDef<Expense>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<Expense["status"]>();

      return (
        <Badge
          variant={badgeExpenseStatusMapping[status]}
          className="capitalize"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ getValue }) => formatToDate(getValue<Expense["created_at"]>()),
  },
];

export const summaryBreakdownColumns: ColumnDef<SummaryBreakdown>[] = [
  {
    accessorKey: "participant",
    header: "Participant",
  },
  {
    accessorKey: "paid",
    header: "Paid",
    cell: ({ getValue }) =>
      formatToCurrency(getValue<SummaryBreakdown["paid"]>()),
  },
  {
    accessorKey: "owes",
    header: "Owes",
    cell: ({ getValue }) =>
      formatToCurrency(getValue<SummaryBreakdown["owes"]>()),
  },
  {
    accessorKey: "netBalance",
    header: "Net Balance",
    cell: ({ getValue }) => {
      const netBalance = getValue<SummaryBreakdown["netBalance"]>();

      return (
        <span
          className={cn(netBalance > 0 ? "text-primary" : "text-destructive")}
        >
          {formatToCurrency(netBalance)}
        </span>
      );
    },
  },
];

export const settlementPlanColumns: ColumnDef<SummarySettlementPlan>[] = [
  {
    accessorKey: "payer_participant_id",
    header: "Payer",
  },
  {
    accessorKey: "receiver_participant_id",
    header: "Receiver",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
