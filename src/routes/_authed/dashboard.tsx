import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient } from "@/main";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { transactionsQueryOptions } from "@/modules/dashboard/query-options";
import { OverviewTabsContent } from "@/modules/dashboard/template/overview-tabs-content";
import { TransactionsTabsContent } from "@/modules/dashboard/template/transactions-tabs-content";
import { IndexTemplate } from "@/modules/dashboard/templates/index-template";
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
    <IndexTemplate>
      <Tabs defaultValue="overview" className="overflow-x-auto">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <OverviewTabsContent />
        <TransactionsTabsContent />
      </Tabs>
    </IndexTemplate>
  );
}
