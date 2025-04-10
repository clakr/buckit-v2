import { Icon } from "@iconify/react";

export function DefaultPendingSection() {
  return (
    <section className="grid min-h-[25svh] place-items-center outline">
      <div className="bg-muted text-muted-foreground size-20 p-4">
        <Icon icon="bx:loader-alt" className="" />
      </div>
    </section>
  );
}
