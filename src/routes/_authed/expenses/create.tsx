import { DataTable } from "@/components/shared/composites/data-table";
import { Fieldset } from "@/components/shared/primitives/fieldset";
import { Main } from "@/components/shared/primitives/main";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  baseCreateExpenseItemSchema,
  baseExpenseItemSchema,
  baseExpenseParticipantSchema,
  createExpenseSchema,
} from "@/lib/schemas";
import { formatToCurrency } from "@/lib/utils";
import { useAppForm } from "@/main";
import {
  settlementPlanColumns,
  summaryBreakdownColumns,
} from "@/modules/expenses/columns";
import { ParticipantsBadgeList } from "@/modules/expenses/components/participants-badge-list";
import { useCreateExpenseMutation } from "@/modules/expenses/mutations";
import {
  calculateBreakdown,
  calculateSettlements,
} from "@/modules/expenses/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { z } from "zod";

export const Route = createFileRoute("/_authed/expenses/create")({
  component: RouteComponent,
});

const expenseId = crypto.randomUUID();

const DEFAULT_ITEM_VALUE: z.input<typeof baseCreateExpenseItemSchema> = {
  id: crypto.randomUUID(),
  expense_id: expenseId,
  description: "",
  amount: 0,
  expense_participant_id: "",
  type: "equal",
  distributions: [],
};

