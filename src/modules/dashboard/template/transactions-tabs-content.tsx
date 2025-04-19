import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { cn, formatToCurrency, formatToDate } from "@/lib/utils";
import { transactionsQueryOptions } from "@/modules/dashboard/query-options";
import {
  getTransactionParentName,
  getTransactionType,
} from "@/modules/dashboard/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Direction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatToDate(transaction.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-x-2">
                      <Badge>{getTransactionType(transaction)}</Badge>
                      <Badge variant="secondary" className="font-bold">
                        {getTransactionParentName(transaction)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{formatToCurrency(transaction.amount)}</TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
