import { Main } from "@/components/shared/main";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatToCurrency } from "@/lib/utils";
import { queryClient } from "@/main";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { transactionsQueryOptions } from "@/modules/dashboard/query-options";
import { TransactionsTabsContent } from "@/modules/dashboard/sections/transactions-tabs-content";
import { goalsQueryOptions } from "@/modules/goals/query-options";
import { Icon } from "@iconify/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard")({
  component: DashboardTemplate,
  loader: () => {
    queryClient.ensureQueryData(bucketsQueryOptions);
    queryClient.ensureQueryData(goalsQueryOptions);
    queryClient.ensureQueryData(transactionsQueryOptions);
  },
});

export function DashboardTemplate() {
  const { data: buckets } = useSuspenseQuery(bucketsQueryOptions);
  const { data: goals } = useSuspenseQuery(goalsQueryOptions);

  const totalBalance = buckets.reduce(
    (total, bucket) => total + bucket.current_amount,
    0,
  );

  const totalGoals = goals.reduce(
    (total, goal) => total + goal.current_amount,
    0,
  );

  const netWorth = totalBalance + totalGoals;

  return (
    <Main>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="buckets" disabled>
            Buckets
          </TabsTrigger>
          <TabsTrigger value="goals" disabled>
            Goals
          </TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <section className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Total Balance
                </CardTitle>
                <Icon icon="bx:wallet" className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <strong className="text-2xl font-bold">
                  {formatToCurrency(totalBalance)}
                </strong>
                <p className="text-muted-foreground text-xs">
                  Total funds across all buckets
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Total Goals
                </CardTitle>
                <Icon icon="mage:goals" className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <strong className="text-2xl font-bold">
                  {formatToCurrency(totalGoals)}
                </strong>
                <p className="text-muted-foreground text-xs">
                  Combined target amount for all goals
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                <Icon
                  icon="qlementine-icons:money-16"
                  className="text-muted-foreground"
                />
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
        </TabsContent>
        <TabsContent value="buckets">this is buckets</TabsContent>
        <TabsContent value="goals">this is goals</TabsContent>
        <TransactionsTabsContent />
      </Tabs>
    </Main>
  );
}
