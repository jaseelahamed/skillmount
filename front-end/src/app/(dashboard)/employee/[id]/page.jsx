"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeftIcon,
  MailIcon,
  PhoneIcon,
  Building2Icon,
  BriefcaseIcon,
  CalendarIcon,
  ShieldCheckIcon,
} from "lucide-react";

export default function EmployeeDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employeeDetails", id],
    queryFn: async () => {
      const response = await api.get(`/employees/${id}`);
      return response.data?.employee;
    },
    enabled: !!id,
  });

  const getInitials = (name) => {
    if (!name) return "EE";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground font-medium">Loading employee details...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4 border border-destructive/20">
          ⚠️
        </div>
        <h3 className="text-lg font-bold">Failed to load employee</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {error?.response?.data?.error || "The requested employee record could not be found."}
        </p>
        <Button
          onClick={() => router.push("/")}
          className="mt-6 border border-border bg-card text-card-foreground hover:bg-muted"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="">
 
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="border-border bg-card text-muted-foreground hover:bg-muted transition-all"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-card border border-border text-muted-foreground capitalize">
          Profile Details
        </span>
      </div>


      <Card className="bg-card border-border text-card-foreground shadow-2xl overflow-hidden">

        <div className="h-32 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 relative">
      
          <div className="absolute -bottom-16 left-8 md:left-12 flex aspect-square size-28 items-center justify-center rounded-full bg-background border-4 border-card text-foreground font-extrabold text-3xl shadow-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-500">
            {getInitials(data.name)}
          </div>
        </div>

        <CardContent className="pt-20 pb-8 px-8 md:px-12 space-y-8">
          {/* Header Info */}
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{data.name}</h2>
            <p className="text-muted-foreground font-medium mt-1">@{data.username}</p>
          </div>

          <hr className="border-border" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <MailIcon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-medium text-foreground">{data.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <PhoneIcon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mobile Number</p>
                <p className="text-sm font-medium text-foreground">{data.mobile}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Building2Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</p>
                <p className="text-sm font-medium text-foreground">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {data.department}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <BriefcaseIcon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Designation / Role</p>
                <p className="text-sm font-medium text-foreground">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 capitalize">
                    {data.role}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <ShieldCheckIcon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Privilege</p>
                <p className="text-sm font-medium text-foreground capitalize">{data.role === "admin" ? "Administrator" : "Standard Employee"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined Date</p>
                <p className="text-sm font-medium text-foreground">{formatDate(data.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
