import { StateSection } from "@/components/shared/sections/state-section";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatToCurrency } from "@/lib/utils";
import { goalTransactionsQueryOptions } from "@/modules/goals/query-options";
import { useGoalDropdownMenuStore } from "@/modules/goals/stores";
import { Icon } from "@iconify/react";
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Current Balance</TableHead>
            <TableHead className="text-right">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <div className="grid place-items-center">
                  {transaction.type === "inbound" ? (
                    <Icon
                      icon="bx:plus-circle"
                      className="size-5 text-green-600"
                    />
                  ) : (
                    <Icon
                      icon="bx:minus-circle"
                      className="size-5 text-red-600"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell
                className={cn(
                  transaction.type === "inbound"
                    ? "text-green-600"
                    : "text-red-600",
                )}
              >
                {formatToCurrency(transaction.amount)}
              </TableCell>
              <TableCell>
                {formatToCurrency(transaction.current_balance)}
              </TableCell>
              <TableCell className="text-right whitespace-normal">
                {transaction.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
