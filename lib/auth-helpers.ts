import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  // Mock user data for demo
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    memberships: session.user.memberships || [],
  };
}

export async function getCurrentOrg(organizationId?: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const membership = user.memberships.find(
    (m: any) => m.organizationId === organizationId || m.organizationId === user.memberships[0]?.organizationId
  );

  if (!membership) return null;

  // Mock org data for demo
  const org = {
    id: membership.organizationId,
    name: membership.organization.name,
    wallet: {
      id: "demo-wallet",
      organizationId: membership.organizationId,
      balanceCents: 150000, // $1,500
      currency: "USD",
      lowBalanceThresholdCents: 5000,
    },
    memberships: [membership],
  };

  return { org, membership };
}

export function hasRole(user: any, role: string, organizationId?: string) {
  if (!user?.memberships) return false;
  
  const membership = user.memberships.find(
    (m: any) => m.organizationId === organizationId || m.organizationId === user.memberships[0]?.organizationId
  );
  
  if (!membership) return false;
  
  const roleHierarchy = {
    OWNER: 5,
    BILLING_ADMIN: 4,
    AD_MANAGER: 3,
    ANALYST: 2,
    PUBLISHER_ADMIN: 1,
  };
  
  return roleHierarchy[membership.role as keyof typeof roleHierarchy] >= 
         roleHierarchy[role as keyof typeof roleHierarchy];
}

export function isAdvertiser(user: any, organizationId?: string) {
  return hasRole(user, "AD_MANAGER", organizationId) || hasRole(user, "OWNER", organizationId);
}

export function isPublisher(user: any, organizationId?: string) {
  return hasRole(user, "PUBLISHER_ADMIN", organizationId) || hasRole(user, "OWNER", organizationId);
}
