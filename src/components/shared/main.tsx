import { cn } from "@/lib/utils";

export function Main({
  className,
  children,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main className={cn("mx-auto max-w-5xl p-4", className)} {...props}>
      {children}
    </main>
  );
}
