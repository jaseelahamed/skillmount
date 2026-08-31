"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LockIcon, UserIcon, ArrowRightIcon, ShieldAlertIcon } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      router.replace("/");
    }
  }, [router]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:3000/api/auth/login", values);
        if (response.data?.success) {
          const { accessToken, refreshToken, role, user } = response.data;
          
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("role", role);
          localStorage.setItem("user", JSON.stringify(user));

          toast.success(response.data.message || "Logged in successfully!");
          router.replace("/");
        } else {
          toast.error("Failed to authenticate");
        }
      } catch (error) {
        const errMsg = error.response?.data?.error || "Invalid username or password";
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-[80px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-[80px] animate-pulse delay-700"></div>

      <div className="w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400 mb-4">
            <ShieldAlertIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Log in to manage your Employee Dashboard
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                className={`w-full pl-10 pr-4 py-3 bg-slate-950 border ${
                  formik.touched.username && formik.errors.username
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-800 focus:border-purple-500"
                } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all`}
                {...formik.getFieldProps("username")}
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-400 text-xs mt-1.5 ml-1">{formik.errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 bg-slate-950 border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-800 focus:border-purple-500"
                } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all`}
                {...formik.getFieldProps("password")}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-xs mt-1.5 ml-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 active:scale-[0.98] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
