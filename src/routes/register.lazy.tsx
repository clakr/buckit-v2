import RegisterTemplate from "@/modules/authentication/templates/register-template";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/register")({
  component: RegisterTemplate,
});
