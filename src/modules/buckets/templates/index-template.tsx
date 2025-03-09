import Main from "@/components/shared/main";
import { Button } from "@/components/ui/button";
import { bucketsQueryOptions } from "@/modules/buckets/query-options";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

export default function BucketsTemplate() {
  const { data } = useSuspenseQuery(bucketsQueryOptions);

  return (
    <Main className="grid">
      <section className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Buckets</h1>
        <Button className="justify-self-end" asChild>
          <Link to="/buckets/create">Create Bucket</Link>
        </Button>
      </section>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Main>
  );
}
