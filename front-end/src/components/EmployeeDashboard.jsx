import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MailIcon, PhoneIcon, BriefcaseIcon, BuildingIcon, CalendarIcon, UserIcon } from "lucide-react";

export default function EmployeeDashboard({ employee }) {
  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
        No profile details found.
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase() || "EE";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-border text-foreground shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full filter blur-xl"></div>
        <CardContent className="pt-8 pb-8 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-20 w-20 border-2 border-purple-500 bg-background text-foreground flex items-center justify-center text-xl font-bold">
            <AvatarFallback className="bg-background text-purple-600 dark:text-purple-400">{getInitials(employee.name)}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Welcome back, {employee.name}!</h2>
            <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">{employee.role} • {employee.department}</p>
            <p className="text-muted-foreground text-xs mt-1">Logged in to your employee portal</p>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-card border-border text-card-foreground shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">My Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border">
                <UserIcon className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Username</div>
                  <div className="text-sm font-semibold text-foreground">{employee.username}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border">
                <MailIcon className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Email Address</div>
                  <div className="text-sm font-semibold text-foreground truncate max-w-[200px]">
                    {employee.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border">
                <PhoneIcon className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Mobile Phone</div>
                  <div className="text-sm font-semibold text-foreground">{employee.mobile}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border">
                <BuildingIcon className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Department</div>
                  <div className="text-sm font-semibold text-foreground">{employee.department}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border">
                <BriefcaseIcon className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Designation</div>
                  <div className="text-sm font-semibold text-foreground">{employee.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border">
                <CalendarIcon className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Joined Date</div>
                  <div className="text-sm font-semibold text-foreground">
                    {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info Sidebar */}
        <Card className="bg-card border-border text-card-foreground shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Role</span>
                <span className="font-semibold text-purple-500">Employee</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Authentication</span>
                <span className="font-semibold text-green-500">JWT Verified</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Database Status</span>
                <span className="font-semibold text-green-500">Connected</span>
              </div>
            </div>
            <div className="p-3 bg-background rounded-xl border border-border text-xs text-muted-foreground">
              Your profile is managed by the system administrator. To request updates, please contact IT support.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
