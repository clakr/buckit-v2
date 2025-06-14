import { DataTable } from "@/components/shared/composites/data-table";
import { StateSection } from "@/components/shared/sections/state-section";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/main";
import { columns } from "@/modules/expenses/columns";
import { expensesQueryOptions } from "@/modules/expenses/query-options";
import { IndexTemplate } from "@/modules/expenses/templates/index-template";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  ErrorComponentProps,
  Link,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/expenses/")({
  loader: () => {
    queryClient.ensureQueryData(expensesQueryOptions);
  },
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  component: RouteComponent,
});

function PendingComponent() {
  return (
    <IndexTemplate>
      <StateSection state="loading">
        <div>
          <h2 className="text-xl font-medium">Loading expenses...</h2>
          <p className="text-muted-foreground text-sm">
            Please wait while we fetch your expenses.
          </p>
        </div>
      </StateSection>
    </IndexTemplate>
  );
}

function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <IndexTemplate>
      <StateSection state="error">
        <div>
          <h2 className="text-xl font-medium">Failed to load expenses</h2>
          <p className="text-muted-foreground max-w-[30ch] text-sm text-balance">
            There was en error loading your expenses. Please try again.
          </p>
          <p>{error.message}</p>
        </div>
      </StateSection>
    </IndexTemplate>
  );
}

function RouteComponent() {
  const { data: expenses } = useSuspenseQuery(expensesQueryOptions);

  if (expenses.length === 0) {
    return (
      <>
        <IndexTemplate>
          <StateSection state="empty">
            <div>
              <h2 className="text-xl font-medium">No expenses yet.</h2>
              <p className="text-muted-foreground text-sm">
                Get started by creating your first expense.
              </p>
            </div>
            <Button asChild>
              <Link to="/expenses/create">Create Expense</Link>
            </Button>
          </StateSection>
        </IndexTemplate>
      </>
    );
  }

  return (
    <>
      <IndexTemplate>
        <DataTable columns={columns} data={expenses} />
      </IndexTemplate>
    </>
  );
}
