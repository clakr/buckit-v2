import { Fieldset } from "@/components/shared/primitives/fieldset";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
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
  orientation?: "horizontal" | "vertical";
};

export default function RadioGroupField({
  label,
  description,
  options,
  orientation = "vertical",
  ...props
}: Props) {
  const field = useFieldContext<string>();

  return (
    <Fieldset label={label} description={description}>
      <RadioGroup
        {...props}
        name={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
        className={cn(
          "col-span-full gap-y-2",
          orientation === "horizontal" && "flex flex-row",
        )}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-x-2">
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
    </Fieldset>
  );
}
