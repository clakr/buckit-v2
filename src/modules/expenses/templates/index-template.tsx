import { Main } from "@/components/shared/primitives/main";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

export function IndexTemplate({ children }: PropsWithChildren) {
  return (
    <Main className="grid gap-y-4">
      <section className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <Button asChild>
          <Link to="/expenses/create">Create Expense</Link>
        </Button>
      </section>

      {children}
    </Main>
  );
}
