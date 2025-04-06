import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/main";
import type { ReactNode } from "@tanstack/react-router";
import type { ComponentProps } from "react";

type Props = ComponentProps<"input"> & {
  label: ReactNode;
  description?: ReactNode;
};

export default function InputField({ label, description, ...props }: Props) {
  const field = useFieldContext<string>();

  return (
    <fieldset className="group grid grid-cols-2 gap-y-1.5">
      <div className="gap-y-0,5 grid">
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
      <Input
        {...props}
        name={field.name}
        id={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className="group-has-[em]:border-destructive col-span-full"
      />
    </fieldset>
  );
}
