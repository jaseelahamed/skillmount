"use client";
import React from "react";
import { LayoutDashboardIcon, LogOutIcon, ShieldAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AppSidebar({ ...props }) {
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const [role, setRole] = React.useState("employee");
  const [logoutConfirmOpen, setLogoutConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("role");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedRole) {
        setRole(storedRole);
      }
    } catch (e) {
      console.error("Failed to parse user", e);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Backend logout failed", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      
      toast.success("Logged out successfully");
      router.replace("/login");
    }
  };

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboardIcon,
      isActive: true,
    },
  ];

  return (
    <>
      <Sidebar collapsible="icon" className="border-border bg-card text-card-foreground" {...props}>
        <SidebarHeader className="border-b border-border py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center gap-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                    <ShieldAlertIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold text-card-foreground tracking-wide">EMS Portal</span>
                    <span className="truncate text-xs text-muted-foreground capitalize">{role} Dashboard</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="py-4">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} isActive={item.isActive} className="text-muted-foreground hover:text-foreground hover:bg-muted">
                  {item.icon && <item.icon className="w-5 h-5 mr-2 text-purple-500" />}
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-border py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-background border border-border">
                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-500 font-bold text-xs uppercase">
                  {user?.name ? user.name.slice(0, 2) : "EE"}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-semibold text-card-foreground">{user?.name || "Employee"}</span>
                  <span className="truncate text-xs text-muted-foreground">@{user?.username || "username"}</span>
                </div>
              </div>
            </SidebarMenuItem>

            <SidebarMenuItem className="mt-2">
              <SidebarMenuButton
                onClick={() => setLogoutConfirmOpen(true)}
                className="w-full text-red-500 hover:text-red-400 hover:bg-destructive/10 cursor-pointer"
              >
                <LogOutIcon className="w-4 h-4 mr-2" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Logout Confirmation Modal */}
      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent className="sm:max-w-[400px] bg-card border border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Sign Out
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to log out of your session?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setLogoutConfirmOpen(false)}
              className="border-border text-muted-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
