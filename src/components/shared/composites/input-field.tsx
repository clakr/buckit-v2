import { Fieldset } from "@/components/shared/composites/fieldset";
import { Input } from "@/components/ui/input";
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
    <Fieldset label={label} description={description}>
      <Input
        {...props}
        name={field.name}
        id={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className="group-has-[em]:border-destructive col-span-full"
      />
    </Fieldset>
  );
}
