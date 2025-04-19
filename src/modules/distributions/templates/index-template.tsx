import { Main } from "@/components/shared/primitives/main";
import { Button } from "@/components/ui/button";
import { useCreateDistributionDialogStore } from "@/modules/distributions/stores";
import { PropsWithChildren } from "react";
import { useShallow } from "zustand/react/shallow";

export function IndexTemplate({ children }: PropsWithChildren) {
  const toggleDialog = useCreateDistributionDialogStore(
    useShallow((state) => state.toggleDialog),
  );

  return (
    <Main className="grid gap-y-4">
      <section className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Distributions</h1>
        <Button onClick={toggleDialog}>Create Distribution</Button>
      </section>

      {children}
    </Main>
  );
}
