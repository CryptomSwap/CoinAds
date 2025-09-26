import { z } from "zod";

// Server-side environment variables schema
const serverSchema = z.object({
  // Required server environment variables
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required and must be non-empty"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required and must be non-empty"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),

  // Optional email configuration
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.coerce.number().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Optional Stripe configuration
  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Optional Google OAuth configuration
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Optional application configuration
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Client-side environment variables schema
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

// Parse and validate server environment variables
function validateServerEnv() {
  try {
    return serverSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter((err) => err.code === "too_small" || err.code === "invalid_type")
        .map((err) => err.path.join("."));

      const invalidVars = error.errors
        .filter((err) => err.code === "invalid_string" || err.code === "invalid_enum_value")
        .map((err) => `${err.path.join(".")}: ${err.message}`);

      let errorMessage = "❌ Environment validation failed:\n\n";

      if (missingVars.length > 0) {
        errorMessage += `Missing required variables:\n${missingVars.map((v) => `  - ${v}`).join("\n")}\n\n`;
      }

      if (invalidVars.length > 0) {
        errorMessage += `Invalid variables:\n${invalidVars.map((v) => `  - ${v}`).join("\n")}\n\n`;
      }

      errorMessage += `Please check your .env.local file and ensure all required variables are set.\n`;
      errorMessage += `See .env.sample for reference.`;

      throw new Error(errorMessage);
    }
    throw error;
  }
}

// Parse and validate client environment variables
function validateClientEnv() {
  try {
    return clientSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const invalidVars = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      throw new Error(`❌ Client environment validation failed: ${invalidVars}`);
    }
    throw error;
  }
}

// Validate server environment variables at startup
const serverEnv = validateServerEnv();

// Validate client environment variables
const clientEnv = validateClientEnv();

// Export typed environment object
export const env = {
  // Server environment variables
  DATABASE_URL: serverEnv.DATABASE_URL,
  NEXTAUTH_SECRET: serverEnv.NEXTAUTH_SECRET,
  NEXTAUTH_URL: serverEnv.NEXTAUTH_URL,
  NODE_ENV: serverEnv.NODE_ENV,

  // Optional server variables
  EMAIL_SERVER_HOST: serverEnv.EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT: serverEnv.EMAIL_SERVER_PORT,
  EMAIL_SERVER_USER: serverEnv.EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD: serverEnv.EMAIL_SERVER_PASSWORD,
  EMAIL_FROM: serverEnv.EMAIL_FROM,
  STRIPE_PUBLIC_KEY: serverEnv.STRIPE_PUBLIC_KEY,
  STRIPE_SECRET_KEY: serverEnv.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: serverEnv.STRIPE_WEBHOOK_SECRET,
  GOOGLE_CLIENT_ID: serverEnv.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: serverEnv.GOOGLE_CLIENT_SECRET,

  // Client environment variables
  NEXT_PUBLIC_APP_URL: clientEnv.NEXT_PUBLIC_APP_URL || serverEnv.NEXT_PUBLIC_APP_URL,
} as const;

// Type exports for TypeScript
export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
export type Env = typeof env;

// Helper functions for runtime checks
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

// Helper to check if optional features are enabled
export const hasEmailConfig = !!(
  env.EMAIL_SERVER_HOST &&
  env.EMAIL_SERVER_PORT &&
  env.EMAIL_SERVER_USER &&
  env.EMAIL_SERVER_PASSWORD &&
  env.EMAIL_FROM
);

export const hasStripeConfig = !!(
  env.STRIPE_PUBLIC_KEY &&
  env.STRIPE_SECRET_KEY &&
  env.STRIPE_WEBHOOK_SECRET
);

export const hasGoogleOAuthConfig = !!(
  env.GOOGLE_CLIENT_ID &&
  env.GOOGLE_CLIENT_SECRET
);

// Log environment status in development
if (isDevelopment) {
  console.log("🔧 Environment validation passed");
  console.log(`📧 Email service: ${hasEmailConfig ? "✅ Configured" : "❌ Not configured"}`);
  console.log(`💳 Stripe service: ${hasStripeConfig ? "✅ Configured" : "❌ Not configured"}`);
  console.log(`🔐 Google OAuth: ${hasGoogleOAuthConfig ? "✅ Configured" : "❌ Not configured"}`);
  console.log(`🌐 App URL: ${env.NEXT_PUBLIC_APP_URL || "Not set"}`);
}
