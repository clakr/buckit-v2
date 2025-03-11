import LoadingButton from "@/components/shared/composites/loading-button";
import Main from "@/components/shared/main";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBucketMutation } from "@/modules/buckets/hooks";
import { bucketQueryOptions } from "@/modules/buckets/query-options";
import { updateBucketSchema } from "@/modules/buckets/schemas";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/buckets/$bucketId")({
  component: BucketTemplate,
  loader: ({ context: { queryClient }, params: { bucketId } }) =>
    queryClient.ensureQueryData(bucketQueryOptions(bucketId)),
});

function BucketTemplate() {
  const navigate = Route.useNavigate();
  const { bucketId } = Route.useParams();

  const { data: bucket } = useSuspenseQuery(bucketQueryOptions(bucketId));

  const { mutateAsync, isPending } = useUpdateBucketMutation();

  const form = useForm({
    defaultValues: {
      name: bucket?.name ?? "",
      description: bucket?.description ?? "",
      current_amount: bucket?.current_amount ?? "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const { success, error } = updateBucketSchema.safeParse(value);

        if (!success) {
          return {
            fields: error.flatten().fieldErrors,
          };
        }
      },
    },
    onSubmit: async ({ value }) => {
      const payload = updateBucketSchema.parse(value);

      await mutateAsync({
        id: bucketId,
        ...payload,
      });

      navigate({
        to: "/buckets",
        search: {
          bucketId: "",
        },
      });
    },
  });

  return (
    <Main>
      <form
        className="grid gap-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
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
          Update
        </LoadingButton>
      </form>
    </Main>
  );
}
