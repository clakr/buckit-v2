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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  baseExpenseParticipantSchema,
  createExpenseSchema,
} from "@/lib/schemas";
import { useAppForm } from "@/main";
import { useCreateExpenseMutation } from "@/modules/expenses/mutations";
import { Icon } from "@iconify/react/dist/iconify.js";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
      participants: [],
      items: [
        {
          description: "",
          amount: "",
          expense_participant_id: "",
          type: "percentage",
        },
      ],
    } as z.input<typeof createExpenseSchema>,
    validators: {
      onSubmit: createExpenseSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = createExpenseSchema.parse(value);

      await mutation.mutateAsync(payload);
    },
  });

  const [participantInput, setParticipantInput] = useState("");

  function handleAddParticipant(
    participant: z.input<typeof baseExpenseParticipantSchema>,
  ) {
    const participants = form.state.values.participants;

    if (participants.some((p) => p.name === participant.name)) return;

    const { success, error, data } =
      baseExpenseParticipantSchema.safeParse(participant);

    if (!success && error) return;

    form.setFieldValue("participants", [...participants, data]);

    setParticipantInput("");
  }

  const participantOptions = form.state.values.participants.map(
    (participant) => ({
      value: participant.name,
      label: participant.name,
    }),
  );

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
              {(field) => (
                <section className="flex flex-col gap-y-2 rounded-md border p-4">
                  <h2 className="text-sm font-medium">Participants</h2>
                  {field.state.value.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No participants added yet.
                    </p>
                  ) : (
                    <ul className="flex flex-wrap gap-2">
                      {field.state.value.map((participant, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="font-semibold"
                          asChild
                        >
                          <li>
                            {participant.name}
                            <button
                              type="button"
                              className="grid size-4 cursor-pointer place-content-center"
                              onClick={() => field.removeValue(i)}
                            >
                              <Icon icon="bx:x" />
                            </button>
                          </li>
                        </Badge>
                      ))}
                    </ul>
                  )}
                  <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 gap-y-1.5">
                    <Input
                      value={participantInput}
                      onChange={(e) => setParticipantInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddParticipant({
                            name: participantInput,
                          });
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        handleAddParticipant({
                          name: participantInput,
                        });
                      }}
                    >
                      <Icon icon="bx:plus" />
                      Add Participant
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
              {(field) => (
                <section className="grid gap-y-4">
                  <ul className="grid gap-y-4">
                    {field.state.value.map((item, i) => (
                      <li
                        key={i}
                        className="border-accent/75 flex flex-col gap-y-3 rounded-md border"
                      >
                        <div className="grid grid-cols-[repeat(3,minmax(0px,200px))] gap-x-3 p-4">
                          <form.AppField name={`items[${i}].amount`}>
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
                          <form.AppField name={`items[${i}].description`}>
                            {(subField) => (
                              <subField.InputField
                                label="Description"
                                type="text"
                              />
                            )}
                          </form.AppField>
                          <form.AppField
                            name={`items[${i}].expense_participant_id`}
                          >
                            {(subField) => (
                              <Fieldset label="Participant">
                                <Select
                                  value={subField.state.value}
                                  onValueChange={(value) => {
                                    subField.handleChange(value);
                                  }}
                                  disabled={participantOptions.length === 0}
                                >
                                  <SelectTrigger className="col-span-full w-full capitalize">
                                    <SelectValue placeholder="Select a participant" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {participantOptions.map((option) => (
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
                              </Fieldset>
                            )}
                          </form.AppField>
                        </div>
                        <div className="bg-accent/25 border-accent/75 border-t p-4">
                          <form.AppField name={`items[${i}].type`}>
                            {(subField) => (
                              <subField.RadioGroupField
                                label="Type"
                                options={[
                                  { value: "absolute", label: "Absolute" },
                                  { value: "percentage", label: "Percentage" },
                                ]}
                                orientation="horizontal"
                              />
                            )}
                          </form.AppField>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      field.pushValue({
                        description: "",
                        amount: "",
                        expense_participant_id: "",
                        type: "percentage",
                      })
                    }
                  >
                    <Icon icon="bx:plus" />
                    Add Item
                  </Button>
                </section>
              )}
            </form.AppField>
          </TabsContent>
          <TabsContent value="summary">summary</TabsContent>

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
