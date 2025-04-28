import { Fieldset } from "@/components/shared/primitives/fieldset";
import { Main } from "@/components/shared/primitives/main";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  distributionAmountTypeSchema,
  updateDistributionSchema,
} from "@/lib/schemas";
import { cn, formatToCurrency } from "@/lib/utils";
import { queryClient, useAppForm } from "@/main";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { GoalCommandItem } from "@/modules/distributions/composites/goal-command-item";
import { useUpdateDistributionMutation } from "@/modules/distributions/mutations";
import { distributionQueryOptions } from "@/modules/distributions/query-options";
import { goalsQueryOptions } from "@/modules/goals/query-options";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useStore } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authed/distributions/$distributionId/edit",
)({
  loader: ({ params }) => {
    queryClient.ensureQueryData(
      distributionQueryOptions(params.distributionId),
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { distributionId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { data } = useSuspenseQuery(distributionQueryOptions(distributionId));

  const mutation = useUpdateDistributionMutation();

  const form = useAppForm({
    defaultValues: {
      id: data.id,
      name: data.name,
      description: data.description,
      base_amount: data.base_amount,
      distribution_targets: data.distribution_targets.map((target) => ({
        target_id: target.target_id,
        amount_type: target.amount_type,
        amount: target.amount,
        description: target.description,
      })),
    } as z.input<typeof updateDistributionSchema>,
    validators: {
      onSubmit: updateDistributionSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = updateDistributionSchema.parse(value);

      await mutation.mutateAsync(payload);

      navigate({
        to: "/distributions",
      });
    },
  });

  const { data: buckets } = useSuspenseQuery(bucketsQueryOptions);
  const { data: goals } = useSuspenseQuery(goalsQueryOptions);

  const filteredGoals = goals.filter(
    (goal) => goal.current_amount < goal.target_amount,
  );

  const allTargets = [...buckets, ...filteredGoals];

  const baseAmount = useStore(form.store, (state) => +state.values.base_amount);
  const accumulatedAmount = useStore(form.store, (state) =>
    state.values.distribution_targets.reduce((sum, target) => {
      const amount = +target.amount;

      if (target.amount_type === "absolute") {
        return sum + amount;
      }

      return sum + (baseAmount * amount) / 100;
    }, 0),
  );
  const remainingAmount = baseAmount - accumulatedAmount;

  return (
    <Main className="grid gap-y-4">
      <section className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Update Distribution</h1>
      </section>

      {mutation.isError ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{mutation.error.message}</AlertDescription>
        </Alert>
      ) : null}

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
                  step={0.01}
                  min={1}
                  max={1_000_000_000}
                />
              )}
            </form.AppField>
          </TabsContent>
          <TabsContent value="targets" className="grid gap-y-4">
            <form.AppField name="distribution_targets" mode="array">
              {(field) => (
                <fieldset className="grid gap-y-4">
                  <section className="grid gap-y-4">
                    {field.state.value.map((_, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[repeat(3,minmax(0,1fr))_max-content] items-end gap-x-3 rounded border border-dashed p-4 [&_button[data-slot='popover-trigger']]:col-span-full [&_button[data-slot='select-trigger']]:w-full"
                      >
                        <form.AppField
                          name={`distribution_targets[${i}].target_id`}
                        >
                          {(subField) => (
                            <Fieldset label="Target">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="justify-between"
                                  >
                                    {subField.state.value
                                      ? allTargets.find(
                                          (target) =>
                                            target.id === subField.state.value,
                                        )?.name
                                      : "Select target"}
                                    <Icon
                                      icon="bx:chevron-down"
                                      className="ml-2 shrink-0 opacity-50"
                                    />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0">
                                  <Command>
                                    <CommandList>
                                      <CommandGroup heading="Buckets">
                                        {buckets.map((bucket) => (
                                          <CommandItem
                                            key={bucket.id}
                                            value={bucket.id}
                                            onSelect={subField.handleChange}
                                          >
                                            <Icon
                                              icon="bx:check"
                                              className={cn(
                                                "mr-2",
                                                subField.state.value ===
                                                  bucket.id
                                                  ? "opacity-100"
                                                  : "opacity-0",
                                              )}
                                            />
                                            <strong>{bucket.name}</strong>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                      <CommandGroup heading="Goals">
                                        {filteredGoals.map((goal) => (
                                          <GoalCommandItem
                                            key={goal.id}
                                            value={goal.id}
                                            onSelect={subField.handleChange}
                                            goal={goal}
                                          >
                                            <Icon
                                              icon="bx:check"
                                              className={cn(
                                                "mr-2",
                                                subField.state.value === goal.id
                                                  ? "opacity-100"
                                                  : "opacity-0",
                                              )}
                                            />
                                          </GoalCommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </Fieldset>
                          )}
                        </form.AppField>
                        <form.AppField
                          name={`distribution_targets[${i}].amount_type`}
                        >
                          {(subField) => (
                            <Fieldset label="Type">
                              <Select
                                value={subField.state.value}
                                onValueChange={(
                                  value: z.infer<
                                    typeof distributionAmountTypeSchema
                                  >,
                                ) => {
                                  subField.handleChange(value);
                                }}
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
                              type="number"
                              step={0.01}
                              min={0}
                              max={1_000_000_000}
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
                    Add Target
                  </Button>
                </fieldset>
              )}
            </form.AppField>

            <Separator />

            <section className="px-4">
              <dl className="grid grid-cols-[minmax(0,1fr)_max-content] items-end gap-x-4 text-end [&_dd]:font-bold [&_dt]:font-medium">
                <dt className="text-primary">Base Amount: </dt>
                <dd className="text-primary text-3xl">
                  {formatToCurrency(baseAmount)}
                </dd>
                <dt>Accumulated:</dt>
                <dd className="text-xl">
                  {formatToCurrency(accumulatedAmount)}
                </dd>
                {remainingAmount > 0 && remainingAmount !== baseAmount ? (
                  <>
                    <dt>Remaining:</dt>
                    <dd className="text-xl">
                      {formatToCurrency(remainingAmount)}
                    </dd>
                  </>
                ) : null}
              </dl>
            </section>

            <Separator />
          </TabsContent>

          <form.AppForm>
            <form.SubmitButton className="self-end">
              Update Distribution
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </Tabs>
    </Main>
  );
}
