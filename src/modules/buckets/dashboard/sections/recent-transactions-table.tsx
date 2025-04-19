import { DataTable } from "@/components/shared/composites/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns } from "@/modules/dashboard/columns";
import { transactionsQueryOptions } from "@/modules/dashboard/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";

export function RecentTransactionsTable() {
  const { data: transactions } = useSuspenseQuery(transactionsQueryOptions);

  const recentTransactions = transactions
    .toSorted(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your most recent financial activity</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <DataTable columns={columns} data={recentTransactions} />
      </CardContent>
    </Card>
  );
}
