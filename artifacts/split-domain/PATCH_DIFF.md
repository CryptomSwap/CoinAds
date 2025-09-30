# Split-Domain Deployment - Patch Diff List

## Files Created (4)

1. **lib/url.ts**
   - URL utility helpers for split-domain
   - Functions: `publicUrl()`, `appUrl()`, `signInUrl()`, `signUpUrl()`, `dashboardUrl()`
   - Exports URLS constants for common links

2. **tests/e2e/split-domain.spec.ts**
   - Playwright tests for split-domain configuration
   - Tests homepage, CTAs, redirects, auth pages, link structure
   - Generates link audit artifact

3. **tests/e2e/headers-robots-sitemap.spec.ts**
   - Tests for security headers, robots.txt, sitemap.xml
   - Validates both root and app domain configurations
   - Saves headers to artifacts

4. **artifacts/split-domain/summary.md**
   - Complete deployment summary
   - Configuration checklist
   - Testing instructions

## Files Modified (11)

### 1. env.example
**Changes:**
- Set `NEXT_PUBLIC_APP_SUBDOMAIN="true"` (was "false")
- Updated NEXTAUTH_URL comment to reference app.coinads.com

**Impact:** Configures split-domain mode by default

---

### 2. config/domain.ts
**Changes:**
- Updated `getCookieDomain()` to return `undefined` for split-domain
- Changed comment: cookies scoped to app.coinads.com only

**Impact:** Cookies no longer shared between domains (correct for split-domain)

---

### 3. middleware.ts
**Changes:**
- Added redirect logic for `/app/*` from root to app subdomain
- Checks `hostname === 'coinads.com' && pathname.startsWith('/app')`
- Returns 308 redirect to `app.coinads.com`

**Impact:** Enforces split-domain routing

---

### 4. vercel.json
**Changes:**
- Updated redirects to use explicit http/https patterns
- Simplified headers to core security headers only

**Impact:** Better redirect handling, cleaner configuration

---

### 5. next.config.js
**Changes:**
- Updated CSP `connect-src` to explicitly include both domains:
  - `https://coinads.com`
  - `https://app.coinads.com`

**Impact:** Allows API calls between domains

---

### 6. components/Hero.tsx
**Changes:**
- Imported `appUrl` from `@/lib/url`
- Updated all auth CTAs to use `appUrl("/auth/signin")` etc.
- Changed dashboard link to `appUrl("/")`

**Impact:** All hero CTAs point to app subdomain

---

### 7. components/TopBar.tsx
**Changes:**
- Imported `appUrl` from `@/lib/url`
- Updated sign-in, sign-up, and dashboard links to use `appUrl()`
- Applied to both desktop and mobile navigation

**Impact:** All navigation CTAs point to app subdomain

---

### 8. components/publishers/HeroPublishers.tsx
**Changes:**
- Imported `appUrl` and `signUpUrl` from `@/lib/url`
- Updated CTA to use `signUpUrl("publisher")`
- Dashboard link uses `appUrl("/")`

**Impact:** Publisher hero CTAs point to app subdomain

---

### 9. components/publishers/CtaBand.tsx
**Changes:**
- Imported `appUrl` and `signUpUrl` from `@/lib/url`
- Updated CTA to use `signUpUrl("publisher")`

**Impact:** Publisher CTA band points to app subdomain

---

### 10. app/advertisers/page.tsx
**Changes:**
- Imported `signUpUrl` and `signInUrl` from `@/lib/url`
- Replaced all `/auth/signin` with `signUpUrl("advertiser")`

**Impact:** All advertiser page CTAs point to app subdomain

---

### 11. scripts/check-env.ts
**Changes:**
- Added `--split` command-line argument parsing
- Added split-domain validation:
  - Checks `NEXT_PUBLIC_APP_SUBDOMAIN === "true"`
  - Validates `NEXTAUTH_URL` includes `app.coinads.com`

**Impact:** Environment validation supports split-domain mode

---

## Summary Statistics

- **Files Created:** 4
- **Files Modified:** 11
- **Total Changes:** 15 files
- **Lines Changed:** ~500 (estimated)

## Testing Status

- ✅ **Type Check:** Passed
- ✅ **Build:** Passed (0 errors, 0 warnings)
- ⏳ **Split-Domain Tests:** Requires deployment
- ⏳ **Headers/Robots Tests:** Requires deployment

## Deployment Readiness

- ✅ Environment configuration complete
- ✅ Domain routing configured
- ✅ Marketing links updated
- ✅ Security headers configured
- ✅ CORS/CSP configured
- ✅ Tests created
- ✅ Documentation complete

**Status:** ✅ READY FOR SPLIT-DOMAIN DEPLOYMENT
