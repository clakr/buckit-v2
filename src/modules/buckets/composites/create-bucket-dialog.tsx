import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createBucketSchema } from "@/lib/schemas";
import { useAppForm } from "@/main";
import { useCreateBucketMutation } from "@/modules/buckets/mutations";
import { useCreateBucketDialogStore } from "@/modules/buckets/stores";
import { z } from "zod";

export function CreateBucketDialog() {
  const { isOpen, toggleDialog } = useCreateBucketDialogStore();

  const mutation = useCreateBucketMutation();

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      current_amount: "",
    } as z.input<typeof createBucketSchema>,
    validators: {
      onSubmit: createBucketSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = createBucketSchema.parse(value);

      await mutation.mutateAsync(payload);

      toggleDialog();

      form.reset();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Bucket</DialogTitle>
          <DialogDescription>
            Please enter the details to create a new bucket.
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
          {mutation.isError ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{mutation.error.message}</AlertDescription>
            </Alert>
          ) : null}
          <form.AppField name="name">
            {(field) => (
              <field.InputField
                label="Name"
                type="text"
                description="The name of the bucket"
              />
            )}
          </form.AppField>
          <form.AppField name="description">
            {(field) => (
              <field.TextareaField
                label="Description"
                description="A description of the bucket"
              />
            )}
          </form.AppField>
          <form.AppField name="current_amount">
            {(field) => (
              <field.InputField
                label="Current Amount"
                description="The current amount saved"
                type="number"
                step={0.01}
                min={-1_000_000_000}
                max={1_000_000_000}
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
