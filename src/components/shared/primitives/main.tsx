import { cn } from "@/lib/utils";

export function Main({
  className,
  children,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main className={cn("px-6 py-4", className)} {...props}>
      {children}
    </main>
  );
}
