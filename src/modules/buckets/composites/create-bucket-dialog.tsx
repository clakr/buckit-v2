import { LoadingButton } from "@/components/shared/composites/loading-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBucketMutation } from "@/modules/buckets/hooks";
import { createBucketSchema } from "@/modules/buckets/schemas";
import { useCreateBucketDialogStore } from "@/modules/buckets/stores";
import { useForm } from "@tanstack/react-form";

export function CreateBucketDialog() {
  const { isOpen, toggleDialog } = useCreateBucketDialogStore();

  const { mutateAsync, isPending } = useCreateBucketMutation();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      current_amount: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const { success, error } = createBucketSchema.safeParse(value);

        if (!success) {
          return {
            fields: error.flatten().fieldErrors,
          };
        }
      },
    },
    onSubmit: async ({ value }) => {
      const payload = createBucketSchema.parse(value);

      await mutateAsync(payload);

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
          <form.Field
            name="current_amount"
            children={(field) => (
              <fieldset className="group grid grid-cols-2 gap-y-1.5">
                <Label
                  htmlFor={field.name}
                  className="group-has-[em]:text-destructive"
                >
                  Current Amount
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
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="group-has-[em]:border-destructive col-span-full"
                />
              </fieldset>
            )}
          />
          <LoadingButton
            type="submit"
            className="justify-self-end"
            isLoading={isPending}
          >
            Create
          </LoadingButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
