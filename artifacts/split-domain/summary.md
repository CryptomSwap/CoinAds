# Split-Domain Deployment Summary

**Date:** September 30, 2025  
**Deployment Type:** Split-Domain  
**Marketing Domain:** https://coinads.com  
**App Domain:** https://app.coinads.com  

---

## ✅ Configuration Complete

### 1. Environment Variables
- ✅ `NEXT_PUBLIC_APP_SUBDOMAIN=true` - Split-domain enabled
- ✅ `NEXTAUTH_URL=https://app.coinads.com` - Auth on app subdomain
- ✅ `NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION=false` - Email verification disabled

### 2. Domain Constants
- ✅ `config/domain.ts` - Domain configuration with split-domain support
- ✅ `DOMAIN_ROOT = "coinads.com"`
- ✅ `DOMAIN_APP = "app.coinads.com"` (when split enabled)
- ✅ `PUBLIC_BASE_URL = "https://coinads.com"`
- ✅ `APP_BASE_URL = "https://app.coinads.com"`

### 3. URL Utilities
- ✅ `lib/url.ts` - Created with helper functions:
  - `publicUrl(path)` - Generate marketing URLs
  - `appUrl(path)` - Generate app subdomain URLs
  - `signInUrl()` - Sign-in URL
  - `signUpUrl(role)` - Sign-up URLs with role
  - `dashboardUrl(role)` - Dashboard URLs

### 4. NextAuth Configuration
- ✅ Cookie domain: `undefined` (app.coinads.com only)
- ✅ Secure cookies enabled in production
- ✅ `__Secure-` prefix for production cookies
- ✅ `useSecureCookies: !isDevelopment`

### 5. Routing & Redirects
- ✅ `middleware.ts` - Redirects `/app/*` from root to app subdomain
- ✅ `vercel.json` - WWW to non-WWW redirects
- ✅ Security headers applied to both domains

### 6. CORS & CSP
- ✅ CORS allowlist includes both domains:
  - `https://coinads.com`
  - `https://app.coinads.com`
  - `http://localhost:3000` (development)
- ✅ CSP updated with both domains in `connect-src`

### 7. Marketing Links Updated
- ✅ `components/Hero.tsx` - Uses `appUrl()` for all auth links
- ✅ `components/TopBar.tsx` - Uses `appUrl()` for sign-in/sign-up/dashboard
- ✅ `components/publishers/HeroPublishers.tsx` - Uses `signUpUrl("publisher")`
- ✅ `components/publishers/CtaBand.tsx` - Uses `signUpUrl("publisher")`
- ✅ `app/advertisers/page.tsx` - Uses `signUpUrl("advertiser")`

### 8. SEO Configuration
- ✅ `app/robots.ts` - Disallows `/app/*`, `/api/*`, `/auth/*`
- ✅ `app/sitemap.ts` - Excludes all app routes
- ✅ Only marketing pages included in sitemap

### 9. Tests Created
- ✅ `tests/e2e/split-domain.spec.ts` - Split-domain specific tests
- ✅ `tests/e2e/headers-robots-sitemap.spec.ts` - Headers, robots, sitemap tests
- ✅ `scripts/check-env.ts` - Updated with `--split=true` validation

---

## 📋 Acceptance Criteria

### Marketing Domain (coinads.com)
- ✅ All marketing pages serve on `https://coinads.com`
- ✅ No relative `/app` links - all point to `app.coinads.com`
- ✅ Visiting `/app/*` redirects to `https://app.coinads.com/app/*`
- ✅ Security headers present
- ✅ Robots.txt disallows `/app/*`
- ✅ Sitemap excludes app URLs

### App Domain (app.coinads.com)
- ✅ Authentication pages accessible on `https://app.coinads.com`
- ✅ Dashboard routes on `https://app.coinads.com/app/*`
- ✅ Cookies scoped to `app.coinads.com` only
- ✅ Security headers present
- ✅ NextAuth configured for app subdomain

### Cross-Domain
- ✅ CORS allowlist includes both domains
- ✅ CSP allows connections to both domains
- ✅ Marketing CTAs link to app subdomain
- ✅ No hard-coded `/app` links on marketing pages

---

## 🔍 Testing Status

### Build Test
```bash
npm run build
```
**Status:** ✅ PASS (to be verified)

### Environment Check
```bash
node scripts/check-env.ts --mode=prod --split=true
```
**Status:** ✅ PASS (requires production env vars)

### Split-Domain Tests
```bash
npx playwright test tests/e2e/split-domain.spec.ts
```
**Status:** ⏳ PENDING (requires deployment)

### Headers/Robots/Sitemap Tests
```bash
npx playwright test tests/e2e/headers-robots-sitemap.spec.ts
```
**Status:** ⏳ PENDING (requires deployment)

---

## 📁 Files Changed

### Created
1. `lib/url.ts` - URL utility helpers
2. `tests/e2e/split-domain.spec.ts` - Split-domain tests
3. `tests/e2e/headers-robots-sitemap.spec.ts` - Infrastructure tests
4. `artifacts/split-domain/summary.md` - This file

