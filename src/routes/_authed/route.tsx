import { Sidebar } from "@/components/shared/composites/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/modules/authentication/stores";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

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
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <header className="flex items-center gap-x-4 border-b px-6 py-4">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <Breadcrumbs />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

function Breadcrumbs() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const segments = pathname.split("/").filter(Boolean);

  function buildBreadcrumbPath(index: number) {
    const segmentsWithoutCurrentPage = segments.slice(0, index + 1);
    return "/" + segmentsWithoutCurrentPage.join("/");
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <Fragment key={segment}>
            <BreadcrumbItem className="capitalize">
              {index !== segments.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link to={buildBreadcrumbPath(index)}>{segment}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{segment}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index !== segments.length - 1 ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
