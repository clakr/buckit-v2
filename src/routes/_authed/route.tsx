import { Navbar } from "@/components/shared/navbar";
import { useAuthStore } from "@/modules/authentication/stores";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = useAuthStore.getState().user;

    if (!user) {
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
