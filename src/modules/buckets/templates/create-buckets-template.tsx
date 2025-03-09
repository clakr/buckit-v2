import LoadingButton from "@/components/shared/composites/loading-button";
import Main from "@/components/shared/main";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBucketsMutation } from "@/modules/buckets/hooks";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

export default function CreateBucketTemplate() {
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useCreateBucketsMutation();

  const schema = z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must be less than 255 characters"),
    description: z
      .string()
      .max(1000, "Description must be less than 1000 characters"),
    current_amount: z.coerce
      .number()
      .min(-1_000_000_000, "Amount must be at least -1,000,000,000") // Lower limit
      .max(1_000_000_000, "Amount must be less than 1,000,000,000"), // Upper limit
  });

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      current_amount: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const { success, error } = schema.safeParse(value);

        if (!success) {
          return {
            fields: error.flatten().fieldErrors,
          };
        }
      },
    },
    onSubmit: async ({ value }) => {
      const payload = schema.parse(value);

      await mutateAsync(payload);

      navigate({
        to: "/buckets",
      });
    },
  });

  return (
    <Main className="grid gap-y-4">
      <h1 className="text-3xl font-bold">Create Bucket</h1>
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
    </Main>
  );
}
