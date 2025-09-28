# CoinAds Environment Variables Matrix

**Generated:** $(date)  
**Validation:** Zod schemas with runtime checks  
**Scope:** Server and client environment variables

## Overview

CoinAds uses a comprehensive environment variable system with Zod validation, runtime checks, and feature flags. Variables are categorized by usage (server/client), requirement level, and feature dependencies.

## Server Environment Variables

### Required Variables

| Variable | Type | Validation | Purpose | Default | Notes |
|----------|------|------------|---------|---------|-------|
| `DATABASE_URL` | String | PostgreSQL URL | Database connection | - | Must start with `postgresql://` or `postgres://` |
| `NEXTAUTH_SECRET` | String | Non-empty | NextAuth.js secret | - | Required in production |
| `NEXTAUTH_URL` | String | Valid URL | NextAuth.js base URL | - | Required in production |

### Optional Variables

#### Email Configuration
| Variable | Type | Validation | Purpose | Default | Feature Flag |
|----------|------|------------|---------|---------|--------------|
| `EMAIL_SERVER_HOST` | String | - | SMTP server host | - | `hasEmailConfig` |
| `EMAIL_SERVER_PORT` | Number | - | SMTP server port | - | `hasEmailConfig` |
| `EMAIL_SERVER_USER` | String | - | SMTP username | - | `hasEmailConfig` |
| `EMAIL_SERVER_PASSWORD` | String | - | SMTP password | - | `hasEmailConfig` |
| `EMAIL_FROM` | String | Email format | From email address | - | `hasEmailConfig` |

#### Stripe Configuration
| Variable | Type | Validation | Purpose | Default | Feature Flag |
|----------|------|------------|---------|---------|--------------|
| `STRIPE_PUBLIC_KEY` | String | - | Stripe public key | - | `hasStripeConfig` |
| `STRIPE_SECRET_KEY` | String | - | Stripe secret key | - | `hasStripeConfig` |
| `STRIPE_WEBHOOK_SECRET` | String | - | Stripe webhook secret | - | `hasStripeConfig` |

#### Google OAuth Configuration
| Variable | Type | Validation | Purpose | Default | Feature Flag |
|----------|------|------------|---------|---------|--------------|
| `GOOGLE_CLIENT_ID` | String | - | Google OAuth client ID | - | `hasGoogleOAuthConfig` |
| `GOOGLE_CLIENT_SECRET` | String | - | Google OAuth client secret | - | `hasGoogleOAuthConfig` |

#### Application Configuration
| Variable | Type | Validation | Purpose | Default | Feature Flag |
|----------|------|------------|---------|---------|--------------|
| `NEXT_PUBLIC_APP_URL` | String | Valid URL | Public app URL | - | - |

#### Development/Admin Secrets
| Variable | Type | Validation | Purpose | Default | Feature Flag |
|----------|------|------------|---------|---------|--------------|
| `SEED_SECRET` | String | - | Development seed secret | - | - |

#### System Configuration
| Variable | Type | Validation | Purpose | Default | Feature Flag |
|----------|------|------------|---------|---------|--------------|
| `NODE_ENV` | Enum | development/production/test | Node environment | "development" | - |

## Client Environment Variables

### Public Variables (NEXT_PUBLIC_*)

| Variable | Type | Validation | Purpose | Default | Notes |
|----------|------|------------|---------|---------|-------|
| `NEXT_PUBLIC_APP_URL` | String | Valid URL | Public app URL | - | Used for link generation |

## Feature Flags

### Email Service
```typescript
export const hasEmailConfig = !!(
  serverEnv.EMAIL_SERVER_HOST &&
  serverEnv.EMAIL_SERVER_PORT &&
  serverEnv.EMAIL_SERVER_USER &&
  serverEnv.EMAIL_SERVER_PASSWORD &&
  serverEnv.EMAIL_FROM
);
```

### Stripe Service
```typescript
export const hasStripeConfig = !!(
  serverEnv.STRIPE_PUBLIC_KEY &&
  serverEnv.STRIPE_SECRET_KEY &&
  serverEnv.STRIPE_WEBHOOK_SECRET
);
```

### Google OAuth
```typescript
export const hasGoogleOAuthConfig = !!(
  serverEnv.GOOGLE_CLIENT_ID &&
  serverEnv.GOOGLE_CLIENT_SECRET
);
```

### Chat Widget
```typescript
export const hasChatConfig = !!(
  serverEnv.CRISP_WEBSITE_ID || serverEnv.TWAKTO_PROPERTY_ID
);
```

## Environment Validation

### Server-Side Validation
- **File:** `lib/env/server.ts`
- **Schema:** Zod schema with comprehensive validation
- **Runtime:** Validates on application startup
- **Errors:** Detailed error messages with missing/invalid variables

