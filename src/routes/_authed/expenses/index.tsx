import { StateSection } from "@/components/shared/sections/state-section";
import { IndexTemplate } from "@/modules/expenses/templates/index-template";
import { createFileRoute, ErrorComponentProps } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/expenses/")({
  loader: () => {},
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
  return <IndexTemplate>Hello "/_authed/expenses/"!</IndexTemplate>;
}
