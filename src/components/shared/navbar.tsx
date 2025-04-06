import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/modules/authentication/stores";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "@tanstack/react-router";

export function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await useAuthStore.getState().logout();

    navigate({
      to: "/",
      replace: true,
    });
  }

  return (
    <nav className="border-b py-2">
      <div className="mx-auto flex max-w-5xl justify-between px-4">
        <section className="flex items-center gap-x-4">
          <Button variant="link" className="px-0" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="link" className="px-0" asChild>
            <Link to="/buckets">Buckets</Link>
          </Button>
          <Button variant="link" className="px-0" asChild>
            <Link to="/goals">Goals</Link>
          </Button>
        </section>
        <section>
          <Button variant="ghost" onClick={handleLogout}>
            <Icon icon="bx:exit" />
            Logout
          </Button>
        </section>
      </div>
    </nav>
  );
}
