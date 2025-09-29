import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { REQUIRE_EMAIL_VERIFICATION } from "@/lib/featureFlags";

/**
 * Server-side guard for RSC loaders/actions
 * Checks authentication and email verification based on feature flags
 */
export async function requireAuthedUser(opts: { redirectTo?: string } = {}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return { 
      ok: false as const, 
      reason: "unauthenticated" as const, 
      redirectTo: opts.redirectTo ?? "/auth/signin" 
    };
  }
  
  if (REQUIRE_EMAIL_VERIFICATION && !session.user.emailVerified) {
    return { 
      ok: false as const, 
      reason: "unverified" as const, 
      redirectTo: "/auth/verify-email" 
    };
  }
  
  return { ok: true as const, session };
}

/**
 * Client-side helper for components
 * Determines if user must be verified based on feature flags
 */
export function mustBeVerified(emailVerified?: boolean | null): boolean {
  return REQUIRE_EMAIL_VERIFICATION ? !!emailVerified : true;
}

/**
 * Check if email verification should be shown in UI
 * Only show verification prompts when the feature is enabled
 */
export function shouldShowEmailVerification(): boolean {
  return REQUIRE_EMAIL_VERIFICATION;
}
