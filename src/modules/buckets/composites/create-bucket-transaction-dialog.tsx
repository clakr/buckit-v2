import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createBucketTransactionSchema } from "@/lib/schemas";
import { closeDialog } from "@/lib/utils";
import { useAppForm } from "@/main";
import { useCreateBucketTransactionMutation } from "@/modules/buckets/mutations";
import { useBucketDropdownMenuStore } from "@/modules/buckets/stores";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export function CreateBucketTransactionDialog() {
  const { bucketId } = useBucketDropdownMenuStore(
    useShallow((state) => ({ bucketId: state.bucketId })),
  );

  const mutation = useCreateBucketTransactionMutation();

  const form = useAppForm({
    defaultValues: {
      bucket_id: bucketId,
      amount: 0,
      description: "",
      type: "inbound",
    } as z.input<typeof createBucketTransactionSchema>,
    validators: {
      onSubmit: createBucketTransactionSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = createBucketTransactionSchema.parse(value);

      await mutation.mutateAsync(payload);

      form.reset();

      closeDialog();
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create Bucket Transaction</DialogTitle>
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
        {mutation.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        ) : null}
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
              description="Whether to add or subtract from the bucket"
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
