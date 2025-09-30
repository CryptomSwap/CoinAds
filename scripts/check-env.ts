#!/usr/bin/env node

/**
 * Environment validation script for production deployment
 * Validates required environment variables and domain configuration
 */

import { z } from "zod";
import { validateNextAuthUrl, DOMAIN_ROOT, DOMAIN_APP, USE_APP_SUBDOMAIN } from "../config/domain";

// Command line argument parsing
const args = process.argv.slice(2);
const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'dev';
const domain = args.find(arg => arg.startsWith('--domain='))?.split('=')[1] || DOMAIN_ROOT;
const split = args.find(arg => arg.startsWith('--split='))?.split('=')[1] === 'true';

// Environment validation schema
const envSchema = z.object({
  // Required for all environments
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (url) => url.startsWith("postgresql://") || url.startsWith("postgres://"),
      "DATABASE_URL must be a PostgreSQL connection string"
    ),
  
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
  
  NEXTAUTH_URL: z
    .string()
    .url("NEXTAUTH_URL must be a valid URL"),
  
  // Feature flags
  NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION: z
    .string()
    .transform(val => val === "true")
    .default("false"),
  
  // Optional but recommended
  NEXT_PUBLIC_APP_SUBDOMAIN: z
    .string()
    .optional()
    .transform(val => val === "true"),
  
  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    mode: string;
    domain: string;
    nextAuthUrl: string | null;
    emailVerificationEnabled: boolean;
    subdomainSplitEnabled: boolean;
    requiredVarsPresent: boolean;
  };
}

function validateEnvironment(): ValidationResult {
  const result: ValidationResult = {
    success: true,
    errors: [],
    warnings: [],
    summary: {
      mode,
      domain,
      nextAuthUrl: null,
      emailVerificationEnabled: false,
      subdomainSplitEnabled: false,
      requiredVarsPresent: false,
    }
  };

  try {
    // Parse and validate environment variables
    const parsed = envSchema.parse(process.env);
    
    result.summary.emailVerificationEnabled = parsed.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION;
    result.summary.subdomainSplitEnabled = parsed.NEXT_PUBLIC_APP_SUBDOMAIN || false;
    result.summary.nextAuthUrl = parsed.NEXTAUTH_URL;
    result.summary.requiredVarsPresent = true;

    // Validate NEXTAUTH_URL against domain configuration
    if (!validateNextAuthUrl(parsed.NEXTAUTH_URL)) {
      result.errors.push(
        `NEXTAUTH_URL (${parsed.NEXTAUTH_URL}) does not match configured domain (${domain})`
      );
      result.success = false;
    }

    // Split-domain validation
    if (split) {
      if (!parsed.NEXT_PUBLIC_APP_SUBDOMAIN) {
        result.errors.push("NEXT_PUBLIC_APP_SUBDOMAIN must be 'true' for split-domain deployment");
        result.success = false;
      }
      
      if (!parsed.NEXTAUTH_URL.includes('app.coinads.com')) {
        result.errors.push("NEXTAUTH_URL must be https://app.coinads.com for split-domain deployment");
        result.success = false;
      }
    }

    // Production-specific validations
    if (mode === 'prod' || parsed.NODE_ENV === 'production') {
      // Ensure HTTPS in production
      if (!parsed.NEXTAUTH_URL.startsWith('https://')) {
        result.errors.push("NEXTAUTH_URL must use HTTPS in production");
        result.success = false;
      }

      // Ensure absolute URL
      if (!parsed.NEXTAUTH_URL.includes(domain)) {
        result.errors.push(
          `NEXTAUTH_URL must include the production domain: ${domain}`
        );
        result.success = false;
      }

      // Check for placeholder values
      if (parsed.NEXTAUTH_SECRET.includes('your-super-secret') || 
          parsed.NEXTAUTH_SECRET.length < 32) {
        result.errors.push("NEXTAUTH_SECRET must be a secure, randomly generated value");
        result.success = false;
      }

      if (parsed.DATABASE_URL.includes('localhost') || 
          parsed.DATABASE_URL.includes('username:password')) {
        result.errors.push("DATABASE_URL must point to production database");
        result.success = false;
      }
    }

    // Development warnings
    if (mode === 'dev' || parsed.NODE_ENV === 'development') {
      if (parsed.NEXTAUTH_URL.startsWith('https://')) {
        result.warnings.push("Using HTTPS in development - ensure SSL certificates are configured");
      }
    }

    // Feature flag warnings
    if (parsed.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION) {
      result.warnings.push("Email verification is enabled - ensure email service is configured");
    } else {
      result.warnings.push("Email verification is disabled - users can access without email verification");
    }

    if (parsed.NEXT_PUBLIC_APP_SUBDOMAIN) {
      result.warnings.push("Subdomain split is enabled - ensure DNS and Vercel configuration supports app.coinads.com");
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        result.errors.push(`${err.path.join('.')}: ${err.message}`);
      });
    } else {
      result.errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    result.success = false;
  }

  return result;
}

function printResult(result: ValidationResult): void {
  console.log("🔍 Environment Validation Report");
  console.log("================================\n");

  console.log(`Mode: ${result.summary.mode}`);
  console.log(`Domain: ${result.summary.domain}`);
  console.log(`NEXTAUTH_URL: ${result.summary.nextAuthUrl || 'Not set'}`);
  console.log(`Email Verification: ${result.summary.emailVerificationEnabled ? 'Enabled' : 'Disabled'}`);
  console.log(`Subdomain Split: ${result.summary.subdomainSplitEnabled ? 'Enabled' : 'Disabled'}`);
  console.log(`Required Variables: ${result.summary.requiredVarsPresent ? '✅ Present' : '❌ Missing'}\n`);

  if (result.errors.length > 0) {
    console.log("❌ ERRORS:");
    result.errors.forEach(error => {
      console.log(`  • ${error}`);
    });
    console.log();
  }

  if (result.warnings.length > 0) {
    console.log("⚠️  WARNINGS:");
    result.warnings.forEach(warning => {
      console.log(`  • ${warning}`);
    });
    console.log();
  }

  if (result.success) {
    console.log("✅ Environment validation PASSED");
    console.log("Ready for deployment!");
  } else {
    console.log("❌ Environment validation FAILED");
    console.log("Please fix the errors above before deploying.");
  }
}

// Main execution
if (require.main === module) {
  const result = validateEnvironment();
  printResult(result);
  
  // Write result to artifacts directory
  const fs = require('fs');
  const path = require('path');
  
  const artifactsDir = path.join(process.cwd(), 'artifacts', 'launch');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }
  
  const outputFile = path.join(artifactsDir, 'env-check.json');
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
  console.log(`\n📄 Detailed report saved to: ${outputFile}`);
  
  // Exit with error code if validation failed
  process.exit(result.success ? 0 : 1);
}

export { validateEnvironment, type ValidationResult };
