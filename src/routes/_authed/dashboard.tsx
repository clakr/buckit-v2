import { Main } from "@/components/shared/main";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { queryClient } from "@/main";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { transactionsQueryOptions } from "@/modules/dashboard/query-options";
import { OverviewTabsContent } from "@/modules/dashboard/sections/overview-tabs-content";
import { TransactionsTabsContent } from "@/modules/dashboard/sections/transactions-tabs-content";
import { goalsQueryOptions } from "@/modules/goals/query-options";
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
        <OverviewTabsContent />
        <TabsContent value="buckets">this is buckets</TabsContent>
        <TabsContent value="goals">this is goals</TabsContent>
        <TransactionsTabsContent />
      </Tabs>
    </Main>
  );
}
