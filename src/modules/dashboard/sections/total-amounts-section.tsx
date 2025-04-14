import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatToCurrency } from "@/lib/utils";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { goalsQueryOptions } from "@/modules/goals/query-options";
import { Icon } from "@iconify/react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function TotalAmountsSection() {
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
  );
}
