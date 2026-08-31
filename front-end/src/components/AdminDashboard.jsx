"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Trash2Icon,
  PencilIcon,
  UserPlusIcon,
  SearchIcon,
  UsersIcon,
  Building2Icon,
  BriefcaseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmployeeModal } from "./EmployeeModal";

export default function AdminDashboard({ employees = [], refetch }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editEmployee, setEditEmployee] = React.useState(null);
  const [globalFilter, setGlobalFilter] = React.useState("");


  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [employeeToDelete, setEmployeeToDelete] = React.useState(null);


  const totalEmployees = employees.length;
  const uniqueDepartments = new Set(employees.map((emp) => emp.department)).size;
  const uniqueRoles = new Set(employees.map((emp) => emp.role)).size;

  
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Employee deleted successfully");
      setDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
      refetch();
    },
    onError: (error) => {
      const errMsg = error.response?.data?.error || "Failed to delete employee";
      toast.error(errMsg);
    },
  });

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="font-semibold text-foreground">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => <div className="text-muted-foreground">{row.original.username}</div>,
      },
      {
        accessorKey: "email",
        header: "Email Address",
        cell: ({ row }) => <div className="text-foreground/80">{row.original.email}</div>,
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
          <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            {row.original.department}
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {row.original.role}
          </span>
        ),
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
        cell: ({ row }) => <div className="text-foreground/80">{row.original.mobile}</div>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/employee/${row.original._id}`)}
              className="h-8 w-8 p-0 border-border hover:bg-muted"
              title="View Details"
            >
              <EyeIcon className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditEmployee(row.original);
                setModalOpen(true);
              }}
              className="h-8 w-8 p-0 border-border hover:bg-muted"
              title="Edit Profile"
            >
              <PencilIcon className="h-4 w-4 text-purple-500" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setEmployeeToDelete(row.original);
                setDeleteConfirmOpen(true);
              }}
              className="h-8 w-8 p-0"
              title="Delete Employee"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [router]
  );

  const table = useReactTable({
    data: employees,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border text-card-foreground shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <UsersIcon className="h-16 w-16 text-purple-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">Active team members</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-card-foreground shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Building2Icon className="h-16 w-16 text-blue-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{uniqueDepartments}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique departments</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-card-foreground shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BriefcaseIcon className="h-16 w-16 text-green-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{uniqueRoles}</div>
            <p className="text-xs text-muted-foreground mt-1">Job designations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card className="bg-card border-border text-card-foreground shadow-xl">
        <CardHeader className="pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Employee Directory</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Manage and view all registered employee records.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employee..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 bg-background border-border text-foreground w-full sm:w-[250px] focus-visible:ring-primary"
              />
            </div>
            <Button
              onClick={() => {
                setEditEmployee(null);
                setModalOpen(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-none"
            >
              <UserPlusIcon className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-border overflow-hidden bg-background">
            <Table>
              <TableHeader className="bg-card border-b border-border">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-card border-border">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-muted-foreground">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-card/50 border-border">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      No employees found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

        
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-border bg-background text-muted-foreground hover:bg-card"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-border bg-background text-muted-foreground hover:bg-card"
            >
              Next
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <EmployeeModal open={modalOpen} setOpen={setModalOpen} refetch={refetch} initialData={editEmployee} />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px] bg-card border border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              ⚠️ Delete Employee
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete <strong>{employeeToDelete?.name}</strong>? This action cannot be undone and will permanently remove their profile.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setEmployeeToDelete(null);
              }}
              className="border-border text-muted-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (employeeToDelete) {
                  deleteMutation.mutate(employeeToDelete._id);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
