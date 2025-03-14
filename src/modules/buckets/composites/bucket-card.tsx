import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatToCurrency } from "@/lib/utils";
import { BucketActionsDropdownMenu } from "@/modules/buckets/composites/bucket-actions-dropdown-menu";
import { Bucket } from "@/supabase/types";

type Props = { bucket: Bucket };

export function BucketCard({ bucket }: Props) {
  return (
    <Card key={bucket.id} className="justify-between">
      <CardHeader className="grid grid-cols-[1fr_max-content]">
        <div>
          <CardTitle className="uppercase">{bucket.name}</CardTitle>
          <CardDescription>{bucket.description}</CardDescription>
        </div>
        <BucketActionsDropdownMenu bucketId={bucket.id} />
      </CardHeader>
      <CardFooter className="self-end font-bold">
        {formatToCurrency(bucket.current_amount)}
      </CardFooter>
    </Card>
  );
}
