/**
 * Content Security Policy configuration for CoinAds platform
 * Provides different CSP policies for development and production
 */

import { isDevelopment } from "@/lib/env/server";

// Base CSP directives
const baseDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "'unsafe-eval'", // Required for Next.js development
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind CSS
    "https://fonts.googleapis.com",
  ],
  'font-src': [
    "'self'",
    "data:",
    "https://fonts.gstatic.com",
  ],
  'img-src': [
    "'self'",
    "data:",
    "https:",
    "blob:",
  ],
  'connect-src': [
    "'self'",
    "https://api.coinads.com",
    "https://*.coinads.com",
    "https://vitals.vercel-insights.com", // Vercel Analytics
  ],
  'frame-src': [
    "'self'",
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

// Development-specific additions
const devDirectives = {
  'script-src': [
    ...baseDirectives['script-src'],
    "'unsafe-eval'", // Webpack HMR
  ],
  'connect-src': [
    ...baseDirectives['connect-src'],
    "ws://localhost:*", // WebSocket for HMR
    "http://localhost:*",
  ],
};

// Production-specific additions
const prodDirectives = {
  'script-src': [
    ...baseDirectives['script-src'].filter(src => src !== "'unsafe-eval'"),
    "https://vercel-insights.com",
    "https://*.vercel-insights.com",
    "https://vercel.live", // Vercel live feedback
    "https://*.vercel.live", // Vercel live feedback subdomains
  ],
  'connect-src': [
    ...baseDirectives['connect-src'],
    "https://*.neon.tech", // Database connections
    "https://api.stripe.com", // Stripe API
    "https://js.stripe.com", // Stripe JS
    "https://vercel.live", // Vercel live feedback
    "https://*.vercel.live", // Vercel live feedback subdomains
  ],
};

// External services that might be added
const externalServices = {
  // Google Analytics
  googleAnalytics: {
    'script-src': ["https://www.googletagmanager.com", "https://www.google-analytics.com"],
    'connect-src': ["https://www.google-analytics.com", "https://analytics.google.com"],
    'img-src': ["https://www.google-analytics.com"],
  },
  // Sentry
  sentry: {
    'script-src': ["https://browser.sentry-cdn.com"],
    'connect-src': ["https://sentry.io", "https://*.sentry.io"],
    'img-src': ["https://*.sentry.io"],
  },
  // Stripe
  stripe: {
    'script-src': ["https://js.stripe.com"],
    'connect-src': ["https://api.stripe.com"],
    'frame-src': ["https://js.stripe.com", "https://hooks.stripe.com"],
  },
  // Chat widgets
  chat: {
    'script-src': ["https://widget.crisp.chat", "https://embed.tawk.to"],
    'connect-src': ["https://client.crisp.chat", "https://embed.tawk.to"],
    'frame-src': ["https://widget.crisp.chat", "https://embed.tawk.to"],
  },
};

/**
 * Generate CSP header value based on environment and enabled services
 */
export function generateCSP(enabledServices: string[] = []): string {
  const directives = isDevelopment ? devDirectives : prodDirectives;
  
  // Add external service directives
  enabledServices.forEach(service => {
    const serviceDirectives = externalServices[service as keyof typeof externalServices];
    if (serviceDirectives) {
      Object.entries(serviceDirectives).forEach(([directive, sources]) => {
        if (directives[directive as keyof typeof directives]) {
          directives[directive as keyof typeof directives] = [
            ...directives[directive as keyof typeof directives],
            ...sources,
          ];
        }
      });
    }
  });

  // Convert to CSP string
  return Object.entries(directives)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
}

/**
 * Get default CSP for the application
 */
export function getDefaultCSP(): string {
  const enabledServices: string[] = [];
  
  // Add services based on environment variables
  if (process.env.GOOGLE_ANALYTICS_ID) {
    enabledServices.push('googleAnalytics');
  }
  
  if (process.env.SENTRY_DSN) {
    enabledServices.push('sentry');
  }
  
  if (process.env.STRIPE_PUBLIC_KEY) {
    enabledServices.push('stripe');
  }
  
  if (process.env.CRISP_WEBSITE_ID || process.env.TWAKTO_PROPERTY_ID) {
    enabledServices.push('chat');
  }
  
  return generateCSP(enabledServices);
}

/**
 * Security headers configuration
 */
export const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
  'X-XSS-Protection': '1; mode=block',
};

/**
 * Get all security headers including CSP
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    ...securityHeaders,
    'Content-Security-Policy': getDefaultCSP(),
  };
}

// Log CSP configuration in development
if (isDevelopment) {
  console.log("🔒 CSP Configuration:");
  console.log(`  Environment: ${isDevelopment ? 'Development' : 'Production'}`);
  console.log(`  CSP: ${getDefaultCSP()}`);
}
