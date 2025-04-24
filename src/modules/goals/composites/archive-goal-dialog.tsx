import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { archiveGoalSchema } from "@/lib/schemas";
import { closeDialog } from "@/lib/utils";
import { useAppForm } from "@/main";
import { useArchiveGoalMutation } from "@/modules/goals/mutations";
import { useGoalDropdownMenuStore } from "@/modules/goals/stores";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export function ArchiveGoalDialog() {
  const { goalId } = useGoalDropdownMenuStore(
    useShallow((state) => ({ goalId: state.goalId })),
  );

  const mutation = useArchiveGoalMutation();

  const form = useAppForm({
    defaultValues: {
      id: goalId,
    } as z.input<typeof archiveGoalSchema>,
    validators: {
      onSubmit: archiveGoalSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = archiveGoalSchema.parse(value);

      await mutation.mutateAsync(payload);

      closeDialog();

      form.reset();
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Archive Goal?</DialogTitle>
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
