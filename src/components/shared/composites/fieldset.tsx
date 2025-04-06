import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/main";
import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{ label: ReactNode; description?: ReactNode }>;

export function Fieldset({ children, label, description }: Props) {
  const field = useFieldContext<string>();

  return (
    <fieldset className="group grid grid-cols-2 gap-y-1.5">
      <div className="grid gap-y-0.5">
        <Label htmlFor={field.name} className="group-has-[em]:text-destructive">
          {label}
        </Label>
        {description ? (
          <p className="text-muted-foreground group-has-[em]:text-destructive text-xs">
            {description}
          </p>
        ) : null}
      </div>
      {typeof field.state.meta.errors[0] === "object" ? (
        <em role="alert" className="text-destructive self-end text-end text-sm">
          {field.state.meta.errors[0].message}
        </em>
      ) : null}
      {children}
    </fieldset>
  );
}
