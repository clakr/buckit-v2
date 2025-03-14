import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatToCurrency, formatToPercentage } from "@/lib/utils";
import { Goal } from "@/supabase/types";

type Props = { goal: Goal };

export function GoalCard({ goal }: Props) {
  const percentage = goal.current_amount / goal.target_amount;
  const progress = percentage * 100;

  return (
    <Card key={goal.id} className="justify-between">
      <CardHeader className="grid grid-cols-[1fr_max-content]">
        <div>
          <CardTitle>{goal.name}</CardTitle>
          <CardDescription>{goal.description}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="grid grid-cols-2 gap-y-1 text-sm">
        <span className="text-muted-foreground col-span-full text-end">
          {formatToPercentage(percentage)}
        </span>
        <Progress value={progress} className="col-span-full" />
        <strong>{formatToCurrency(goal.current_amount)}</strong>
        <span className="text-muted-foreground text-end">
          of {formatToCurrency(goal.target_amount)}
        </span>
      </CardFooter>
    </Card>
  );
}
