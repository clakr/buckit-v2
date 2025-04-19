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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatToCurrency } from "@/lib/utils";
import { goalsQueryOptions } from "@/modules/goals/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function GoalsChartCard() {
  const { data: goals } = useSuspenseQuery(goalsQueryOptions);

  const chartData = goals.map((goal) => ({
    name: goal.name,
    currentAmount: goal.current_amount,
    targetAmount: goal.target_amount,
  }));

  const chartConfig = {
    currentAmount: {
      label: "Current Amount",
    },
    targetAmount: {
      label: "Target Amount",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goals Breakdown</CardTitle>
        <CardDescription>
          Distribution of current amounts across all goals
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
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              dataKey="targetAmount"
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatToCurrency(value)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="currentAmount"
              stackId="a"
              fill="var(--chart-4)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="targetAmount"
              stackId="a"
              fill="var(--chart-1)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
