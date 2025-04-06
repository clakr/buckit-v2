import { useAuthStore } from "@/modules/authentication/stores";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest")({
  beforeLoad: async () => {
    const user = useAuthStore.getState().user;

    if (user) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});
