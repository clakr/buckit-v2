import DashboardTemplate from "@/modules/dashboard/templates/dashboard-template";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DashboardTemplate,
});
