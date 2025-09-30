/**
 * URL utility helpers for split-domain deployment
 * Provides consistent URL generation for marketing and app domains
 * Preview-safe: returns relative paths in preview/dev mode
 */

import { PUBLIC_BASE_URL, APP_BASE_URL, IS_PROD, USE_APP_SUBDOMAIN } from "@/config/domain";

/**
 * Generate public URL for marketing pages
 * @param path - Path to append (e.g., "/about", "contact")
 * @returns Full URL for marketing domain in prod, relative path in preview
 */
export function publicUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // In preview/dev mode, return relative paths
  if (!IS_PROD || !USE_APP_SUBDOMAIN) {
    return cleanPath;
  }
  return `${PUBLIC_BASE_URL}${cleanPath}`;
}

/**
 * Generate app URL for dashboard/authenticated pages
 * @param path - Path to append (e.g., "/auth/signin", "advertiser/overview")
 * @returns Full URL for app subdomain in prod, relative path in preview
 */
export function appUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // In preview/dev mode, return relative paths
  if (!IS_PROD || !USE_APP_SUBDOMAIN) {
    return cleanPath;
  }
  return `${APP_BASE_URL}${cleanPath}`;
}

/**
 * Generate sign-in URL with optional redirect
 * @param redirectTo - Optional redirect path after sign-in
 * @returns Sign-in URL (relative in preview, absolute in prod)
 */
export function signInUrl(redirectTo?: string): string {
  const baseUrl = appUrl("/auth/signin");
  if (redirectTo) {
    const encodedRedirect = encodeURIComponent(redirectTo);
    return `${baseUrl}?redirect=${encodedRedirect}`;
  }
  return baseUrl;
}

/**
 * Generate sign-up URL with role
 * @param role - User role (advertiser, publisher)
 * @returns Sign-up URL with role parameter (relative in preview, absolute in prod)
 */
export function signUpUrl(role: "advertiser" | "publisher"): string {
  return appUrl(`/auth/signup?role=${role}`);
}

/**
 * Generate dashboard URL for specific role
 * @param role - User role (advertiser, publisher, admin)
 * @returns Dashboard URL (relative in preview, absolute in prod)
 */
export function dashboardUrl(role: "advertiser" | "publisher" | "admin"): string {
  return appUrl(`/${role}/overview`);
}

/**
 * Check if current URL is on app subdomain
 * @param url - URL to check (defaults to window.location.href)
 * @returns True if URL is on app subdomain
 */
export function isAppDomain(url?: string): boolean {
  if (typeof window === "undefined") return false;
  
  const currentUrl = url || window.location.href;
  try {
    const urlObj = new URL(currentUrl);
    return urlObj.hostname === "app.coinads.com" || urlObj.hostname === "localhost";
  } catch {
    return false;
  }
}

/**
 * Check if current URL is on marketing domain
 * @param url - URL to check (defaults to window.location.href)
 * @returns True if URL is on marketing domain
 */
export function isMarketingDomain(url?: string): boolean {
  if (typeof window === "undefined") return false;
  
  const currentUrl = url || window.location.href;
  try {
    const urlObj = new URL(currentUrl);
    return urlObj.hostname === "coinads.com" || urlObj.hostname === "www.coinads.com";
  } catch {
    return false;
  }
}

/**
 * Get the appropriate base URL for the current context
 * @returns Base URL (marketing or app)
 */
export function getCurrentBaseUrl(): string {
  if (typeof window === "undefined") return PUBLIC_BASE_URL;
  
  if (isAppDomain()) {
    return APP_BASE_URL;
  }
  
  return PUBLIC_BASE_URL;
}

/**
 * Generate relative URL that works on both domains
 * @param path - Path to append
 * @returns Relative URL
 */
export function relativeUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return cleanPath;
}

// Export commonly used URLs as constants
export const URLS = {
  // Marketing URLs
  HOME: publicUrl("/"),
  ABOUT: publicUrl("/about"),
  ADVERTISERS: publicUrl("/advertisers"),
  PUBLISHERS: publicUrl("/publishers"),
  CONTACT: publicUrl("/contact"),
  DOCS: publicUrl("/docs"),
  
  // Auth URLs
  SIGN_IN: appUrl("/auth/signin"),
  SIGN_UP_ADVERTISER: signUpUrl("advertiser"),
  SIGN_UP_PUBLISHER: signUpUrl("publisher"),
  
  // Dashboard URLs
  ADVERTISER_DASHBOARD: dashboardUrl("advertiser"),
  PUBLISHER_DASHBOARD: dashboardUrl("publisher"),
  ADMIN_DASHBOARD: dashboardUrl("admin"),
  
  // Legal URLs
  PRIVACY: publicUrl("/legal/privacy"),
  TERMS: publicUrl("/legal/terms"),
  COOKIES: publicUrl("/legal/cookies"),
} as const;
