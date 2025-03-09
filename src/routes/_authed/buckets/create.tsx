import CreateBucketTemplate from "@/modules/buckets/templates/create-buckets-template";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/buckets/create")({
  component: CreateBucketTemplate,
});