function RouteComponent() {
  const navigate = Route.useNavigate();

  const mutation = useCreateExpenseMutation();

  const form = useAppForm({
    defaultValues: {
      id: expenseId,
      name: "",
      description: "",
      status: "calculated",
      participants: [],
      items: [{ ...DEFAULT_ITEM_VALUE }],
    } as z.input<typeof createExpenseSchema>,
    validators: {
      onSubmit: createExpenseSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = createExpenseSchema.parse(value);

      await mutation.mutateAsync(payload);

      navigate({
        to: "/expenses",
      });
    },
  });

  const participants = useStore(
    form.store,
    (state) => state.values.participants,
  );

  const participantInputRef = useRef<HTMLInputElement>(null);

  function handleAddParticipant() {
    const inputElement = participantInputRef.current;
    if (!inputElement) return;

    const participant = inputElement.value;

    if (participants.some((p) => p.name === participant)) return;

    const { success, error, data } = baseExpenseParticipantSchema.safeParse({
      name: participant,
      expense_id: expenseId,
    });

    if (!success && error) return;

    form.pushFieldValue("participants", data);

    inputElement.value = "";
  }

  function calculateDistributions(item: z.input<typeof baseExpenseItemSchema>) {
    let amount = 0;

    if (item.amount && item.type === "equal") {
      amount = item.amount / participants.length;
    }

    return participants.map((participant) => ({
      expense_item_id: item.id,
      expense_participant_id: participant.name,
      amount,
    }));
  }

  useEffect(() => {
    form.setFieldValue("items", (items) =>
      items.map((item) => {
        const distributions = calculateDistributions(item);

        return {
          ...item,
          distributions,
        };
      }),
    );
  }, [participants]);

  function handleSyncDistributions(itemIndex: number) {
    const item = form.getFieldValue(`items[${itemIndex}]`);

    const distributions = calculateDistributions(item);

    form.setFieldValue(`items[${itemIndex}].distributions`, distributions);
  }

  function handleAddItem() {
    const itemId = crypto.randomUUID();

    form.pushFieldValue("items", {
      ...DEFAULT_ITEM_VALUE,
      id: itemId,
      distributions: participants.map((participant) => ({
        expense_item_id: itemId,
        expense_participant_id: participant.name,
        amount: 0,
      })),
    });
  }

  const totalSummary = useStore(form.store, (state) =>
    state.values.items.reduce((acc, item) => acc + item.amount, 0),
  );

  const { breakdown, settlements } = useStore(form.store, (state) => {
    const breakdown = calculateBreakdown(
      state.values.participants,
      state.values.items,
    );

    const settlements = calculateSettlements({
      expenseId,
      breakdown,
    });

    return { breakdown, settlements };
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
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="grid gap-y-4">
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
            <form.AppField name="participants" mode="array">
              {() => (
                <section className="flex flex-col gap-y-2 rounded-md border p-4">
                  <h2 className="text-sm font-medium">Participants</h2>
                  <form.Subscribe
                    selector={(state) => state.values.participants}
                  >
                    {(participants) => (
                      <ParticipantsBadgeList
                        participants={participants}
                        removeParticipant={(index) => {
                          form.removeFieldValue("participants", index);
                        }}
                      />
                    )}
                  </form.Subscribe>
                  <div className="@container mt-2 grid grid-cols-[minmax(200px,1fr)_auto] gap-x-2 gap-y-1.5">
                    <Input
                      ref={participantInputRef}
                      id="participant-input"
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return;

                        e.preventDefault();
                        handleAddParticipant();
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddParticipant}
                    >
                      <Icon icon="bx:plus" />
                      <span className="@max-sm:hidden">Add Participant</span>
                    </Button>
                    <p className="text-muted-foreground col-span-full text-xs">
                      Type a name and press{" "}
                      <Badge
                        variant="outline"
                        className="px-1 py-0.5 font-mono"
                      >
                        Enter
                      </Badge>{" "}
                      or click "Add Participant"
                    </p>
                  </div>
                </section>
              )}
            </form.AppField>
          </TabsContent>
          <TabsContent value="items">
            <form.AppField name="items" mode="array">
              {() => (
                <section className="grid gap-y-4">
                  <ul className="grid gap-y-4">
                    <form.Subscribe selector={(state) => state.values.items}>
                      {(items) =>
                        items.map((_, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="border-accent/75 @container flex flex-col gap-y-3 rounded-md border"
                          >
                            <div className="grid gap-3 p-6 @min-3xl:grid-cols-[repeat(3,minmax(200px,1fr))_minmax(0,1fr)]">
                              <form.AppField
                                name={`items[${itemIndex}].amount`}
                                listeners={{
                                  onChange: () =>
                                    handleSyncDistributions(itemIndex),
                                }}
                              >
                                {(field) => (
                                  <field.InputField
                                    label="Amount"
                                    type="number"
                                    step={0.01}
                                    min={0}
                                    max={1_000_000_000}
                                  />
                                )}
                              </form.AppField>
                              <form.AppField
                                name={`items[${itemIndex}].description`}
                              >
                                {(field) => (
                                  <field.InputField
                                    label="Description"
                                    type="text"
                                  />
                                )}
                              </form.AppField>
                              <form.AppField
                                name={`items[${itemIndex}].expense_participant_id`}
                              >
                                {(field) => (
                                  <Fieldset label="Payer">
                                    <form.Subscribe
                                      selector={(state) =>
                                        state.values.participants.map(
                                          (participant) => ({
                                            value: participant.name,
                                            label: participant.name,
                                          }),
                                        )
                                      }
                                    >
                                      {(options) => (
                                        <Select
                                          value={field.state.value}
                                          onValueChange={field.handleChange}
                                          disabled={options.length === 0}
                                        >
                                          <SelectTrigger className="col-span-full w-full capitalize">
                                            <SelectValue placeholder="Select a participant" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {options.map((option) => (
                                              <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="capitalize"
                                              >
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      )}
                                    </form.Subscribe>
                                  </Fieldset>
                                )}
                              </form.AppField>
                              <Button
                                type="button"
                                variant="secondary"
                                className="self-end justify-self-end @min-3xl:justify-self-start"
                                onClick={() => {
                                  if (items.length === 1) return;
                                  form.removeFieldValue("items", itemIndex);
                                }}
                                disabled={items.length === 1}
                              >
                                <Icon icon="bx:trash" />
                              </Button>
                            </div>

                            <form.Subscribe
                              selector={(state) => state.values.participants}
                            >
                              {(participants) =>
                                participants.length > 0 ? (
                                  <div className="bg-accent/25 border-accent/75 flex flex-col gap-y-6 border-t p-6">
                                    <form.AppField
                                      name={`items[${itemIndex}].type`}
                                      listeners={{
                                        onChange: () =>
                                          handleSyncDistributions(itemIndex),
                                      }}
                                    >
                                      {(field) => (
                                        <field.RadioGroupField
                                          label="Type"
                                          options={[
                                            {
                                              value: "equal",
                                              label: "Equal",
                                            },
                                            {
                                              value: "percentage",
                                              label: "Percentage",
                                            },
                                            {
                                              value: "absolute",
                                              label: "Absolute",
                                            },
                                          ]}
                                          orientation="horizontal"
                                        />
                                      )}
                                    </form.AppField>
                                    <form.Subscribe
                                      selector={(state) =>
                                        state.values.items[itemIndex].type
                                      }
                                    >
                                      {(type) =>
                                        type !== "equal" ? (
                                          <form.AppField
                                            name={`items[${itemIndex}].distributions`}
                                            mode="array"
                                          >
                                            {() => (
                                              <section className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
                                                <form.Subscribe
                                                  selector={(state) =>
                                                    state.values.items[
                                                      itemIndex
                                                    ].distributions
                                                  }
                                                >
                                                  {(distributions) =>
                                                    distributions.map(
                                                      (
                                                        distribution,
                                                        distributionIndex,
                                                      ) => (
                                                        <form.AppField
                                                          key={
                                                            distributionIndex
                                                          }
                                                          name={`items[${itemIndex}].distributions[${distributionIndex}].amount`}
                                                        >
                                                          {(field) => (
                                                            <field.InputField
                                                              label={
                                                                distribution.expense_participant_id
                                                              }
                                                              type="number"
                                                            />
                                                          )}
                                                        </form.AppField>
                                                      ),
                                                    )
                                                  }
                                                </form.Subscribe>
                                              </section>
                                            )}
                                          </form.AppField>
                                        ) : null
                                      }
                                    </form.Subscribe>
                                  </div>
                                ) : null
                              }
                            </form.Subscribe>
                          </li>
                        ))
                      }
                    </form.Subscribe>
                  </ul>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddItem}
                  >
                    <Icon icon="bx:plus" />
                    Add Item
                  </Button>
                </section>
              )}
            </form.AppField>
          </TabsContent>
          <TabsContent value="summary">
            <section className="bg-accent/25 border-accent/75 flex flex-col gap-y-6 rounded-md border p-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  Total Summary: {formatToCurrency(totalSummary)}
                </h2>
              </div>
              <Separator className="border-accent/75" />
              <div>
                <h3 className="font-medium">Breakdown</h3>
                <DataTable columns={summaryBreakdownColumns} data={breakdown} />
              </div>
              <Separator className="border-accent/75" />
              <div>
                <h3 className="font-medium">Settlement Plan</h3>
                <DataTable columns={settlementPlanColumns} data={settlements} />
              </div>
            </section>
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
