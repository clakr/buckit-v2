import { StateSection } from "@/components/shared/sections/state-section";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { distributeFundsSchema } from "@/lib/schemas";
import { closeDialog } from "@/lib/utils";
import { useAppForm } from "@/main";
import { useDistributeFundsMutation } from "@/modules/distributions/mutations";
import { distributionQueryOptions } from "@/modules/distributions/query-options";
import { useDistributeDropdownMenuStore } from "@/modules/distributions/stores";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

export function DistributeFundsDialog() {
  const { distributionId } = useDistributeDropdownMenuStore(
    useShallow((state) => ({
      distributionId: state.distributionId,
    })),
  );

  const {
    isPending,
    isError,
    error,
    data: distribution,
  } = useQuery(distributionQueryOptions(distributionId));

  const mutation = useDistributeFundsMutation();

  const form = useAppForm({
    defaultValues: {
      name: distribution?.name,
      description: distribution?.description,
      base_amount: distribution?.base_amount.toString(),
      distribution_targets: distribution?.distribution_targets.map(
        (target) => ({
          target_id: target.target_id,
          amount_type: target.amount_type,
          amount: target.amount.toString(),
          description: target.description,
          target_type: target.target_type,
        }),
      ),
    } as z.input<typeof distributeFundsSchema>,
    validators: {
      onSubmit: distributeFundsSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = distributeFundsSchema.parse(value);

      await mutation.mutateAsync(payload);

      form.reset();

      closeDialog();
    },
  });

  if (isPending) {
    return (
      <DialogContainer>
        <StateSection state="loading">
          <div>
            <h2 className="text-xl font-medium">
              Loading distribution's targets...
            </h2>
            <p className="text-muted-foreground max-w-[30ch] text-sm text-balance">
              Please wait while we fetch this distribution's targets.
            </p>
          </div>
        </StateSection>
      </DialogContainer>
    );
  }

  if (isError) {
    return (
      <DialogContainer>
        <StateSection state="error">
          <div>
            <h2 className="text-xl font-medium">
              Failed to load distribution's targets
            </h2>
            <p className="text-muted-foreground max-w-[30ch] text-sm text-balance">
              There was en error loading this distribution's targets. Please try
              again.
            </p>
            <p>{error.message}</p>
          </div>
        </StateSection>
      </DialogContainer>
    );
  }

  return (
    <DialogContainer>
      <form
        className="grid gap-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppForm>
          <form.SubmitButton className="justify-self-end">
            Distribute
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </DialogContainer>
  );
}

function DialogContainer({ children }: PropsWithChildren) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Distribute Funds</DialogTitle>
        <DialogDescription>{/* todo: add description */}</DialogDescription>
      </DialogHeader>
      {children}
    </>
  );
}
