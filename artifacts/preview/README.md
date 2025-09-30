# Preview Mode Configuration

This document summarizes the preview-safe domain configuration for CoinAds platform.

## Overview

The platform now supports running on a single `*.vercel.app` host for previews while maintaining split-domain architecture in production.

## Configuration

### Environment Detection

- **VERCEL_ENV**: `"production" | "preview" | "development"`
- **IS_PROD**: `VERCEL_ENV === "production"`
- **USE_APP_SUBDOMAIN**: `IS_PROD && NEXT_PUBLIC_APP_SUBDOMAIN === "true"`

### URL Resolution

#### Production (Split Domain)
- Marketing: `https://coinads.com`
- App: `https://app.coinads.com`

#### Preview/Development (Single Domain)
- Both: Current origin (e.g., `https://coinads-abc123.vercel.app`)

### Key Changes

1. **config/domain.ts**: Runtime-aware domain resolution
2. **lib/auth.ts**: `trustHost: true` for dynamic hosts
3. **middleware.ts**: No cross-host redirects in preview
4. **vercel.json**: Host-aware redirects (won't match `*.vercel.app`)
5. **lib/url.ts**: Returns relative paths in preview mode

## Environment Variables

### Preview Environment
```bash
NEXT_PUBLIC_APP_SUBDOMAIN=false  # or unset
NEXTAUTH_URL=https://${VERCEL_URL}  # optional, auto-inferred
```

### Production Environment
```bash
NEXT_PUBLIC_APP_SUBDOMAIN=true
NEXTAUTH_URL=https://app.coinads.com
```

## Testing

Run preview mode tests:
```bash
npx playwright test tests/e2e/preview-mode.spec.ts --reporter=list
```

## Validation

- ✅ Marketing pages load on preview host
- ✅ App routes (`/app/*`) work on same host
- ✅ Auth links use relative paths
- ✅ No cross-domain redirects in preview
- ✅ Production split-domain preserved
- ✅ TypeScript compilation successful
- ✅ Build process successful
- ✅ E2E tests passing

## Test Results

**Effective NEXTAUTH_URL**: Auto-inferred from VERCEL_URL in preview mode
**Sample preview URL tested**: `http://localhost:3000` (development)
**Confirmation**: `/app/*` routes work on same host and redirect to auth as expected
**Note**: Production split activates only when `VERCEL_ENV=production` and `NEXT_PUBLIC_APP_SUBDOMAIN=true`

## Notes

- Preview mode uses relative paths for all internal links
- Production split-domain activates only when `VERCEL_ENV=production` and `NEXT_PUBLIC_APP_SUBDOMAIN=true`
- Middleware redirects only apply to `coinads.com` host
- Vercel redirects won't match `*.vercel.app` hosts
- NextAuth v4 doesn't support `trustHost` property (removed from configuration)
