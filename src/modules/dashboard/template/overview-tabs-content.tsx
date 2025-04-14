import { TabsContent } from "@/components/ui/tabs";
import { BucketsChartCard } from "@/modules/dashboard/sections/buckets-chart-card";
import { GoalsChartCard } from "@/modules/dashboard/sections/goals-chart-card";
import { RecentTransactionsTable } from "@/modules/dashboard/sections/recent-transactions-table";
import { TotalAmountsSection } from "@/modules/dashboard/sections/total-amounts-section";

export function OverviewTabsContent() {
  return (
    <TabsContent value="overview" className="space-y-4">
      <TotalAmountsSection />
      <section className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        <BucketsChartCard />
        <GoalsChartCard />
      </section>
      <RecentTransactionsTable />
    </TabsContent>
  );
}
