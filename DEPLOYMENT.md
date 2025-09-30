# CoinAds Production Deployment Guide

This guide covers deploying the CoinAds platform to production on Vercel with proper domain configuration, security, and monitoring.

## 🎯 Overview

The CoinAds platform is designed to run on:
- **Primary Domain**: `https://coinads.com`
- **Optional Dashboard**: `https://app.coinads.com` (if subdomain split is enabled)

## 🏗️ Architecture

### Domain Strategy

**Single Domain (Default)**
- Marketing site: `https://coinads.com`
- Dashboard: `https://coinads.com/app/*`
- Set `NEXT_PUBLIC_APP_SUBDOMAIN=false`

**Subdomain Split**
- Marketing site: `https://coinads.com`
- Dashboard: `https://app.coinads.com`
- Set `NEXT_PUBLIC_APP_SUBDOMAIN=true`

### Security Features

- **HTTPS Enforcement**: All traffic redirected to HTTPS
- **Security Headers**: HSTS, CSP, X-Frame-Options, etc.
- **CORS Protection**: Whitelist-based CORS for API endpoints
- **Authentication**: NextAuth with secure cookies
- **Rate Limiting**: API endpoint protection
- **Bot Protection**: AI crawler blocking in robots.txt

## 🔧 Pre-Deployment Setup

### 1. Environment Variables

Create a `.env.production` file with these required variables:

```env
# Database (Neon PostgreSQL recommended)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# NextAuth Configuration
NEXTAUTH_SECRET="your-64-character-secret"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="https://coinads.com"  # or https://app.coinads.com for subdomain split

# Feature Flags
NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION="false"
NEXT_PUBLIC_APP_SUBDOMAIN="false"  # Set to "true" for subdomain split

# Optional Services
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@coinads.com"

STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"
SENTRY_DSN="your-sentry-dsn"
```

### 2. Database Setup

1. **Create Neon Database**:
   ```bash
   # Install Neon CLI
   npm install -g @neondatabase/cli
   
   # Create database
   neon projects create coinads
   neon databases create coinads
   ```

2. **Run Migrations**:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

3. **Seed Database** (optional):
   ```bash
   npm run db:seed
   ```

### 3. Domain Configuration

#### DNS Records

For `coinads.com`:
```
A     @       76.76.19.61    # Vercel IP
CNAME www     cname.vercel-dns.com
```

For subdomain split (`app.coinads.com`):
```
CNAME app     cname.vercel-dns.com
```

#### SSL Certificates

Vercel automatically provisions SSL certificates. Ensure:
- DNS records are properly configured
- Domains are verified in Vercel dashboard
- Certificate status shows "Ready" before going live

## 🚀 Vercel Deployment

### 1. Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration

### 2. Environment Variables

In Vercel dashboard, add all environment variables from your `.env.production` file:

1. Go to Project Settings → Environment Variables
2. Add each variable with appropriate environment (Production, Preview, Development)
3. Ensure sensitive variables are marked as "Encrypted"

### 3. Domain Configuration

1. Go to Project Settings → Domains
2. Add `coinads.com` as primary domain
3. If using subdomain split, add `app.coinads.com` as additional domain
4. Verify domain ownership

### 4. Build Configuration

Vercel will automatically detect the build configuration from `vercel.json`:

```json
{
  "buildCommand": "npx prisma generate && npx prisma migrate deploy && next build"
}
```

## ✅ Pre-Deployment Validation

Run these commands before deploying:

```bash
# 1. Validate environment configuration
node scripts/check-env.ts --mode=prod --domain=coinads.com

# 2. Type check
npm run type-check

# 3. Build test
npm run build

# 4. Run smoke tests
npx playwright test tests/e2e/launch-smoke.spec.ts

# 5. Check build logs for issues
node scripts/build-log-guard.ts
```

### Expected Output

**Environment Check**:
```
✅ Environment validation PASSED
Ready for deployment!
```

**Build Test**:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**Smoke Tests**:
```
✅ Homepage loads without errors
✅ Health endpoint returns 200
✅ Marketing pages load correctly
✅ Authentication flow works
✅ Dashboard routes are protected
✅ Security headers are present
✅ Robots.txt is accessible
✅ Sitemap.xml is accessible
```

## 🔍 Post-Deployment Verification

