import LoadingButton from "@/components/shared/composites/loading-button";
import Main from "@/components/shared/main";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBucketsMutation } from "@/modules/buckets/hooks";
import { useNavigate } from "@tanstack/react-router";
import React from "react";

export default function CreateBucketTemplate() {
  const navigate = useNavigate();

  const name = React.useId();
  const description = React.useId();
  const currentAmount = React.useId();

  const { mutateAsync, isPending } = useCreateBucketsMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    await mutateAsync({
      name: formData.get("name")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
      current_amount: +(formData.get("currentAmount") ?? 0),
    });

    navigate({
      to: "/buckets",
    });
  }

  return (
    <Main className="grid gap-y-4">
      <h1 className="text-3xl font-bold">Create Bucket</h1>
      <form className="grid gap-y-3" onSubmit={handleSubmit}>
        <fieldset className="grid gap-y-1.5">
          <Label htmlFor={name}>Name</Label>
          <Input id={name} type="text" name="name" placeholder="Enter name" />
        </fieldset>
        <fieldset className="grid gap-y-1.5">
          <Label className="items-end gap-x-1" htmlFor={description}>
            Description <small>(optional)</small>
          </Label>
          <Textarea
            id={description}
            name="description"
            placeholder="Enter description"
            rows={5}
          />
        </fieldset>
        <fieldset className="grid gap-y-1.5">
          <Label htmlFor={currentAmount}>Current Amount</Label>
          <Input
            id={currentAmount}
            type="number"
            name="currentAmount"
            step="0.01"
            placeholder="Enter current amount"
            defaultValue={0}
          />
        </fieldset>
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
