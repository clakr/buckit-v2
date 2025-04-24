import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { archiveBucketSchema } from "@/lib/schemas";
import { closeDialog } from "@/lib/utils";
import { useAppForm } from "@/main";
import { useArchiveBucketMutation } from "@/modules/buckets/mutations";
import { useBucketDropdownMenuStore } from "@/modules/buckets/stores";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export function ArchiveBucketDialog() {
  const { bucketId } = useBucketDropdownMenuStore(
    useShallow((state) => ({ bucketId: state.bucketId })),
  );

  const mutation = useArchiveBucketMutation();

  const form = useAppForm({
    defaultValues: {
      id: bucketId,
    } as z.input<typeof archiveBucketSchema>,
    validators: {
      onSubmit: archiveBucketSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = archiveBucketSchema.parse(value);

      await mutation.mutateAsync(payload);

      closeDialog();

      form.reset();
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Archive Bucket?</DialogTitle>
        <DialogDescription>
          This will move the bucket to your archived section. You can restore it
          later.
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
        <form.AppForm>
          <form.SubmitButton className="justify-self-end">
            Archive
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </>
  );
}
