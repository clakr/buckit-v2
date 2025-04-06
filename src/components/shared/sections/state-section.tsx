import { Icon } from "@iconify/react";
import { PropsWithChildren } from "react";

type State = "loading" | "error" | "empty";

type Props = PropsWithChildren<{ state: State }>;

function StateIcon({ state }: { state: State }) {
  if (state === "loading") {
    return (
      <Icon
        icon="bx:loader-alt"
        className="text-muted-foreground size-full animate-spin"
      />
    );
  } else if (state === "error") {
    return (
      <Icon icon="bx:info-circle" className="text-muted-foreground size-full" />
    );
  }

  return (
    <Icon
      icon="qlementine-icons:empty-slot-16"
      className="text-muted-foreground size-full"
    />
  );
}

export function StateSection({ children, state }: Props) {
  return (
    <section className="grid min-h-[15svh] place-content-center place-items-center gap-y-4 text-center">
      <div className="bg-muted grid size-(--container-size) place-items-center rounded-full p-[calc(var(--container-size)/6)] [--container-size:theme(spacing.12)]">
        <StateIcon state={state} />
      </div>
      {children}
    </section>
  );
}
