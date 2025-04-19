import { Button } from "@/components/ui/button";
import { formatToCurrency, formatToDate } from "@/lib/utils";
import { Distribution } from "@/supabase/types";
import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Distribution>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "base_amount",
    header: "Base Amount",
    cell: ({ getValue }) =>
      formatToCurrency(getValue<Distribution["base_amount"]>()),
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ getValue }) =>
      formatToDate(getValue<Distribution["created_at"]>()),
  },
  {
    accessorKey: "actions",
    header: "",
    cell: () => (
      <Button variant="ghost" size="icon">
        <Icon icon="bx:dots-horizontal-rounded" />
        <span className="sr-only">distribution actions</span>
      </Button>
    ),
  },
];
