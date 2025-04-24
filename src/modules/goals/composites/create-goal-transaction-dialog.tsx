import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createGoalTransactionSchema } from "@/lib/schemas";
import { closeDialog } from "@/lib/utils";
import { useAppForm } from "@/main";
import { useCreateGoalTransactionMutation } from "@/modules/goals/mutations";
import { useGoalDropdownMenuStore } from "@/modules/goals/stores";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export function CreateGoalTransactionDialog() {
  const { goalId } = useGoalDropdownMenuStore(
    useShallow((state) => ({ goalId: state.goalId })),
  );

  const mutation = useCreateGoalTransactionMutation();

  const form = useAppForm({
    defaultValues: {
      goal_id: goalId,
      amount: "",
      description: "",
      type: "inbound",
    } as z.input<typeof createGoalTransactionSchema>,
    validators: {
      onSubmit: createGoalTransactionSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = createGoalTransactionSchema.parse(value);

      await mutation.mutateAsync([payload]);

      form.reset();

      closeDialog();
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create Goal Transaction</DialogTitle>
        <DialogDescription>
          Please enter the details to create a transaction for this bucket.
        </DialogDescription>
      </DialogHeader>
      <form
        className="grid gap-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppField name="amount">
          {(field) => (
            <field.InputField
              label="Amount"
              description="The amount to add or subtract"
              type="number"
              step={0.01}
              min={1}
              max={1_000_000_000}
            />
          )}
        </form.AppField>
        <form.AppField name="description">
          {(field) => (
            <field.TextareaField
              label="Description"
              description="A description of the transaction"
            />
          )}
        </form.AppField>
        <form.AppField name="type">
          {(field) => (
            <field.RadioGroupField
              label="Type"
              description="Whether to add or subtract from the goal"
              options={[
                { value: "inbound", label: "Inbound" },
                { value: "outbound", label: "Outbound" },
              ]}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton className="justify-self-end">
            Create
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </>
  );
}
