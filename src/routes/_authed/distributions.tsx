import { StateSection } from "@/components/shared/sections/state-section";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/main";
import { distributionsQueryOptions } from "@/modules/distributions/query-options";
import { IndexTemplate } from "@/modules/distributions/templates/index-template";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, ErrorComponentProps } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/distributions")({
  loader: () => {
    queryClient.ensureQueryData(distributionsQueryOptions);
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
          <h2 className="text-xl font-medium">Loading distributions...</h2>
          <p className="text-muted-foreground text-sm">
            Please wait while we fetch your distributions.
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
          <h2 className="text-xl font-medium">Failed to load distributions</h2>
          <p className="text-muted-foreground max-w-[30ch] text-sm text-balance">
            There was en error loading your distributions. Please try again.
          </p>
          <p>{error.message}</p>
        </div>
      </StateSection>
    </IndexTemplate>
  );
}

function RouteComponent() {
  const { data: distributions } = useSuspenseQuery(distributionsQueryOptions);

  if (distributions.length === 0) {
    return (
      <>
        <IndexTemplate>
          <StateSection state="empty">
            <div>
              <h2 className="text-xl font-medium">No distributions yet.</h2>
              <p className="text-muted-foreground text-sm">
                Get started by creating your first distribution.
              </p>
            </div>
            <Button>Create Distribution</Button>
          </StateSection>
        </IndexTemplate>
      </>
    );
  }

  return (
    <IndexTemplate>{JSON.stringify(distributions, null, 2)}</IndexTemplate>
  );
}
