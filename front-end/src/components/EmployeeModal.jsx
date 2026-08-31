import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export function EmployeeModal({ open, setOpen, refetch, initialData }) {
  const isEditMode = !!initialData;

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      password: "",
      email: "",
      department: "",
      role: "",
      mobile: "",
      salary: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .test("password-required", "Password is required", function (value) {
          if (!isEditMode && !value) {
            return false;
          }
          return true;
        }),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      department: Yup.string().required("Department is required"),
      role: Yup.string().required("Role/Designation is required"),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile must be exactly 10 digits")
        .required("Mobile is required"),
      salary: Yup.number()
        .typeError("Salary must be a number")
        .positive("Salary must be a positive number")
        .required("Salary is required"),
    }),
    onSubmit: (values) => {
      // If editing, exclude password if it was left empty
      const payload = { ...values };
      if (isEditMode && !payload.password) {
        delete payload.password;
      }
      mutation.mutate(payload);
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditMode) {
        const response = await api.put(`/employees/${initialData._id}`, payload);
        return response.data;
      } else {
        const response = await api.post("/employees", payload);
        return response.data;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || (isEditMode ? "Employee updated successfully!" : "Employee added successfully!"));
      setOpen(false);
      refetch();
      formik.resetForm();
    },
    onError: (error) => {
      const errMsg = error.response?.data?.error || "Failed to process request";
      toast.error(errMsg);
    },
  });

  React.useEffect(() => {
    if (open) {
      if (initialData) {
        formik.setValues({
          name: initialData.name || "",
          username: initialData.username || "",
          password: "",
          email: initialData.email || "",
          department: initialData.department || "",
          role: initialData.role || "",
          mobile: initialData.mobile || "",
          salary: initialData.salary || "",
        });
      } else {
        formik.resetForm();
      }
    }
  }, [open, initialData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[475px] bg-card border border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{isEditMode ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditMode ? "Modify the employee details below." : "Fill in the details below to register a new employee."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-muted-foreground">Name</Label>
              <Input
                id="name"
                name="name"
                className="bg-background border-border text-foreground focus-visible:ring-primary"
                placeholder="John Doe"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="username" className="text-muted-foreground">Username</Label>
              <Input
                id="username"
                name="username"
                className="bg-background border-border text-foreground focus-visible:ring-primary"
                placeholder="johndoe"
                {...formik.getFieldProps("username")}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-xs">{formik.errors.username}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="password" className="text-muted-foreground">
                Password {isEditMode && <span className="text-xs text-muted-foreground">(leave blank to keep current)</span>}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                className="bg-background border-border text-foreground focus-visible:ring-primary"
                placeholder={isEditMode ? "••••••" : "Required"}
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs">{formik.errors.password}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-muted-foreground">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                className="bg-background border-border text-foreground focus-visible:ring-primary"
                placeholder="john@example.com"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs">{formik.errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="department" className="text-muted-foreground">Department</Label>
              <Input
                id="department"
                name="department"
                className="bg-background border-border text-foreground focus-visible:ring-primary"
                placeholder="Engineering"
                {...formik.getFieldProps("department")}
              />
              {formik.touched.department && formik.errors.department && (
                <p className="text-red-500 text-xs">{formik.errors.department}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="role" className="text-muted-foreground">Role</Label>
              <Input
                id="role"
                name="role"
                className="bg-background border-border text-foreground focus-visible:ring-primary"
                placeholder="Developer"
                {...formik.getFieldProps("role")}
              />
              {formik.touched.role && formik.errors.role && (
                <p className="text-red-500 text-xs">{formik.errors.role}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="mobile" className="text-muted-foreground">Mobile</Label>
              <Input
                id="mobile"
                name="mobile"
                type="number"
                className="bg-background border-border text-foreground focus-visible:ring-primary"
                placeholder="1234567890"
                {...formik.getFieldProps("mobile")}
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <p className="text-red-500 text-xs">{formik.errors.mobile}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="salary" className="text-muted-foreground">Salary</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                className="bg-background border-border text-foreground focus-visible:ring-primary"
                placeholder="50000"
                {...formik.getFieldProps("salary")}
              />
              {formik.touched.salary && formik.errors.salary && (
                <p className="text-red-500 text-xs">{formik.errors.salary}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-border text-muted-foreground hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-none"
            >
              {mutation.isPending ? "Saving..." : isEditMode ? "Save Changes" : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}