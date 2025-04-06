import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createGoalSchema } from "@/lib/schemas";
import { useAppForm } from "@/main";
import { useCreateGoalMutation } from "@/modules/goals/hooks";
import { useCreateGoalDialogStore } from "@/modules/goals/stores";
import { z } from "zod";

export function CreateGoalDialog() {
  const { isOpen, toggleDialog } = useCreateGoalDialogStore();

  const mutation = useCreateGoalMutation();

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      current_amount: "",
      target_amount: "",
    } as z.input<typeof createGoalSchema>,
    validators: {
      onSubmit: createGoalSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = createGoalSchema.parse(value);

      await mutation.mutateAsync(payload);

      toggleDialog();

      form.reset();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Goal</DialogTitle>
          <DialogDescription>
            Please enter the details to create a new goal.
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
          <form.AppField name="current_amount">
            {(field) => (
              <field.InputField
                label="Current Amount"
                type="number"
                description="The current amount saved"
              />
            )}
          </form.AppField>
          <form.AppField name="target_amount">
            {(field) => (
              <field.InputField
                label="Target Amount"
                type="number"
                description="The target amount to save"
              />
            )}
          </form.AppField>
          <form.AppForm>
            <form.SubmitButton className="justify-self-end">
              Create
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
}