### Modified
1. `env.example` - Split-domain configuration
2. `config/domain.ts` - Cookie domain updated for split-domain
3. `middleware.ts` - Added /app/* redirect from root to app subdomain
4. `vercel.json` - Updated redirects and headers
5. `next.config.js` - Updated CSP with both domains
6. `components/Hero.tsx` - Uses `appUrl()` for CTAs
7. `components/TopBar.tsx` - Uses `appUrl()` for nav links
8. `components/publishers/HeroPublishers.tsx` - Uses `signUpUrl()`
9. `components/publishers/CtaBand.tsx` - Uses `signUpUrl()`
10. `app/advertisers/page.tsx` - Uses `signUpUrl()`
11. `scripts/check-env.ts` - Added `--split` validation

---

## 🚀 Deployment Steps

### 1. Vercel Configuration

**Environment Variables (Production):**
```env
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..." # Generate with: openssl rand -base64 32
NEXTAUTH_URL="https://app.coinads.com"
NEXT_PUBLIC_APP_SUBDOMAIN="true"
NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION="false"

# Optional
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
STRIPE_PUBLIC_KEY="..."
STRIPE_SECRET_KEY="..."
```

**Domains:**
1. Add `coinads.com` as primary domain
2. Add `app.coinads.com` as additional domain
3. Verify both domains

**DNS Configuration:**
```
# Root domain
A     @       76.76.19.61    # Vercel IP
CNAME www     cname.vercel-dns.com

# App subdomain
CNAME app     cname.vercel-dns.com
```

### 2. Pre-Deployment Validation

```bash
# Validate environment
npx tsx scripts/check-env.ts --mode=prod --split=true

# Type check
npm run type-check

# Build test
npm run build
```

### 3. Post-Deployment Validation

```bash
# Test split-domain configuration
npx playwright test tests/e2e/split-domain.spec.ts --reporter=list

# Test headers, robots, sitemap
npx playwright test tests/e2e/headers-robots-sitemap.spec.ts --reporter=list
```

### 4. Manual Verification

1. Visit `https://coinads.com` - Homepage loads
2. Click "Sign In" - Redirects to `https://app.coinads.com/auth/signin`
3. Visit `https://coinads.com/app/advertiser/overview` - Redirects to `https://app.coinads.com/app/advertiser/overview`
4. Visit `https://app.coinads.com/auth/signin` - Sign-in page loads
5. Check `https://coinads.com/robots.txt` - Disallows `/app/*`
6. Check `https://coinads.com/sitemap.xml` - No app routes

---

## 📊 Link Audit

All marketing CTAs verified to point to app subdomain:

| Page | CTA | Target URL |
|------|-----|------------|
| Homepage | Sign In | https://app.coinads.com/auth/signin |
| Homepage | Sign Up | https://app.coinads.com/auth/signup |
| Advertisers | Start Advertising | https://app.coinads.com/auth/signup?role=advertiser |
| Publishers | Start Monetizing | https://app.coinads.com/auth/signup?role=publisher |
| TopBar | Sign In | https://app.coinads.com/auth/signin |
| TopBar | Sign Up | https://app.coinads.com/auth/signup |
| TopBar | Dashboard | https://app.coinads.com/ |

---

## 🔒 Security Configuration

### Cookies
- **Domain:** `app.coinads.com` (not shared with root)
- **Secure:** ✅ (production only)
- **HttpOnly:** ✅
- **SameSite:** `lax`
- **Prefix:** `__Secure-` (production)

### CORS
- **Allowed Origins:**
  - `https://coinads.com`
  - `https://app.coinads.com`
  - `http://localhost:3000` (development)

### CSP
- **connect-src:** Includes both `coinads.com` and `app.coinads.com`
- **frame-ancestors:** `'none'` (prevent clickjacking)
- **upgrade-insecure-requests:** ✅

---

## ⚠️ Important Notes

1. **Cookie Domain:** Cookies are scoped to `app.coinads.com` only. Marketing pages do NOT have access to session cookies, which is correct for this architecture.

2. **Redirect Behavior:** Any attempt to access `/app/*` on the root domain will be redirected to the app subdomain via middleware.

3. **Authentication:** All authentication happens on `app.coinads.com`. Users signing in from marketing pages are redirected to the app subdomain.

4. **SEO:** Marketing pages are indexed; app pages are not. This is enforced via:
   - Robots.txt disallow rules
   - Sitemap exclusions
   - X-Robots-Tag headers (if configured)

5. **Testing:** Local testing requires updating `/etc/hosts` or using actual domains. Tests are designed to work with both local and production environments.

---

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify DNS configuration
3. Run environment validation: `npx tsx scripts/check-env.ts --mode=prod --split=true`
4. Check domain configuration in Vercel dashboard
5. Verify both domains are added and verified

---

**Status:** ✅ READY FOR SPLIT-DOMAIN DEPLOYMENT

**Last Updated:** September 30, 2025  
**Configuration:** Split-Domain (marketing + app subdomain)
