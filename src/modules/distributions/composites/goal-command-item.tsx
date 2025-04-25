import { Badge } from "@/components/ui/badge";
import { CommandItem } from "@/components/ui/command";
import { Progress } from "@/components/ui/progress";
import { cn, formatToCurrency, formatToPercentage } from "@/lib/utils";
import { Goal } from "@/supabase/types";
import { Command } from "cmdk";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof Command.Item> & { goal: Goal };

export function GoalCommandItem({
  children,
  className,
  goal,
  ...props
}: Props) {
  const percentage = goal.current_amount / goal.target_amount;
  const progress = percentage * 100;

  const difference = goal.target_amount - goal.current_amount;

  return (
    <CommandItem {...props} className={cn("items-start py-2.5", className)}>
      {children}
      <div className="grid w-full grid-cols-[minmax(0,1fr)_max-content] gap-y-1">
        <strong>{goal.name}</strong>
        <Badge variant="secondary">{formatToPercentage(percentage)}</Badge>
        <small className="text-muted-foreground col-span-full">
          {formatToCurrency(difference)} remaining
        </small>
        <Progress value={progress} className="col-span-full" />
      </div>
    </CommandItem>
  );
}
