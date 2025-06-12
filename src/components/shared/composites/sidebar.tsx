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

const links = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: {
      active: "material-symbols:dashboard",
      inactive: "material-symbols:dashboard-outline",
    },
  },
  {
    label: "Buckets",
    to: "/buckets",
    icon: {
      active: "mdi:bucket",
      inactive: "mdi:bucket-outline",
    },
  },
  {
    label: "Goals",
    to: "/goals",
    icon: {
      active: "mage:goals-fill",
      inactive: "mage:goals",
    },
  },
  {
    label: "Distributions",
    to: "/distributions",
    icon: {
      active: "lsicon:integral-distribute-filled",
      inactive: "lsicon:integral-distribute-outline",
    },
  },
  {
    label: "Expenses",
    to: "/expenses",
    icon: {
      active: "si:money-fill",
      inactive: "si:money-line",
    },
  },
];

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
            {links.map((link) => (
              <SidebarMenuItem key={link.to}>
                <SidebarMenuButton asChild>
                  <Link to={link.to} activeProps={{ "data-active": true }}>
                    {({ isActive }) => (
                      <>
                        <Icon
                          icon={
                            isActive ? link.icon.active : link.icon.inactive
                          }
                        />
                        <span>{link.label}</span>
                      </>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
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
