"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";

type Role = "advertiser" | "publisher" | "admin";

interface RoleContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [currentRole, setCurrentRole] = useState<Role>("advertiser");

  useEffect(() => {
    if (session?.user?.role) {
      const userRole = session.user.role.toLowerCase() as Role;
      setCurrentRole(userRole);
    }
  }, [session]);

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