### 1. Health Checks

```bash
# Check health endpoint
curl https://coinads.com/api/health

# Expected response:
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

### 2. Security Headers

```bash
# Check security headers
curl -I https://coinads.com

# Expected headers:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Referrer-Policy: strict-origin-when-cross-origin
# Content-Security-Policy: default-src 'self'; ...
```

### 3. Domain Configuration

```bash
# Check robots.txt
curl https://coinads.com/robots.txt

# Check sitemap
curl https://coinads.com/sitemap.xml

# Check redirects
curl -I https://www.coinads.com
# Should redirect to https://coinads.com
```

### 4. Authentication Flow

1. Visit `https://coinads.com/auth/signin`
2. Verify sign-in form loads
3. Test with valid credentials
4. Verify redirect to dashboard

### 5. Dashboard Access

1. Visit `https://coinads.com/app/advertiser/overview` (or `https://app.coinads.com/advertiser/overview` for subdomain split)
2. Verify redirect to sign-in if not authenticated
3. Test authenticated access

## 📊 Monitoring & Analytics

### 1. Vercel Analytics

- Enable in Vercel dashboard
- Monitor Core Web Vitals
- Track page views and performance

### 2. Error Tracking

- Configure Sentry DSN
- Monitor server and client errors
- Set up alerts for critical issues

### 3. Database Monitoring

- Monitor Neon database performance
- Set up connection pool monitoring
- Track query performance

### 4. Uptime Monitoring

- Set up external uptime monitoring
- Monitor key endpoints:
  - `https://coinads.com/api/health`
  - `https://coinads.com/api/delivery`
  - `https://coinads.com/auth/signin`

## 🔧 Troubleshooting

### Common Issues

**1. Environment Validation Fails**
```
❌ NEXTAUTH_URL does not match configured domain
```
**Solution**: Ensure `NEXTAUTH_URL` matches your domain configuration

**2. Build Fails with TypeScript Errors**
```
❌ Type error in component
```
**Solution**: Run `npm run type-check` locally and fix errors

**3. Authentication Not Working**
```
❌ Redirect loop or session issues
```
**Solution**: Check `NEXTAUTH_SECRET` and cookie domain configuration

**4. CORS Errors**
```
❌ CORS policy violation
```
**Solution**: Verify `ALLOWED_ORIGINS` includes your domain

**5. Database Connection Issues**
```
❌ Database connection failed
```
**Solution**: Check `DATABASE_URL` and database accessibility

### Debug Commands

```bash
# Check environment variables
node scripts/check-env.ts --mode=prod --domain=coinads.com

# Test database connection
npx prisma db pull

# Check build logs
node scripts/build-log-guard.ts

# Run smoke tests
npx playwright test tests/e2e/launch-smoke.spec.ts --reporter=list
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Domain DNS records set
- [ ] SSL certificates ready
- [ ] Environment validation passes
- [ ] Build test passes
- [ ] Smoke tests pass
- [ ] Build log scan clean

### Post-Deployment
- [ ] Health endpoint responds
- [ ] Security headers present
- [ ] Authentication flow works
- [ ] Dashboard access protected
- [ ] Marketing pages load
- [ ] Robots.txt accessible
- [ ] Sitemap.xml accessible
- [ ] Analytics tracking active
- [ ] Error monitoring active
- [ ] Uptime monitoring active

## 🚨 Rollback Plan

If deployment issues occur:

1. **Immediate Rollback**:
   - Revert to previous Vercel deployment
   - Update DNS if needed
   - Verify functionality

2. **Database Rollback**:
   ```bash
   # Rollback to previous migration
   npx prisma migrate resolve --rolled-back <migration_name>
   ```

3. **Environment Rollback**:
   - Revert environment variables in Vercel
   - Redeploy with previous configuration

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Review environment validation output
3. Run smoke tests locally
4. Check database connectivity
5. Verify domain configuration

## 🔄 Updates & Maintenance

### Regular Updates
- Monitor for security updates
- Update dependencies monthly
- Review and update environment variables
- Monitor performance metrics

### Scaling Considerations
- Monitor database performance
- Consider Redis for caching
- Implement CDN for static assets
- Monitor API rate limits

---

**CoinAds Production Deployment** - Ready for launch! 🚀
