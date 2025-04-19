import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createDistributionSchema } from "@/lib/schemas";
import { useAppForm } from "@/main";
import { useCreateDistributionMutation } from "@/modules/distributions/mutations";
import { useCreateDistributionDialogStore } from "@/modules/distributions/stores";
import { z } from "zod";

export function CreateDistributionDialog() {
  const { isOpen, toggleDialog } = useCreateDistributionDialogStore();

  const mutation = useCreateDistributionMutation();

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      base_amount: "",
    } as z.input<typeof createDistributionSchema>,
    validators: {
      onSubmit: createDistributionSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = createDistributionSchema.parse(value);

      await mutation.mutateAsync(payload);

      toggleDialog();

      form.reset();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Distribution</DialogTitle>
          <DialogDescription>
            Please enter the details to create a new distribution.
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
                description="The name of the distribution"
              />
            )}
          </form.AppField>
          <form.AppField name="description">
            {(field) => (
              <field.TextareaField
                label="Description"
                description="A description of the distribution"
              />
            )}
          </form.AppField>
          <form.AppField name="base_amount">
            {(field) => (
              <field.InputField
                label="Base Amount"
                type="number"
                description="The base amount of the distribution"
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
