import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { createGoalTransactionSchema } from "@/lib/schemas";
import { closeDialog } from "@/lib/utils";
import { useAppForm } from "@/main";
import { useCreateGoalTransactionMutation } from "@/modules/goals/hooks";
import { useGoalDropdownMenuStore } from "@/modules/goals/stores";
import { TransactionType } from "@/supabase/types";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export function CreateGoalTransactionDialog() {
  const { goalId } = useGoalDropdownMenuStore(
    useShallow((state) => ({ goalId: state.goalId })),
  );

  const mutation = useCreateGoalTransactionMutation();

  const form = useAppForm({
    defaultValues: {
      goal_id: goalId,
      amount: "",
      description: "",
      type: "inbound",
    } as z.input<typeof createGoalTransactionSchema>,
    validators: {
      onSubmit: ({ value }) => {
        const { success, error } = createGoalTransactionSchema.safeParse(value);

        if (!success) {
          return {
            fields: error.flatten().fieldErrors,
          };
        }
      },
    },
    onSubmit: async ({ value }) => {
      const payload = createGoalTransactionSchema.parse(value);

      await mutation.mutateAsync(payload);

      form.reset();

      closeDialog();
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create Goal Transaction</DialogTitle>
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
        <form.AppField
          name="amount"
          children={(field) => (
            <field.Fieldset label="Amount">
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
          name="type"
          children={(field) => (
            <field.Fieldset label="Type">
              <RadioGroup
                className="group-has-[em]:text-destructive col-span-full mt-1 gap-y-2"
                defaultValue={field.state.value}
                onBlur={field.handleBlur}
                onValueChange={(value) =>
                  field.handleChange(value as TransactionType)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inbound" id="inbound" />
                  <Label htmlFor="inbound">Inbound</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outbound" id="outbound" />
                  <Label htmlFor="outbound">Outbound</Label>
                </div>
              </RadioGroup>
            </field.Fieldset>
          )}
        />
        <form.AppForm>
          <form.SubmitButton className="justify-self-end">
            Create
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </>
  );
}
