// app/components/AuthWrapper.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState("checking");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      router.push("/admin");
    }

    // Public paths that don't require authentication
    const publicPaths = ["/", "/login", "/register", "/forgot-password"];
    
    // Admin paths that require admin authentication
    const adminPaths = ["/admin"];

    if (!authToken) {
      // If no token and trying to access protected route, redirect to login
      if (!publicPaths.some(path => pathname.startsWith(path))) {
        router.replace("/login");
      } else {
        setStatus("unauthenticated");
      }
    } else {
      // If has token and on public page, redirect to appropriate page
      if (pathname === "/login" || pathname === "/register") {
        // Check if user is admin and redirect accordingly
        const userData = localStorage.getItem("userData");
        if (userData) {
          try {
            const user = JSON.parse(userData);
            if (user.is_staff === true || user.role === "admin") {
              router.replace("/admin");
            } else {
              router.replace("/login");
            }
          } catch {
            router.replace("/login");
          }
        } else {
          router.replace("/login");
        }
      } else {
        setStatus("authenticated");
      }
    }
  }, [router, pathname]);

  // if (status === "checking") {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-[#0A2131]">
  //       <div className="text-white">Loading...</div>
  //     </div>
  //   );
  // }

  return <>{children}</>;
}