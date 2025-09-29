/**
 * Feature flags for the CoinAds platform
 */

/**
 * Controls whether email verification is required for user access.
 * When false: Users can access the app even if their email is not verified.
 * When true: Users must verify their email before accessing protected routes.
 * 
 * Default: false (disabled for MVP until real email sender is connected)
 */
export const REQUIRE_EMAIL_VERIFICATION =
  process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION === "true";
