"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import AdminDashboard from "@/components/AdminDashboard";
import EmployeeDashboard from "@/components/EmployeeDashboard";

export default function DashboardIndexPage() {
  const [role, setRole] = React.useState("employee");
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
    setRole(localStorage.getItem("role") || "employee");
  }, []);

  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: ["employeeData"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data;
    },
  });

  const activeRole = data?.role || role;

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground font-medium">Loading dashboard data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4 border border-destructive/20">
          ⚠️
        </div>
        <h3 className="text-lg font-bold">Connection Error</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {error?.response?.data?.error || "Unable to fetch data from the server. Please check if backend is running."}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-6 px-4 py-2 bg-card border border-border hover:bg-muted text-card-foreground rounded-lg text-sm font-semibold transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (activeRole === "admin") {
    return <AdminDashboard employees={data?.employees || []} refetch={refetch} />;
  }

  return <EmployeeDashboard employee={data?.employees?.[0]} />;
}
