import { z } from "zod";

// Runtime guard to prevent client-side imports
if (typeof window !== 'undefined') {
  throw new Error('lib/env/server.ts must only be imported on the server.');
}

// Server-side environment variables schema
const serverSchema = z.object({
  // Required server environment variables
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required and must be non-empty")
    .refine(
      (url) => url.startsWith("postgresql://") || url.startsWith("postgres://"),
      "DATABASE_URL must start with 'postgresql://' or 'postgres://'"
    ),
  NEXTAUTH_SECRET: z
    .string()
    .min(1, "NEXTAUTH_SECRET is required and must be non-empty")
    .optional(),
  NEXTAUTH_URL: z
    .string()
    .url("NEXTAUTH_URL must be a valid URL")
    .optional(),

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

  // Optional chat widget configuration
  CRISP_WEBSITE_ID: z.string().optional(),
  TWAKTO_PROPERTY_ID: z.string().optional(),

  // Optional application configuration
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  
  // Seed configuration
  SEED_SECRET: z.string().optional(),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().min(8).optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Parse and validate server environment variables
function validateServerEnv() {
  try {
    const parsed = serverSchema.parse(process.env);
    
    // Additional production validation
    if (parsed.NODE_ENV === "production") {
      if (!parsed.NEXTAUTH_SECRET) {
        throw new Error("NEXTAUTH_SECRET is required in production");
      }
      if (!parsed.NEXTAUTH_URL) {
        throw new Error("NEXTAUTH_URL is required in production");
      }
    }
    
    return parsed;
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

// Validate server environment variables at startup
export const serverEnv = validateServerEnv();
export type ServerEnv = z.infer<typeof serverSchema>;

// Helper functions for runtime checks
export const isDevelopment = serverEnv.NODE_ENV === "development";
export const isProduction = serverEnv.NODE_ENV === "production";
export const isTest = serverEnv.NODE_ENV === "test";

// Helper to check if optional features are enabled
export const hasEmailConfig = !!(
  serverEnv.EMAIL_SERVER_HOST &&
  serverEnv.EMAIL_SERVER_PORT &&
  serverEnv.EMAIL_SERVER_USER &&
  serverEnv.EMAIL_SERVER_PASSWORD &&
  serverEnv.EMAIL_FROM
);

export const hasStripeConfig = !!(
  serverEnv.STRIPE_PUBLIC_KEY &&
  serverEnv.STRIPE_SECRET_KEY &&
  serverEnv.STRIPE_WEBHOOK_SECRET
);

export const hasGoogleOAuthConfig = !!(
  serverEnv.GOOGLE_CLIENT_ID &&
  serverEnv.GOOGLE_CLIENT_SECRET
);

export const hasChatConfig = !!(
  serverEnv.CRISP_WEBSITE_ID || serverEnv.TWAKTO_PROPERTY_ID
);

// Log environment status in development
if (isDevelopment) {
  console.log("🔧 Server environment validation passed");
  console.log(`📧 Email service: ${hasEmailConfig ? "✅ Configured" : "❌ Not configured"}`);
  console.log(`💳 Stripe service: ${hasStripeConfig ? "✅ Configured" : "❌ Not configured"}`);
  console.log(`🔐 Google OAuth: ${hasGoogleOAuthConfig ? "✅ Configured" : "❌ Not configured"}`);
  console.log(`💬 Chat widget: ${hasChatConfig ? "✅ Configured" : "❌ Not configured"}`);
  console.log(`🌐 App URL: ${serverEnv.NEXT_PUBLIC_APP_URL || "Not set"}`);
}
