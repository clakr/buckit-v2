import { StateSection } from "@/components/shared/sections/state-section";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { closeDialog } from "@/lib/utils";
import { useAppForm } from "@/main";
import { useUpdateGoalMutation } from "@/modules/goals/hooks";
import { goalQueryOptions } from "@/modules/goals/query-options";
import { updateGoalSchema } from "@/modules/goals/schemas";
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
      onSubmit: ({ value }) => {
        const { success, error } = updateGoalSchema.safeParse(value);

        if (!success) {
          return {
            fields: error.flatten().fieldErrors,
          };
        }
      },
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
        <form.AppField
          name="name"
          children={(field) => (
            <field.Fieldset label="Name">
              <Input
                id={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="group-has-[em]:border-destructive col-span-full"
              />
            </field.Fieldset>
          )}
        />
        <form.AppField
          name="description"
          children={(field) => (
            <field.Fieldset label="Description">
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={5}
                className="group-has-[em]:border-destructive col-span-full"
              />
            </field.Fieldset>
          )}
        />
        <form.AppField
          name="target_amount"
          children={(field) => (
            <field.Fieldset label="Target Amount">
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="group-has-[em]:border-destructive col-span-full"
                step="0.01"
              />
            </field.Fieldset>
          )}
        />
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
