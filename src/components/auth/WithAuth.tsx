import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { User } from "@supabase/supabase-js";

export function withAuth<P extends { user: User }>(
  Component: React.ComponentType<P>
) {
  return function ProtectedRoute(props: Omit<P, "user">) {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const initialized = useAuthStore((state) => state.initialized);
    const refreshSession = useAuthStore((state) => state.refreshSession);

    useEffect(() => {
      if (initialized && !user) {
        router.replace("/login");
      }
    }, [initialized, user, router]);

    // More frequent session refresh
    useEffect(() => {
      if (!user) return;

      // Initial refresh
      refreshSession();

      const refreshInterval = setInterval(() => {
        refreshSession();
      }, 45000); // Refresh every 45 seconds to stay ahead of token expiration

      return () => clearInterval(refreshInterval);
    }, [user, refreshSession]);

    // Show nothing while checking auth
    if (!initialized || !user) {
      return null;
    }

    // Show component if authenticated
    return <Component {...(props as P)} user={user} />;
  };
}
