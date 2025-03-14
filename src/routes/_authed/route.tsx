import { Navbar } from "@/components/shared/navbar";
import { authStore } from "@/modules/authentication/stores";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = authStore.getState().user;
    if (user) return;

    const { error } = await authStore.getState().fetchUser();
    if (error) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
