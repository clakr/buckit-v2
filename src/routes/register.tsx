import RegisterTemplate from "@/modules/authentication/templates/register-template";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RegisterTemplate,
});
