import { LoadingButton } from "@/components/shared/composites/loading-button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { closeDialog } from "@/lib/utils";
import { useCreateGoalTransactionMutation } from "@/modules/goals/hooks";
import { createGoalTransactionSchema } from "@/modules/goals/schemas";
import { useGoalDropdownMenuStore } from "@/modules/goals/stores";
import { TransactionType } from "@/supabase/types";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export function CreateGoalTransactionDialog() {
  const { goalId } = useGoalDropdownMenuStore(
    useShallow((state) => ({ goalId: state.goalId })),
  );

  const { mutateAsync, isPending } = useCreateGoalTransactionMutation();

  const form = useForm({
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

      await mutateAsync(payload);

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
        <form.Field
          name="amount"
          children={(field) => (
            <fieldset className="group grid grid-cols-2 gap-y-1.5">
              <Label
                htmlFor={field.name}
                className="group-has-[em]:text-destructive"
              >
                Amount
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
        <form.Field
          name="description"
          children={(field) => (
            <fieldset className="group grid grid-cols-2 gap-y-1.5">
              <Label
                htmlFor={field.name}
                className="group-has-[em]:text-destructive items-end gap-x-1"
              >
                Description
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
          name="type"
          children={(field) => (
            <fieldset className="group grid grid-cols-2 gap-y-3">
              <Label
                htmlFor={field.name}
                className="group-has-[em]:text-destructive"
              >
                Type
              </Label>
              {field.state.meta.errors.length > 0 ? (
                <em
                  role="alert"
                  className="text-destructive text-end text-sm/none"
                >
                  {field.state.meta.errors.join(", ")}
                </em>
              ) : null}
              <RadioGroup
                className="group-has-[em]:text-destructive col-span-full gap-y-2"
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
    </>
  );
}
