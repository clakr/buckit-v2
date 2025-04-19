import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/lib/types";
import { cn, formatToCurrency, formatToDate } from "@/lib/utils";
import {
  getTransactionParentName,
  getTransactionType,
} from "@/modules/dashboard/utils";
import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ getValue }) => formatToDate(getValue<Transaction["created_at"]>()),
  },
  {
    accessorKey: "target",
    header: "Type",
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <div className="flex items-center gap-x-2">
          <Badge>{getTransactionType(transaction)}</Badge>
          <Badge variant="secondary" className="font-bold">
            {getTransactionParentName(transaction)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => formatToCurrency(getValue<Transaction["amount"]>()),
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
