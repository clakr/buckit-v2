import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormContext } from "@/main";
import { Icon } from "@iconify/react";

type Props = Parameters<typeof Button>[0];

export default function SubmitButton({ children, className, ...props }: Props) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          {...props}
          type="submit"
          disabled={!canSubmit}
          className={cn("", className)}
        >
          {isSubmitting ? (
            <Icon icon="bx:loader" className="animate-spin" />
          ) : null}
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
}
