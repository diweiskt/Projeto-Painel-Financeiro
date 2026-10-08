"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      const isPublicRoute = pathname === "/login" || pathname === "/register";

      if (!user && !isPublicRoute) {
        setAuthorized(false);
        router.replace("/login");
      } else if (user && isPublicRoute) {

        setAuthorized(true);
        router.replace("/dashboard");
      } else {
        setAuthorized(true);
      }

      setLoading(false);
    };

    checkUser();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground animate-pulse">A carregar...</p>
      </div>
    );
  }

  if (!authorized && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}