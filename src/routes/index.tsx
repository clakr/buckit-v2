import LoginTemplate from "@/modules/authentication/templates/login-template";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LoginTemplate,
});
