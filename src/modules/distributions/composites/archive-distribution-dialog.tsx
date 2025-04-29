import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { archiveDistributionSchema } from "@/lib/schemas";
import { closeDialog } from "@/lib/utils";
import { useAppForm } from "@/main";
import { useArchiveDistributionMutation } from "@/modules/distributions/mutations";
import { useDistributeDropdownMenuStore } from "@/modules/distributions/stores";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export function ArchiveDistributionDialog() {
  const { distributionId } = useDistributeDropdownMenuStore(
    useShallow((state) => ({ distributionId: state.distributionId })),
  );

  const mutation = useArchiveDistributionMutation();

  const form = useAppForm({
    defaultValues: {
      id: distributionId,
    } as z.input<typeof archiveDistributionSchema>,
    validators: {
      onSubmit: archiveDistributionSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = archiveDistributionSchema.parse(value);

      await mutation.mutateAsync(payload);

      closeDialog();

      form.reset();
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Archive Distribution?</DialogTitle>
        <DialogDescription>
          This will move the distribution to your archived section. You can
          restore it later.
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
