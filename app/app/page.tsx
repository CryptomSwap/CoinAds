"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RequireAuth from "@/components/RequireAuth";

export default function AppPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    // Redirect based on user role
    if (session.user?.role === "ADVERTISER") {
      router.push("/app/advertiser/overview");
    } else if (session.user?.role === "PUBLISHER") {
      router.push("/app/publisher/overview");
    } else if (session.user?.role === "ADMIN") {
      router.push("/app/admin/overview");
    } else {
      // Default to advertiser if role is not set
      router.push("/app/advertiser/overview");
    }
  }, [session, status, router]);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    </RequireAuth>
  );
}
