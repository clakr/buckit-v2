import { StateSection } from "@/components/shared/sections/state-section";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/main";
import { CreateGoalDialog } from "@/modules/goals/composites/create-goal-dialog";
import { GoalCard } from "@/modules/goals/composites/goal-card";
import { goalsQueryOptions } from "@/modules/goals/query-options";
import { useCreateGoalDialogStore } from "@/modules/goals/stores";
import { IndexTemplate } from "@/modules/goals/templates/index-template";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, ErrorComponentProps } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";

export const Route = createFileRoute("/_authed/goals")({
  loader: () => {
    queryClient.ensureQueryData(goalsQueryOptions);
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
          <h2 className="text-xl font-medium">Loading goals...</h2>
          <p className="text-muted-foreground text-sm">
            Please wait while we fetch your goals.
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
          <h2 className="text-xl font-medium">Failed to load goals</h2>
          <p className="text-muted-foreground max-w-[30ch] text-sm text-balance">
            There was en error loading your goals. Please try again.
          </p>
          <p>{error.message}</p>
        </div>
      </StateSection>
    </IndexTemplate>
  );
}

function RouteComponent() {
  const toggleDialog = useCreateGoalDialogStore(
    useShallow((state) => state.toggleDialog),
  );

  const { data: goals } = useSuspenseQuery(goalsQueryOptions);

  if (goals.length === 0) {
    return (
      <>
        <IndexTemplate>
          <StateSection state="empty">
            <div>
              <h2 className="text-xl font-medium">No goals yet.</h2>
              <p className="text-muted-foreground text-sm">
                Get started by creating your first goal.
              </p>
            </div>
            <Button onClick={toggleDialog}>Create Goal</Button>
          </StateSection>
        </IndexTemplate>

        <CreateGoalDialog />
      </>
    );
  }

  return (
    <>
      <IndexTemplate>
        <section className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </section>
      </IndexTemplate>

      <CreateGoalDialog />
    </>
  );
}
