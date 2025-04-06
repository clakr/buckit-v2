import { StateSection } from "@/components/shared/sections/state-section";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateBucketSchema } from "@/lib/schemas";
import { closeDialog } from "@/lib/utils";
import { useAppForm } from "@/main";
import { useUpdateBucketMutation } from "@/modules/buckets/hooks";
import { bucketQueryOptions } from "@/modules/buckets/query-options";
import { useBucketDropdownMenuStore } from "@/modules/buckets/stores";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export function UpdateBucketDialog() {
  const { bucketId } = useBucketDropdownMenuStore(
    useShallow((state) => ({ bucketId: state.bucketId })),
  );

  const {
    isPending,
    isError,
    error,
    data: bucket,
  } = useQuery(bucketQueryOptions(bucketId));

  const mutation = useUpdateBucketMutation();

  const form = useAppForm({
    defaultValues: {
      id: bucket?.id,
      name: bucket?.name,
      description: bucket?.description,
    } as z.input<typeof updateBucketSchema>,
    validators: {
      onSubmit: updateBucketSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = updateBucketSchema.parse(value);

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
            <h2 className="text-xl font-medium">Loading bucket...</h2>
            <p className="text-muted-foreground max-w-[30ch] text-sm text-balance">
              Please wait while we fetch this bucket.
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
            <h2 className="text-xl font-medium">Failed to load bucket</h2>
            <p className="text-muted-foreground max-w-[30ch] text-sm text-balance">
              There was en error loading this bucket. Please try again.
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
        <form.AppField name="name">
          {(field) => <field.InputField label="Name" type="text" />}
        </form.AppField>
        <form.AppField name="description">
          {(field) => <field.TextareaField label="Description" />}
        </form.AppField>
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
        <DialogTitle>Update Bucket</DialogTitle>
        <DialogDescription>
          Please enter the details to update this bucket.
        </DialogDescription>
      </DialogHeader>
      {children}
    </>
  );
}
