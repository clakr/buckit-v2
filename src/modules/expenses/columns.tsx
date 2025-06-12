import { Badge } from "@/components/ui/badge";
import { formatToDate } from "@/lib/utils";
import { badgeExpenseStatusMapping } from "@/modules/expenses/utils";
import { Expense } from "@/supabase/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Expense>[] = [
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
