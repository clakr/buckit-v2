import { DataTable } from "@/components/shared/composites/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { columns } from "@/modules/dashboard/columns";
import { transactionsQueryOptions } from "@/modules/dashboard/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";

export function TransactionsTabsContent() {
  const { data: transactions } = useSuspenseQuery(transactionsQueryOptions);

  const sortedTransactions = transactions.toSorted(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <TabsContent value="transactions" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Complete history of your financial activity
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <DataTable columns={columns} data={sortedTransactions} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
