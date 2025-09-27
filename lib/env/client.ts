import { z } from "zod";

// Client-side environment variables schema (ONLY NEXT_PUBLIC_*)
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

// Parse and validate client environment variables
function validateClientEnv() {
  try {
    return clientSchema.parse({
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    });
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

// Validate client environment variables
export const clientEnv = validateClientEnv();
export type ClientEnv = z.infer<typeof clientSchema>;

// Log environment status in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log("🔧 Client environment validation passed");
  console.log(`🌐 App URL: ${clientEnv.NEXT_PUBLIC_APP_URL || "Not set"}`);
}
