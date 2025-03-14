import LoadingButton from "@/components/shared/composites/loading-button";
import { StateSection } from "@/components/shared/sections/state-section";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { closeDialog } from "@/lib/utils";
import { useUpdateBucketMutation } from "@/modules/buckets/hooks";
import { bucketQueryOptions } from "@/modules/buckets/query-options";
import { updateBucketSchema } from "@/modules/buckets/schemas";
import { useBucketDropdownMenuStore } from "@/modules/buckets/stores";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useShallow } from "zustand/react/shallow";

export default function UpdateBucketDialog() {
  const { bucketId } = useBucketDropdownMenuStore(
    useShallow((state) => ({ bucketId: state.bucketId })),
  );

  const {
    isPending: isQueryPending,
    isError,
    error,
    data: bucket,
  } = useQuery(bucketQueryOptions(bucketId));

  const { mutateAsync, isPending: isMutationPending } =
    useUpdateBucketMutation();

  const form = useForm({
    defaultValues: {
      name: bucket?.name ?? "",
      description: bucket?.description ?? "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const { success, error } = updateBucketSchema.safeParse(value);

        if (!success) {
          return {
            fields: error.flatten().fieldErrors,
          };
        }
      },
    },
    onSubmit: async ({ value }) => {
      const payload = updateBucketSchema.parse(value);

      await mutateAsync({
        id: bucketId,
        ...payload,
      });

      form.reset();

      closeDialog();
    },
  });

  if (isQueryPending) {
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
        <form.Field
          name="name"
          children={(field) => (
            <fieldset className="group grid grid-cols-2 gap-y-1.5">
              <Label
                htmlFor={field.name}
                className="group-has-[em]:text-destructive"
              >
                Name
              </Label>
              {field.state.meta.errors.length > 0 ? (
                <em
                  role="alert"
                  className="text-destructive text-end text-sm/none"
                >
                  {field.state.meta.errors.join(", ")}
                </em>
              ) : null}
              <Input
                id={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="group-has-[em]:border-destructive col-span-full"
              />
            </fieldset>
          )}
        />
        <form.Field
          name="description"
          children={(field) => (
            <fieldset className="group grid grid-cols-2 gap-y-1.5">
              <Label
                htmlFor={field.name}
                className="group-has-[em]:text-destructive items-end gap-x-1"
              >
                Description
                <small>(optional)</small>
              </Label>
              {field.state.meta.errors.length > 0 ? (
                <em
                  role="alert"
                  className="text-destructive text-end text-sm/none"
                >
                  {field.state.meta.errors.join(", ")}
                </em>
              ) : null}
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={5}
                className="group-has-[em]:border-destructive col-span-full"
              />
            </fieldset>
          )}
        />
        <LoadingButton
          type="submit"
          className="justify-self-end"
          isLoading={isMutationPending}
        >
          Update
        </LoadingButton>
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
