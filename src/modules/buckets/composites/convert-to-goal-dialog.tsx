import { StateSection } from "@/components/shared/sections/state-section";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { closeDialog } from "@/lib/utils";
import { useAppForm } from "@/main";
import { useConvertToGoalMutation } from "@/modules/buckets/hooks";
import { bucketQueryOptions } from "@/modules/buckets/query-options";
import { convertToGoalSchema } from "@/modules/buckets/schemas";
import { useBucketDropdownMenuStore } from "@/modules/buckets/stores";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export function ConvertToGoalDialog() {
  const { bucketId } = useBucketDropdownMenuStore(
    useShallow((state) => ({ bucketId: state.bucketId })),
  );

  const {
    isPending,
    isError,
    error,
    data: bucket,
  } = useQuery(bucketQueryOptions(bucketId));

  const mutation = useConvertToGoalMutation();

  const form = useAppForm({
    defaultValues: {
      bucketId,
      name: bucket?.name,
      description: bucket?.description,
      current_amount: bucket?.current_amount.toString(),
      target_amount: "",
    } as z.input<typeof convertToGoalSchema>,
    validators: {
      onSubmit: ({ value }) => {
        const { success, error } = convertToGoalSchema.safeParse(value);

        if (!success) {
          return {
            fields: error.flatten().fieldErrors,
          };
        }
      },
    },
    onSubmit: async ({ value }) => {
      const payload = convertToGoalSchema.parse(value);

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
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="name"
          children={(field) => (
            <field.Fieldset label="Name">
              <Input
                id={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="group-has-[em]:border-destructive col-span-full"
                disabled
              />
            </field.Fieldset>
          )}
        />
        <form.AppField
          name="description"
          children={(field) => (
            <field.Fieldset label="Description">
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={5}
                className="group-has-[em]:border-destructive col-span-full"
                disabled
              />
            </field.Fieldset>
          )}
        />
        <form.AppField
          name="current_amount"
          children={(field) => (
            <field.Fieldset label="Current Amount">
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="group-has-[em]:border-destructive col-span-full"
                step="0.01"
                disabled
              />
            </field.Fieldset>
          )}
        />
        <form.AppField
          name="target_amount"
          children={(field) => (
            <field.Fieldset label="Target Amount">
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="group-has-[em]:border-destructive col-span-full"
                step="0.01"
              />
            </field.Fieldset>
          )}
        />
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
        <DialogTitle>Convert Bucket To Goal</DialogTitle>
        <DialogDescription>
          Please enter the details to convert this bucket to a goal.
        </DialogDescription>
      </DialogHeader>
      {children}
    </>
  );
}
