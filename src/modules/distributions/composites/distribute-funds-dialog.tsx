import { StateSection } from "@/components/shared/sections/state-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { distributeFundsSchema } from "@/lib/schemas";
import { closeDialog, formatToCurrency } from "@/lib/utils";
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

  const defaultValues: z.input<typeof distributeFundsSchema> = {
    buckets: [],
    goals: [],
  };

  distribution?.distribution_targets.forEach((target) => {
    const amount = (
      target.amount_type === "absolute"
        ? target.amount
        : (distribution.base_amount * target.amount) / 100
    ).toFixed(2);

    const transactionData = {
      description: distribution.name,
      amount,
    };

    if (target.target_type === "bucket") {
      defaultValues.buckets.push({
        ...transactionData,
        bucket_id: target.target_id,
        type: "inbound",
      });
    } else {
      defaultValues.goals.push({
        ...transactionData,
        goal_id: target.target_id,
        type: "inbound",
      });
    }
  });

  const mutation = useDistributeFundsMutation();

  const form = useAppForm({
    defaultValues,
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

  const distributionTargets = Object.values(defaultValues).flat();
  const totalAmount = distributionTargets.reduce(
    (acc, target) => acc + +target.amount,
    0,
  );

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
        {mutation.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{mutation.error.message}</AlertDescription>
          </Alert>
        ) : null}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {distributionTargets.map((target, index) => (
              <TableRow key={index}>
                <TableCell>
                  {"bucket_id" in target ? target.bucket_id : target.goal_id}
                </TableCell>
                <TableCell>{formatToCurrency(+target.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="text-base font-bold [&>td]:py-3">
              <TableCell className="text-end">Total Amount</TableCell>
              <TableCell>{formatToCurrency(totalAmount)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
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
