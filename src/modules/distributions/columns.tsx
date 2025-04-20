import { formatToCurrency, formatToDate } from "@/lib/utils";
import { DistributionsActionsDropdownMenu } from "@/modules/distributions/composites/distributions-actions-dropdown-menu";
import { Distribution } from "@/supabase/types";
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
    cell: ({ row }) => (
      <DistributionsActionsDropdownMenu distributionId={row.original.id} />
    ),
  },
];
