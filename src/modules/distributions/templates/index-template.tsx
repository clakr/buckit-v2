import { Main } from "@/components/shared/main";
import { Button } from "@/components/ui/button";
import { PropsWithChildren } from "react";

export function IndexTemplate({ children }: PropsWithChildren) {
  return (
    <Main className="grid gap-y-4">
      <section className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Distributions</h1>
        <Button className="justify-self-center">Create Distribution</Button>
      </section>

      {children}
    </Main>
  );
}
