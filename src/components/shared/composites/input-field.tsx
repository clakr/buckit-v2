import { Fieldset } from "@/components/shared/primitives/fieldset";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "@/main";
import type { ReactNode } from "@tanstack/react-router";
import type { ComponentProps } from "react";

type Props = ComponentProps<"input"> & {
  label: ReactNode;
  description?: ReactNode;
};

export default function InputField({
  label,
  description,
  type,
  ...props
}: Props) {
  const field = useFieldContext<string | number>();

  return (
    <Fieldset label={label} description={description}>
      <Input
        {...props}
        name={field.name}
        id={field.name}
        value={field.state.value}
        type={type}
        onBlur={field.handleBlur}
        onChange={(e) =>
          field.handleChange(
            type === "number" ? e.target.valueAsNumber : e.target.value,
          )
        }
        className="group-has-[em]:border-destructive col-span-full"
      />
    </Fieldset>
  );
}
