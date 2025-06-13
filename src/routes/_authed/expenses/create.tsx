import { Main } from "@/components/shared/primitives/main";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
