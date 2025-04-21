import { StateSection } from "@/components/shared/sections/state-section";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateGoalSchema } from "@/lib/schemas";
import { closeDialog } from "@/lib/utils";
import { useAppForm } from "@/main";
import { useUpdateGoalMutation } from "@/modules/goals/mutations";
import { goalQueryOptions } from "@/modules/goals/query-options";
import { useGoalDropdownMenuStore } from "@/modules/goals/stores";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export function UpdateGoalDialog() {
  const { goalId } = useGoalDropdownMenuStore(
    useShallow((state) => ({ goalId: state.goalId })),
  );

  const {
    isPending,
    isError,
    error,
    data: goal,
  } = useQuery(goalQueryOptions(goalId));

  const mutation = useUpdateGoalMutation();

  const form = useAppForm({
    defaultValues: {
      id: goal?.id,
      name: goal?.name,
      description: goal?.description,
      target_amount: goal?.target_amount.toString(),
    } as z.input<typeof updateGoalSchema>,
    validators: {
      onSubmit: updateGoalSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = updateGoalSchema.parse(value);

      await mutation.mutateAsync(payload);

      form.reset();

      closeDialog();
    },
  });

  if (isPending) {
    return (
      <DialogContainer>
        <StateSection state="loading">
          <div>
            <h2 className="text-xl font-medium">Loading goal...</h2>
            <p className="text-muted-foreground max-w-[30ch] text-sm text-balance">
              Please wait while we fetch this goal.
            </p>
          </div>
        </StateSection>
      </DialogContainer>
    );
  }

  if (isError) {
    return (
      <DialogContainer>
        <StateSection state="error">
          <div>
            <h2 className="text-xl font-medium">Failed to load goal</h2>
            <p className="text-muted-foreground max-w-[30ch] text-sm text-balance">
              There was en error loading this goal. Please try again.
            </p>
            <p>{error.message}</p>
          </div>
        </StateSection>
      </DialogContainer>
    );
  }

  return (
    <DialogContainer>
      <form
        className="grid gap-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppField name="name">
          {(field) => (
            <field.InputField
              label="Name"
              type="text"
              description="The name of the goal"
            />
          )}
        </form.AppField>
        <form.AppField name="description">
          {(field) => (
            <field.TextareaField
              label="Description"
              description="A description of the goal"
            />
          )}
        </form.AppField>
        <form.AppField name="target_amount">
          {(field) => (
            <field.InputField
              label="Target Amount"
              description="The target amount to save"
              type="number"
              step={0.01}
              min={1}
              max={1_000_000_000}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="justify-self-end">
            Update
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </DialogContainer>
  );
}

function DialogContainer({ children }: PropsWithChildren) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Update Goal</DialogTitle>
        <DialogDescription>
          Please enter the details to update this goal.
        </DialogDescription>
      </DialogHeader>
      {children}
    </>
  );
}