### Client-Side Validation
- **File:** `lib/env/client.ts`
- **Schema:** Zod schema for client variables only
- **Runtime:** Validates on client bundle
- **Errors:** Clear error messages for invalid client variables

### Production Validation
```typescript
if (parsed.NODE_ENV === "production") {
  if (!parsed.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET is required in production");
  }
  if (!parsed.NEXTAUTH_URL) {
    throw new Error("NEXTAUTH_URL is required in production");
  }
}
```

## Usage Patterns

### Server-Side Usage
```typescript
import { serverEnv } from '@/lib/env/server';

// Database connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: serverEnv.DATABASE_URL
    }
  }
});

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  secret: serverEnv.NEXTAUTH_SECRET,
  // ... other config
};
```

### Client-Side Usage
```typescript
import { clientEnv } from '@/lib/env/client';

// Public URL for links
const appUrl = clientEnv.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
```

### Feature Flag Usage
```typescript
import { hasEmailConfig, hasStripeConfig } from '@/lib/env/server';

// Conditional feature enabling
if (hasEmailConfig) {
  // Enable email features
}

if (hasStripeConfig) {
  // Enable payment features
}
```

## Environment Files

### Development
- **File:** `.env.local`
- **Source:** `env.local.example`
- **Purpose:** Local development configuration
- **Git:** Ignored (not committed)

### Production
- **File:** Environment variables in deployment platform
- **Source:** `env.sample`
- **Purpose:** Production configuration
- **Security:** Managed by deployment platform

### Example Files
- **`env.example`:** Basic example
- **`env.local.example`:** Comprehensive example with comments
- **`env.sample`:** Production-ready example

## Security Considerations

### Secret Management
- **Database URL:** Contains credentials, must be protected
- **NextAuth Secret:** Critical for session security
- **OAuth Secrets:** Required for third-party authentication
- **Stripe Keys:** Required for payment processing

### Environment Isolation
- **Development:** Local `.env.local` file
- **Production:** Platform-managed environment variables
- **Testing:** Test-specific environment configuration

### Validation Security
- **Runtime Checks:** Prevent application startup with invalid config
- **Type Safety:** TypeScript + Zod for compile-time and runtime safety
- **Error Messages:** Clear but not exposing sensitive information

## Deployment Configuration

### Vercel
```bash
# Required variables
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://your-domain.com"

# Optional variables
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@your-domain.com"
```

### Docker
```dockerfile
# Environment variables in Dockerfile
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://..."
ENV NEXTAUTH_SECRET="your-secret"
```

### Kubernetes
```yaml
# Environment variables in deployment
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: coinads-secrets
        key: database-url
  - name: NEXTAUTH_SECRET
    valueFrom:
      secretKeyRef:
        name: coinads-secrets
        key: nextauth-secret
```

## Monitoring & Logging

### Environment Status
```typescript
// Development logging
if (isDevelopment) {
  console.log("🔧 Server environment validation passed");
  console.log(`📧 Email service: ${hasEmailConfig ? "✅ Configured" : "❌ Not configured"}`);
  console.log(`💳 Stripe service: ${hasStripeConfig ? "✅ Configured" : "❌ Not configured"}`);
  console.log(`🔐 Google OAuth: ${hasGoogleOAuthConfig ? "✅ Configured" : "❌ Not configured"}`);
  console.log(`💬 Chat widget: ${hasChatConfig ? "✅ Configured" : "❌ Not configured"}`);
  console.log(`🌐 App URL: ${serverEnv.NEXT_PUBLIC_APP_URL || "Not set"}`);
}
```

### Error Handling
- **Startup Errors:** Detailed validation errors with missing variables
- **Runtime Errors:** Graceful degradation when optional features are disabled
- **Client Errors:** Clear error messages for invalid client configuration

## Best Practices

### Variable Naming
- **Server Variables:** No prefix (e.g., `DATABASE_URL`)
- **Client Variables:** `NEXT_PUBLIC_` prefix (e.g., `NEXT_PUBLIC_APP_URL`)
- **Feature Flags:** Descriptive names (e.g., `hasEmailConfig`)

### Validation
- **Required Variables:** Strict validation with clear error messages
- **Optional Variables:** Feature flags for graceful degradation
- **Type Safety:** Zod schemas for runtime validation

### Security
- **Secret Protection:** Never expose secrets in client code
- **Environment Isolation:** Separate development and production configs
- **Validation:** Runtime checks prevent insecure configurations

### Documentation
- **Examples:** Comprehensive example files
- **Comments:** Detailed comments explaining each variable
- **Validation:** Clear validation rules and error messages
