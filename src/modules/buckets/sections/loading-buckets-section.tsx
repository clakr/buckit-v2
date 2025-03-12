import { Icon } from "@iconify/react";

export default function LoadingBucketsSection() {
  return (
    <section className="grid min-h-[25svh] place-content-center place-items-center gap-y-4 text-center">
      <Icon
        icon="bx:loader-alt"
        className="text-muted-foreground size-12 animate-spin"
      />
      <div>
        <h2 className="text-xl font-medium">Loading buckets...</h2>
        <p className="text-muted-foreground text-sm">
          Please wait while we fetch your buckets.
        </p>
      </div>
    </section>
  );
}
