import { DataTable } from "@/components/shared/composites/data-table";
import { StateSection } from "@/components/shared/sections/state-section";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { columns } from "@/modules/goals/columns";
import { goalTransactionsQueryOptions } from "@/modules/goals/query-options";
import { useGoalDropdownMenuStore } from "@/modules/goals/stores";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useShallow } from "zustand/react/shallow";

export function ViewGoalTransactionsDialog() {
  const { goalId } = useGoalDropdownMenuStore(
    useShallow((state) => ({ goalId: state.goalId })),
  );

  const {
    isPending,
    isError,
    error,
    data: transactions,
  } = useQuery(goalTransactionsQueryOptions(goalId));

  if (isPending) {
    return (
      <DialogContainer>
        <StateSection state="loading">
          <div>
            <h2 className="text-xl font-medium">Loading transactions...</h2>
            <p className="text-muted-foreground max-w-[30ch] text-sm text-balance">
              Please wait while we fetch the transaction history for this goal.
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
            <h2 className="text-xl font-medium">Failed to load transactions</h2>
            <p className="text-muted-foreground max-w-[30ch] text-sm text-balance">
              There was en error loading your goals. Please try again.
            </p>
            <p>{error.message}</p>
          </div>
        </StateSection>
      </DialogContainer>
    );
  }

  if (transactions.length === 0) {
    return (
      <DialogContainer>
        <StateSection state="empty">
          <div>
            <h2 className="text-xl font-medium">No transactions yet.</h2>
            <p className="text-muted-foreground text-sm">
              This goal doesn't have any transactions.
            </p>
          </div>
        </StateSection>
      </DialogContainer>
    );
  }

  return (
    <DialogContainer>
      <DataTable columns={columns} data={transactions} />
    </DialogContainer>
  );
}

function DialogContainer({ children }: PropsWithChildren) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>View Goal Transactions</DialogTitle>
        <DialogDescription>
          These are all the transactions for this goal.
        </DialogDescription>
      </DialogHeader>
      {children}
    </>
  );
}
