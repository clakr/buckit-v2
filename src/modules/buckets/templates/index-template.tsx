import { Main } from "@/components/shared/main";
import { Button } from "@/components/ui/button";
import { useCreateBucketDialogStore } from "@/modules/buckets/stores";
import { PropsWithChildren } from "react";

export function IndexTemplate({ children }: PropsWithChildren) {
  const toggleCreateBucketDialog = useCreateBucketDialogStore(
    (state) => state.toggleDialog,
  );

  return (
    <Main className="grid gap-y-4">
      <section className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Buckets</h1>
        <Button
          className="justify-self-center"
          onClick={toggleCreateBucketDialog}
        >
          Create Bucket
        </Button>
      </section>

      {children}
    </Main>
  );
}
