import {
  Sidebar as UISidebar,
  SidebarContent as UISidebarContent,
  SidebarFooter as UISidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/modules/authentication/stores";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "@tanstack/react-router";

export function Sidebar() {
  return (
    <UISidebar>
      <SidebarContent />
      <SidebarFooter />
      <SidebarRail />
    </UISidebar>
  );
}

function SidebarContent() {
  return (
    <UISidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/dashboard" activeProps={{ "data-active": true }}>
                  {({ isActive }) => (
                    <>
                      <Icon
                        icon={
                          isActive
                            ? "material-symbols:dashboard"
                            : "material-symbols:dashboard-outline"
                        }
                      />
                      <span>Dashboard</span>
                    </>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/buckets" activeProps={{ "data-active": true }}>
                  {({ isActive }) => (
                    <>
                      <Icon
                        icon={isActive ? "mdi:bucket" : "mdi:bucket-outline"}
                      />
                      <span>Buckets</span>
                    </>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/goals" activeProps={{ "data-active": true }}>
                  {({ isActive }) => (
                    <>
                      <Icon
                        icon={isActive ? "mage:goals-fill" : "mage:goals"}
                      />
                      <span>Goals</span>
                    </>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/distributions" activeProps={{ "data-active": true }}>
                  {({ isActive }) => (
                    <>
                      <Icon
                        icon={
                          isActive
                            ? "lsicon:integral-distribute-filled"
                            : "lsicon:integral-distribute-outline"
                        }
                      />
                      <span>Distributions</span>
                    </>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </UISidebarContent>
  );
}

function SidebarFooter() {
  const navigate = useNavigate();

  async function handleLogout() {
    await useAuthStore.getState().logout();

    navigate({
      to: "/",
      replace: true,
    });
  }

  return (
    <UISidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleLogout}>
            <Icon icon="bx:exit" />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </UISidebarFooter>
  );
}
