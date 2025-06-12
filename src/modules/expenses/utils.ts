import { badgeVariants } from "@/components/ui/badge";
import { Expense } from "@/supabase/types";
import { VariantProps } from "class-variance-authority";

export const badgeExpenseStatusMapping: Record<
  Expense["status"],
  VariantProps<typeof badgeVariants>["variant"]
> = {
  draft: "outline",
  calculated: "secondary",
  settled: "default",
};
