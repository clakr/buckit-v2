import { StateSection } from "@/components/shared/sections/state-section";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { convertToBucketSchema } from "@/lib/schemas";
import { closeDialog } from "@/lib/utils";
import { useAppForm } from "@/main";
import { useConvertToBucketMutation } from "@/modules/goals/mutations";
import { goalQueryOptions } from "@/modules/goals/query-options";
import { useGoalDropdownMenuStore } from "@/modules/goals/stores";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export function ConvertToBucketDialog() {
  const { goalId } = useGoalDropdownMenuStore(
    useShallow((state) => ({ goalId: state.goalId })),
  );

  const {
    isPending,
    isError,
    error,
    data: bucket,
  } = useQuery(goalQueryOptions(goalId));

  const mutation = useConvertToBucketMutation();

  const form = useAppForm({
    defaultValues: {
      goalId,
      name: bucket?.name,
      description: bucket?.description,
      current_amount: bucket?.current_amount.toString(),
    } as z.input<typeof convertToBucketSchema>,
    validators: {
      onSubmit: convertToBucketSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = convertToBucketSchema.parse(value);

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
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppForm>
          <form.SubmitButton className="justify-self-end">
            Convert
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
        <DialogTitle>Convert Goal to Bucket</DialogTitle>
        <DialogDescription>
          This will convert the goal to a bucket. You cannot restore all the
          transactions that have been made in this goal.
        </DialogDescription>
      </DialogHeader>
      {children}
    </>
  );
}
