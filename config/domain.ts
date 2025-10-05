/**
 * Domain configuration for CoinAds platform
 * Supports both single domain and subdomain split strategies
 * Runtime-aware, preview-safe configuration
 */

const PROD_DOMAIN_ROOT = "coinads.com";

export const VERCEL_ENV = process.env.VERCEL_ENV || process.env.NODE_ENV; // "production" | "preview" | "development"
export const IS_PROD    = VERCEL_ENV === "production";
export const USE_APP_SUBDOMAIN =
  IS_PROD && process.env.NEXT_PUBLIC_APP_SUBDOMAIN === "true";

/**
 * Compute base URLs at runtime.
 * - In production + split: marketing=coinads.com, app=app.coinads.com
 * - In preview/dev: both use the current origin (no subdomain split)
 */
export function resolveBaseUrls(hostFromRequest?: string) {
  if (USE_APP_SUBDOMAIN) {
    return {
      PUBLIC_BASE_URL: `https://${PROD_DOMAIN_ROOT}`,
      APP_BASE_URL:    `https://app.${PROD_DOMAIN_ROOT}`,
    };
  }
  const host = hostFromRequest
    || process.env.VERCEL_URL
    || "localhost:3000";
  
  // Use HTTP for localhost in development, HTTPS otherwise
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") 
    ? "http" 
    : "https";
  const origin = host.startsWith("http") ? host : `${protocol}://${host}`;
  
  return {
    PUBLIC_BASE_URL: origin,
    APP_BASE_URL:    origin,
  };
}

/** Helpers for building links safely (relative by default) */
export function publicUrl(path = "") { return path || "/"; }
export function appUrl(path = "")   { return path || "/"; }

// Legacy exports for backward compatibility
export const DOMAIN_ROOT = PROD_DOMAIN_ROOT;
export const DOMAIN_APP = USE_APP_SUBDOMAIN ? `app.${PROD_DOMAIN_ROOT}` : PROD_DOMAIN_ROOT;

// Base URLs for different contexts (runtime resolved)
const baseUrls = resolveBaseUrls();
export const PUBLIC_BASE_URL = baseUrls.PUBLIC_BASE_URL;
export const APP_BASE_URL = baseUrls.APP_BASE_URL;

// Helper functions for URL generation
export function getAppUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${APP_BASE_URL}${cleanPath}`;
}

export function getPublicUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${PUBLIC_BASE_URL}${cleanPath}`;
}

// For marketing pages linking to dashboard
export function getDashboardUrl(path: string = ""): string {
  return getAppUrl(path);
}

// Cookie domain configuration
export function getCookieDomain(): string | undefined {
  // For split-domain: use app subdomain only (marketing pages don't need session cookies)
  if (USE_APP_SUBDOMAIN) {
    return undefined; // Let browser use app.coinads.com domain
  }
  // Default cookie domain (browser will use current domain)
  return undefined;
}

// CORS allowed origins
export function getAllowedOrigins(): string[] {
  const origins = [PUBLIC_BASE_URL];
  
  if (USE_APP_SUBDOMAIN) {
    origins.push(APP_BASE_URL);
  }
  
  // Add localhost for development
  if (process.env.NODE_ENV === "development") {
    origins.push("http://localhost:3000", "http://127.0.0.1:3000");
  }
  
  return origins;
}

// Validate NEXTAUTH_URL against domain configuration
export function validateNextAuthUrl(nextAuthUrl: string): boolean {
  try {
    const url = new URL(nextAuthUrl);
    
    // Must be HTTPS in production
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
      return false;
    }
    
    // Must match one of our configured domains
    const allowedHosts = [DOMAIN_ROOT];
    if (USE_APP_SUBDOMAIN) {
      allowedHosts.push(DOMAIN_APP);
    }
    
    return allowedHosts.includes(url.hostname);
  } catch {
    return false;
  }
}

// Log domain configuration in development
if (process.env.NODE_ENV === "development") {
  console.log("🌐 Domain Configuration:");
  console.log(`  Root Domain: ${DOMAIN_ROOT}`);
  console.log(`  App Domain: ${DOMAIN_APP}`);
  console.log(`  Subdomain Split: ${USE_APP_SUBDOMAIN ? "Enabled" : "Disabled"}`);
  console.log(`  Public URL: ${PUBLIC_BASE_URL}`);
  console.log(`  App URL: ${APP_BASE_URL}`);
  console.log(`  Cookie Domain: ${getCookieDomain() || "default"}`);
}
