import { Main } from "@/components/shared/primitives/main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createExpenseSchema } from "@/lib/schemas";
import { useAppForm } from "@/main";
import { useCreateExpenseMutation } from "@/modules/expenses/mutations";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_authed/expenses/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const mutation = useCreateExpenseMutation();

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      status: "calculated",
    } as z.input<typeof createExpenseSchema>,
    validators: {
      onSubmit: createExpenseSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = createExpenseSchema.parse(value);

      await mutation.mutateAsync(payload);
    },
  });

  return (
    <Main className="grid gap-y-4">
      <section className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Create Expenses</h1>
      </section>

      <Tabs defaultValue="details" asChild>
        <form
          className="gap-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="grid gap-y-3">
            <form.AppField name="name">
              {(field) => (
                <field.InputField
                  label="Name"
                  type="text"
                  description="The name of the expense"
                />
              )}
            </form.AppField>
            <form.AppField name="description">
              {(field) => (
                <field.TextareaField
                  label="Description"
                  description="A description of the distribution"
                />
              )}
            </form.AppField>
            <form.AppField name="status">
              {(field) => (
                <field.RadioGroupField
                  label="Status"
                  description="The status of the expense"
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "calculated", label: "Calculated" },
                  ]}
                />
              )}
            </form.AppField>
          </TabsContent>

          <form.AppForm>
            <form.SubmitButton className="self-end">
              Create Expense
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </Tabs>
    </Main>
  );
}
