import React from "react";
import { Toaster } from "sonner";
import Providers from "./providers";
import "../index.css";

export const metadata = {
  title: "Employee Management System",
  description: "Manage your employees efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
