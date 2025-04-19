import { Fieldset } from "@/components/shared/primitives/fieldset";
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
    <Fieldset label={label} description={description}>
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
    </Fieldset>
  );
}
