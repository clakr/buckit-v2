import { authStore } from "@/modules/authentication/stores";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RegisterTemplate,
  beforeLoad: async () => {
    await authStore.getState().fetchUser();

    const user = authStore.getState().user;
    if (user) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

export default function RegisterTemplate() {
  return <div>register</div>;
}
