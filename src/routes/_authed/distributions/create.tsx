import { Fieldset } from "@/components/shared/primitives/fieldset";
import { Main } from "@/components/shared/primitives/main";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createDistributionSchema,
  distributionAmountTypeSchema,
} from "@/lib/schemas";
import { useAppForm } from "@/main";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { useCreateDistributionMutation } from "@/modules/distributions/mutations";
import { goalsQueryOptions } from "@/modules/goals/query-options";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_authed/distributions/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const mutation = useCreateDistributionMutation();

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      base_amount: "",
      distribution_targets: [
        {
          target_id: "",
          amount_type: "absolute",
          amount: "",
          description: "",
        },
      ],
    } as z.input<typeof createDistributionSchema>,
    validators: {
      onSubmit: createDistributionSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = createDistributionSchema.parse(value);

      await mutation.mutateAsync(payload);

      navigate({
        to: "/distributions",
      });
    },
  });

  const { data: buckets } = useSuspenseQuery(bucketsQueryOptions);
  const { data: goals } = useSuspenseQuery(goalsQueryOptions);

  return (
    <Main className="grid gap-y-4">
      <section className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Create Distribution</h1>
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
            <TabsTrigger value="targets">Targets</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="grid gap-y-3">
            <form.AppField name="name">
              {(field) => (
                <field.InputField
                  label="Name"
                  type="text"
                  description="The name of the distribution"
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
            <form.AppField name="base_amount">
              {(field) => (
                <field.InputField
                  label="Base Amount"
                  type="number"
                  description="The base amount of the distribution"
                  min={0}
                />
              )}
            </form.AppField>
          </TabsContent>
          <TabsContent value="targets">
            <form.AppField name="distribution_targets" mode="array">
              {(field) => (
                <fieldset className="grid gap-y-4">
                  <section className="grid gap-y-4">
                    {field.state.value.map((_, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[repeat(3,minmax(0,1fr))_max-content] items-end gap-x-3 rounded border border-dashed p-4 [&_button[data-slot='select-trigger']]:w-full"
                      >
                        <form.AppField
                          name={`distribution_targets[${i}].target_id`}
                        >
                          {(subField) => (
                            <Fieldset label="Target" description="">
                              <Select
                                value={subField.state.value}
                                onValueChange={(value) =>
                                  subField.handleChange(value)
                                }
                              >
                                <SelectTrigger className="col-span-full">
                                  <SelectValue placeholder="Select a target" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Bucket</SelectLabel>
                                    {buckets.map((bucket) => (
                                      <SelectItem
                                        key={bucket.id}
                                        value={bucket.id}
                                      >
                                        {bucket.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                  <SelectGroup>
                                    <SelectLabel>Goals</SelectLabel>
                                    {goals.map((goal) => (
                                      <SelectItem key={goal.id} value={goal.id}>
                                        {goal.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </Fieldset>
                          )}
                        </form.AppField>
                        <form.AppField
                          name={`distribution_targets[${i}].amount_type`}
                        >
                          {(subField) => (
                            <Fieldset label="Type" description="">
                              <Select
                                value={subField.state.value}
                                onValueChange={(
                                  value: z.infer<
                                    typeof distributionAmountTypeSchema
                                  >,
                                ) => subField.handleChange(value)}
                              >
                                <SelectTrigger className="col-span-full">
                                  <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="absolute">
                                    Absolute
                                  </SelectItem>
                                  <SelectItem value="percentage">
                                    Percentage
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </Fieldset>
                          )}
                        </form.AppField>
                        <form.AppField
                          name={`distribution_targets[${i}].amount`}
                        >
                          {(subField) => (
                            <subField.InputField
                              label="Amount"
                              description=""
                              type="number"
                              min={0}
                            />
                          )}
                        </form.AppField>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => field.removeValue(i)}
                          disabled={i === 0}
                        >
                          <Icon icon="bx:trash" />
                          <span className="sr-only">Remove Distribution</span>
                        </Button>
                      </div>
                    ))}
                  </section>
                  <Button
                    type="button"
                    className="justify-self-start"
                    onClick={() =>
                      field.pushValue({
                        target_id: "",
                        amount_type: "absolute",
                        amount: "",
                        description: "",
                      })
                    }
                  >
                    <Icon icon="bx:plus" />
                    Add Distribution
                  </Button>
                </fieldset>
              )}
            </form.AppField>
          </TabsContent>
        </form>
      </Tabs>

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
            Create
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </Main>
  );
}
