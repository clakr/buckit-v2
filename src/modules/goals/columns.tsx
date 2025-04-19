import { cn, formatToCurrency, formatToDate } from "@/lib/utils";
import { GoalTransaction } from "@/supabase/types";
import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<GoalTransaction>[] = [
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ getValue }) =>
      formatToDate(getValue<GoalTransaction["created_at"]>()),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) =>
      formatToCurrency(getValue<GoalTransaction["amount"]>()),
  },
  {
    accessorKey: "current_balance",
    header: "Current Balance",
    cell: ({ getValue }) =>
      formatToCurrency(getValue<GoalTransaction["current_balance"]>() ?? 0),
  },
  {
    accessorKey: "type",
    header: "Direction",
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <div
          className={cn(
            "flex items-center gap-x-1 capitalize",
            transaction.type === "inbound"
              ? "text-primary"
              : "text-destructive",
          )}
        >
          {transaction.type === "inbound" ? (
            <Icon icon="bx:up-arrow-alt" />
          ) : (
            <Icon icon="bx:down-arrow-alt" />
          )}
          {transaction.type}
        </div>
      );
    },
  },
];
