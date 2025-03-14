import { Main } from "@/components/shared/main";
import { Button } from "@/components/ui/button";
import CreateGoalDialog from "@/modules/goals/composites/create-goal-dialog";
import { useCreateGoalDialogStore } from "@/modules/goals/stores";
import { PropsWithChildren } from "react";

export function IndexTemplate({ children }: PropsWithChildren) {
  const toggleCreateGoalDialog = useCreateGoalDialogStore(
    (state) => state.toggleDialog,
  );

  return (
    <Main className="grid gap-y-4">
      <section className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Goals</h1>
        <Button
          className="mt-4 justify-self-center"
          onClick={toggleCreateGoalDialog}
        >
          Create Goal
        </Button>
      </section>

      {children}

      <CreateGoalDialog />
    </Main>
  );
}
