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
import { bucketTransactionsQueryOptions } from "@/modules/buckets/query-options";
import EmptyBucketTransactionsSection from "@/modules/buckets/sections/empty-bucket-transactions-section";
import { useBucketDropdownMenuStore } from "@/modules/buckets/stores";
import { Icon } from "@iconify/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";

export default function ViewBucketTransactionsDialog() {
  const { bucketId } = useBucketDropdownMenuStore(
    useShallow((state) => ({ bucketId: state.bucketId })),
  );

  const { data: transactions } = useSuspenseQuery(
    bucketTransactionsQueryOptions(bucketId),
  );

  const isEmpty = transactions.length === 0;

  return (
    <>
      <DialogHeader>
        <DialogTitle>View Bucket Transactions</DialogTitle>
        <DialogDescription>
          These are all the transactions for this bucket.
        </DialogDescription>
      </DialogHeader>
      {isEmpty ? (
        <EmptyBucketTransactionsSection />
      ) : (
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
      )}
    </>
  );
}
