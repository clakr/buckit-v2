import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatToCurrency } from "@/lib/utils";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, LabelList, YAxis } from "recharts";

export function BucketsChartCard() {
  const { data: buckets } = useSuspenseQuery(bucketsQueryOptions);

  const chartData = buckets.map((bucket) => ({
    name: bucket.name,
    currentAmount: bucket.current_amount,
    fill: bucket.current_amount > 0 ? "var(--chart-1)" : "var(--chart-4)",
  }));

  const chartConfig = {
    currentAmount: {
      label: "Current Amount",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buckets Breakdown</CardTitle>
        <CardDescription>
          Distribution of current amounts across all buckets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <YAxis
              dataKey="currentAmount"
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatToCurrency(value)}
            />
            <Bar dataKey="currentAmount" radius={4}>
              <LabelList dataKey="name" position="top" fillOpacity={1} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
