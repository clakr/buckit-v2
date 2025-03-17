import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBucketSchema } from "@/lib/schemas";
import { useAppForm } from "@/main";
import { useCreateBucketMutation } from "@/modules/buckets/hooks";
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
                />
              </field.Fieldset>
            )}
          />
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
