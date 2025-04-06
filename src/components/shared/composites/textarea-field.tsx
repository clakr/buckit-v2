import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "@/main";
import type { ReactNode } from "@tanstack/react-router";
import type { ComponentProps } from "react";

type Props = ComponentProps<"textarea"> & {
  label: ReactNode;
  description?: ReactNode;
};

export default function TextareaField({ label, description, ...props }: Props) {
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
      <Textarea
        {...props}
        name={field.name}
        id={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        rows={5}
        className="group-has-[em]:border-destructive col-span-full"
      />
    </fieldset>
  );
}
