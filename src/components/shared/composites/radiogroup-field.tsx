import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFieldContext } from "@/main";
import type { ReactNode } from "@tanstack/react-router";
import type { ComponentProps } from "react";

type Option = {
  value: string;
  label: ReactNode;
};

type Props = Omit<
  ComponentProps<typeof RadioGroup>,
  "value" | "defaultValue"
> & {
  label: ReactNode;
  description?: ReactNode;
  options: Option[];
};

export default function RadioGroupField({
  label,
  description,
  options,
  ...props
}: Props) {
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
      <RadioGroup
        {...props}
        name={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
        className="col-span-full gap-y-2"
      >
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center gap-x-2 first:mt-2"
          >
            <RadioGroupItem
              value={option.value}
              id={`${field.name}-${option.value}`}
            />
            <Label htmlFor={`${field.name}-${option.value}`}>
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
