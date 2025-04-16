import { Main } from "@/components/shared/main";
import { PropsWithChildren } from "react";

export function IndexTemplate({ children }: PropsWithChildren) {
  return (
    <Main className="grid gap-y-4">
      <section className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </section>

      {children}
    </Main>
  );
}
