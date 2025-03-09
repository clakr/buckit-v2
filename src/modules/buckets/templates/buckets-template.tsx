import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function BucketsTemplate() {
  const { data } = useSuspenseQuery(bucketsQueryOptions);

  return (
    <main>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
