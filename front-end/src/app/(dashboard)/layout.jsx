"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = React.useState("dark");
  const [role, setRole] = React.useState("employee");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    }
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);
    setRole(localStorage.getItem("role") || "employee");
  }, [router]);

  React.useEffect(() => {
    if (!mounted) return;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);


  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen bg-background text-foreground font-sans">
        <AppSidebar />
        <SidebarInset className="bg-background flex flex-col flex-1 border-l border-border">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Employee Management System
            </h1>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 border-border bg-card text-card-foreground"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <SunIcon className="h-4 w-4 text-amber-500" /> : <MoonIcon className="h-4 w-4 text-indigo-500" />}
              </Button>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-card border border-border text-muted-foreground capitalize">
                {role} Mode
              </span>
            </div>
          </header>


          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
