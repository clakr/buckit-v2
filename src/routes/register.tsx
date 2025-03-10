import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RegisterTemplate,
});

export default function RegisterTemplate() {
  return <div>register</div>;
}
