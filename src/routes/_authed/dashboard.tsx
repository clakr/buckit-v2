import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard")({
  component: DashboardTemplate,
});

export default function DashboardTemplate() {
  return <div>dashboard</div>;
}
