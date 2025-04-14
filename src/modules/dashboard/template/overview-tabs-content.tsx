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
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { transactionsQueryOptions } from "@/modules/dashboard/query-options";
import { BucketsChartCard } from "@/modules/dashboard/sections/buckets-chart-card";
import { GoalsChartCard } from "@/modules/dashboard/sections/goals-chart-card";
import {
  getTransactionParentName,
  getTransactionType,
} from "@/modules/dashboard/utils";
import { goalsQueryOptions } from "@/modules/goals/query-options";
import { Icon } from "@iconify/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function OverviewTabsContent() {
  const { data: buckets } = useSuspenseQuery(bucketsQueryOptions);
  const { data: goals } = useSuspenseQuery(goalsQueryOptions);
  const { data: transactions } = useSuspenseQuery(transactionsQueryOptions);

  const totalBalance = buckets.reduce(
    (total, bucket) => total + bucket.current_amount,
    0,
  );

  const totalGoals = goals.reduce(
    (total, goal) => total + goal.current_amount,
    0,
  );

  const netWorth = totalBalance + totalGoals;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <TabsContent value="overview" className="space-y-4">
      <section className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Icon icon="bx:wallet" className="text-primary" />
          </CardHeader>
          <CardContent>
            <strong className="text-2xl font-bold">
              {formatToCurrency(totalBalance)}
            </strong>
            <p className="text-muted-foreground text-xs">
              Total amount for all buckets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Icon icon="mage:goals" className="text-primary" />
          </CardHeader>
          <CardContent>
            <strong className="text-2xl font-bold">
              {formatToCurrency(totalGoals)}
            </strong>
            <p className="text-muted-foreground text-xs">
              Total amount for all goals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <Icon icon="qlementine-icons:money-16" className="text-primary" />
          </CardHeader>
          <CardContent>
            <strong className="text-2xl font-bold">
              {formatToCurrency(netWorth)}
            </strong>
            <p className="text-muted-foreground text-xs">
              Total funds across all buckets and goals
            </p>
          </CardContent>
        </Card>
      </section>
      <section className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        <BucketsChartCard />
        <GoalsChartCard />
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your most recent financial activity</CardDescription>
        </CardHeader>
        <CardContent>
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
              {recentTransactions.map((transaction) => (
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
                  <TableCell
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
