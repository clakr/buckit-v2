import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export default function LoadingButton({
  children,
  isLoading,
  ...props
}: Parameters<typeof Button>["0"] & { isLoading: boolean }) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? (
        <Icon icon="bx:loader-alt" className="animate-spin" />
      ) : null}
      {children}
    </Button>
  );
}
