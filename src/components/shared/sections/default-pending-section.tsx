import { Icon } from "@iconify/react";

export function DefaultPendingSection() {
  return (
    <section className="grid min-h-svh place-items-center">
      <div className="bg-muted text-muted-foreground grid size-20 place-items-stretch rounded-full p-4">
        <Icon icon="bx:loader-alt" className="size-full animate-spin" />
      </div>
    </section>
  );
}
