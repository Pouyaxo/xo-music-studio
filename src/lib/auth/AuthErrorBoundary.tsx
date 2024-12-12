// src/components/auth/auth-error-boundary.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Changed from 'next/router'
import { supabase } from "@/lib/supabase/supabaseClient";
import { toast } from "sonner";

export function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        // Clear any app state/cache if needed
        localStorage.removeItem("app-data-cache");

        // Show a notification
        toast.error(
          event === "SIGNED_OUT"
            ? "You have been signed out"
            : "Your account has been deleted"
        );

        // Redirect to login
        router.push("/login");
      }

      if (event === "TOKEN_REFRESHED") {
        // Optionally handle token refresh
        console.log("Auth token refreshed");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return <>{children}</>;
}
