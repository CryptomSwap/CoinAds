import { REQUIRE_EMAIL_VERIFICATION } from "@/lib/featureFlags";

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
