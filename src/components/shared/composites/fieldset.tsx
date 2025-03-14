import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/main";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ label: string }>;

export function Fieldset({ children, label }: Props) {
  const field = useFieldContext();

  return (
    <fieldset className="group grid grid-cols-2 gap-y-1.5">
      <Label htmlFor={field.name} className="group-has-[em]:text-destructive">
        {label}
      </Label>
      {field.state.meta.errors.length > 0 ? (
        <em role="alert" className="text-destructive text-end text-sm/none">
          {field.state.meta.errors.join(", ")}
        </em>
      ) : null}
      {children}
    </fieldset>
  );
}
