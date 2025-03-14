import { Button } from "@/components/ui/button";
import { useFormContext } from "@/main";
import { Icon } from "@iconify/react";

export function SubmitButton({
  children,
  ...props
}: Parameters<typeof Button>["0"]) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button {...props} disabled={isSubmitting}>
          {isSubmitting ? (
            <Icon icon="bx:loader-alt" className="animate-spin" />
          ) : null}
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
}
