"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/app/top-bar";
import { Sidebar } from "@/components/app/sidebar";
import { RoleProvider, useRole } from "@/contexts/RoleContext";
import { mustBeVerified } from "@/lib/guards-client";

// Disable SSG for authenticated app routes
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function AppContent({ children }: { children: React.ReactNode }) {
  const { currentRole } = useRole();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40">
      <TopBar />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar role={currentRole} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/signin");
  }

  // Check if user needs email verification based on feature flag
  if (session.user && !mustBeVerified(session.user.emailVerified)) {
    redirect("/auth/verify-email");
  }

  return (
    <RoleProvider>
      <AppContent>{children}</AppContent>
    </RoleProvider>
  );
}
