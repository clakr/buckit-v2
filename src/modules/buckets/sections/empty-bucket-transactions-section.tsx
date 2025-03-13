import { Icon } from "@iconify/react";

export default function EmptyBucketTransactionsSection() {
  return (
    <section className="grid min-h-[15svh] place-content-center place-items-center gap-y-4 text-center">
      <div className="bg-muted grid size-(--container-size) place-items-center rounded-full p-[calc(var(--container-size)/6)] [--container-size:theme(spacing.12)]">
        <Icon
          icon="qlementine-icons:empty-slot-16"
          className="text-muted-foreground size-full"
        />
      </div>
      <div>
        <h2 className="text-xl font-medium">No transactions yet.</h2>
        <p className="text-muted-foreground text-sm">
          This bucket doesn't have any transactions.
        </p>
      </div>
    </section>
  );
}
