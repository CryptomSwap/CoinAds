# CoinAds Deployment Configuration

**Generated:** $(date)  
**Platform:** Vercel + Neon PostgreSQL + Upstash Redis  
**Status:** Production-ready deployment configuration

## Overview

CoinAds is configured for deployment on Vercel with PostgreSQL database (Neon), Redis caching (Upstash), and comprehensive monitoring. The application supports both containerized and serverless deployment patterns.

## Vercel Deployment

### Platform Configuration
- **Framework:** Next.js 14 App Router
- **Runtime:** Node.js 18
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Environment Variables (Vercel)
```bash
# Required Variables
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Optional Variables
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@your-domain.com"

STRIPE_PUBLIC_KEY="pk_live_your_stripe_public_key"
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

SENTRY_DSN="your-sentry-dsn"
HEALTH_TOKEN="your-health-check-token"
ALLOWED_ORIGINS="https://publisher1.com,https://publisher2.com"
```

### Vercel Configuration
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## Database Configuration

### Neon PostgreSQL
- **Provider:** Neon (Serverless PostgreSQL)
- **Connection:** Pooled connection recommended
- **SSL:** Required for production
- **Migrations:** Prisma migrations

### Connection String Format
```
postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Database Setup Commands
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

## Redis Configuration (Upstash)

### Upstash Redis
- **Provider:** Upstash (Serverless Redis)
- **Use Case:** Rate limiting, session storage, caching
- **Connection:** REST API with token authentication

### Environment Variables
```bash
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

### Rate Limiting Configuration
```typescript
// lib/rate-limit.ts
const RATE_LIMIT_CONFIG = {
  default: 60, // requests per minute
  endpoints: {
    '/api/track/impression': 1000,
    '/api/track/click': 1000,
    '/api/auth/signin': 10,
    '/api/auth/register': 5,
    '/api/support': 5,
  },
  windowMs: 60 * 1000, // 1 minute
};
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: coinads
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  web:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/coinads
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: changeme
      APP_BASE_URL: http://localhost:3000
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next

volumes:
  postgres_data:
```

## Build Configuration

### Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // typescript: { ignoreBuildErrors: true }, // uncomment only if we decide to bypass TS during MVP
  output: 'standalone', // For Docker deployment
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

module.exports = nextConfig;
```

### Build Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "prebuild": "node scripts/enforce-prod.js",
    "build": "next build",
    "start": "next start",
    "postinstall": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "tsx scripts/dev-seed.ts"
  }
}
```

### Production Build Enforcement
```javascript
// scripts/enforce-prod.js
const fs = require('fs');
const path = require('path');

// Check for debug files in production
const debugFiles = [
  'app/debug/page.tsx',
  'app/test-auth/page.tsx'
];

debugFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.error(`❌ Debug file found: ${file}`);
    process.exit(1);
  }
});

console.log('✅ Production build check passed');
```

## Environment Management

### Development Environment
```bash
# .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/coinads"
NEXTAUTH_SECRET="dev-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### Staging Environment
```bash
# Staging environment variables
DATABASE_URL="postgresql://staging-user:pass@staging-host:5432/coinads"
NEXTAUTH_SECRET="staging-secret-key"
NEXTAUTH_URL="https://staging.yourapp.com"
NODE_ENV="production"
```

### Production Environment
```bash
# Production environment variables
DATABASE_URL="postgresql://prod-user:pass@prod-host:5432/coinads"
NEXTAUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://yourapp.com"
NODE_ENV="production"
```

## Monitoring & Observability

### Sentry Configuration
```typescript
// lib/sentry.client.ts
import * as Sentry from "@sentry/nextjs";

export function initSentry() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  
  if (!dsn) {
    console.log("Sentry DSN not configured, skipping client initialization");
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    debug: process.env.NODE_ENV === 'development',
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.1,
  });
}
```

### Health Checks
```typescript
// app/api/health/route.ts
export async function GET(request: NextRequest) {
  const healthToken = request.headers.get('x-health-token');
  const expectedToken = process.env.HEALTH_TOKEN;
  
  if (!healthToken || healthToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbTime = Date.now() - startTime;
    
    return NextResponse.json({ 
      ok: true, 
      db: "connected",
      time: dbTime
    });
  } catch (e: any) {
    return NextResponse.json({ 
      ok: false, 
      error: e.message,
      time: null
    }, { status: 500 });
  }
}
```

## Security Configuration

### CORS Configuration
```typescript
// lib/cors.ts
const CORS_CONFIG = {
  allowedOrigins: process.env.NODE_ENV === 'production' 
    ? (process.env.ALLOWED_ORIGINS?.split(',') || [])
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  allowedMethods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 'Authorization', 'X-Requested-With',
    'Accept', 'Origin', 'User-Agent', 'Referer'
  ],
  maxAge: 86400, // 24 hours
};
```

### Security Headers
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}
```

## Deployment Workflow

### Vercel Deployment
1. **Connect Repository:** Link GitHub repository to Vercel
2. **Configure Environment:** Set environment variables
3. **Deploy:** Automatic deployment on push to main
4. **Database Migration:** Run `prisma migrate deploy`
5. **Health Check:** Verify `/api/health` endpoint

### Docker Deployment
1. **Build Image:** `docker build -t coinads .`
2. **Run Container:** `docker run -p 3000:3000 coinads`
3. **Database Setup:** Ensure PostgreSQL is running
4. **Migration:** Run database migrations
5. **Health Check:** Verify application health

### Manual Deployment
1. **Build Application:** `npm run build`
2. **Start Application:** `npm start`
3. **Database Migration:** `npx prisma migrate deploy`
4. **Health Check:** Verify application is running

## Performance Optimization

### Build Optimization
- **Standalone Output:** For Docker deployment
- **External Packages:** Prisma client externalized
- **Tree Shaking:** Unused code eliminated
- **Code Splitting:** Automatic code splitting

### Runtime Optimization
- **Connection Pooling:** Database connection pooling
- **Redis Caching:** Upstash Redis for caching
- **CDN:** Vercel Edge Network
- **Compression:** Automatic gzip compression

## Troubleshooting

### Common Issues
1. **Database Connection:** Check DATABASE_URL format
2. **Environment Variables:** Verify all required variables are set
3. **Build Failures:** Check for TypeScript errors
4. **Migration Issues:** Ensure database is accessible

### Debug Commands
```bash
# Check environment variables
vercel env ls

# View build logs
vercel logs

# Test database connection
npx prisma db pull

# Run health check
curl -H "x-health-token: your-token" https://yourapp.com/api/health
```

## Backup & Recovery

### Database Backup
```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

### Environment Backup
```bash
# Export environment variables
vercel env pull .env.production

# Import environment variables
vercel env add VARIABLE_NAME
```

## Scaling Considerations

### Horizontal Scaling
- **Vercel:** Automatic scaling with serverless functions
- **Database:** Neon supports connection pooling
- **Redis:** Upstash handles scaling automatically

### Vertical Scaling
- **Function Timeout:** 30 seconds for API routes
- **Memory:** 1GB default, can be increased
- **CPU:** Shared resources, can be upgraded

### Performance Monitoring
- **Vercel Analytics:** Built-in performance monitoring
- **Sentry:** Error tracking and performance monitoring
- **Database Metrics:** Neon provides database metrics
- **Redis Metrics:** Upstash provides Redis metrics
