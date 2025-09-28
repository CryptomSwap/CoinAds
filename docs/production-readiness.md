# CoinAds Production Readiness Audit

**Generated**: 2024-12-19  
**Framework**: Next.js 14 App Router, TypeScript, Prisma, NextAuth  
**Deployment**: Vercel  
**Database**: PostgreSQL (Prisma)  

## Executive Summary

**Total Routes**: 45+ pages, 25+ API endpoints  
**Critical Risks**: 5 high-priority security issues  
**Immediate Actions**: 5 changes required for production safety

### Critical Risks (Top 5)
1. **Demo mode bypasses authentication** - `lib/auth.ts:34-46` allows any email/password in development
2. **CORS allows all origins** - `lib/cors.ts:6` uses `['*']` for production
3. **Debug pages exposed** - `/debug`, `/test-auth` accessible in production
4. **No password validation** - `lib/auth.ts:57-58` skips password checks
5. **Health endpoint unprotected** - `/api/health` accessible without authentication

### Immediate Actions
1. Remove demo mode from production builds
2. Restrict CORS to specific publisher domains
3. Remove or guard debug/test pages
4. Implement password validation
5. Add authentication to health endpoint

---

## Screens & Routes Inventory

| Route | File | Dynamic | Auth Gated | Data Source(s) | Keep/Remove/Refine | Notes |
|-------|------|---------|------------|----------------|-------------------|-------|
| `/` | `app/page.tsx` | No | No | Static | **Keep** | Marketing homepage |
| `/about` | `app/about/page.tsx` | No | No | Static | **Keep** | Marketing page |
| `/advertisers` | `app/advertisers/page.tsx` | No | No | Static | **Keep** | Marketing page |
| `/publishers` | `app/publishers/page.tsx` | No | No | Static | **Keep** | Marketing page |
| `/contact` | `app/contact/page.tsx` | No | No | Static | **Keep** | Marketing page |
| `/debug` | `app/debug/page.tsx` | No | No | Session | **Remove** | Debug page - not for production |
| `/test-auth` | `app/test-auth/page.tsx` | No | No | Session | **Remove** | Test page - not for production |
| `/health` | `app/health/page.tsx` | Yes | No | API | **Refine** | Guard behind admin or remove |
| `/app` | `app/app/page.tsx` | No | Yes | Session | **Keep** | Dashboard redirect |
| `/app/admin/*` | `app/app/admin/*` | No | Yes (Admin) | Database | **Keep** | Admin dashboard |
| `/app/advertiser/*` | `app/app/advertiser/*` | No | Yes (Advertiser) | Database | **Keep** | Advertiser dashboard |
| `/app/publisher/*` | `app/app/publisher/*` | No | Yes (Publisher) | Database | **Keep** | Publisher dashboard |
| `/auth/*` | `app/auth/*` | No | No | NextAuth | **Keep** | Authentication pages |
| `/legal/*` | `app/legal/*` | No | No | Static | **Keep** | Legal pages |

---

## API Routes Inventory

| Method(s) | Path | Auth | Validation | Side Effects | Keep/Remove/Refine | Notes |
|-----------|------|------|------------|--------------|-------------------|-------|
| GET,POST | `/api/auth/[...nextauth]` | No | NextAuth | Session | **Keep** | NextAuth handler |
| POST | `/api/auth/register` | No | Zod | User creation | **Refine** | Add email verification |
| GET,POST | `/api/admin/*` | Yes (Admin) | Zod | Database | **Keep** | Admin operations |
| GET,POST | `/api/advertiser/*` | Yes (Advertiser) | Zod | Database | **Keep** | Advertiser operations |
| GET,POST | `/api/publisher/*` | Yes (Publisher) | Zod | Database | **Keep** | Publisher operations |
| GET,POST | `/api/track/*` | No | Basic | Database | **Refine** | Add rate limiting |
| GET | `/api/delivery` | No | Basic | None | **Keep** | Ad delivery |
| GET | `/api/health` | No | None | None | **Refine** | Add basic auth or remove |
| GET | `/api/reports/*` | Yes | Zod | Database | **Keep** | Reporting |

---

## Environment Matrix

| VAR | Client/Server | Used In | Required | Present in sample | Risk | Action |
|-----|---------------|---------|----------|-------------------|------|--------|
| `DATABASE_URL` | Server | Prisma, API routes | Yes | Yes | High | **Keep** - Required |
| `NEXTAUTH_SECRET` | Server | NextAuth | Yes | Yes | High | **Keep** - Required |
| `NEXTAUTH_URL` | Server | NextAuth | Yes | Yes | Medium | **Keep** - Required |
| `EMAIL_*` | Server | Email service | No | Yes | Medium | **Keep** - Optional |
| `STRIPE_*` | Server | Payments | No | Yes | High | **Keep** - Optional |
| `GOOGLE_*` | Server | OAuth | No | Yes | High | **Keep** - Optional |
| `NEXT_PUBLIC_APP_URL` | Client | Frontend | No | Yes | Low | **Keep** - Optional |
| `NEXT_PUBLIC_DEBUG_OVERLAY` | Client | DebugOverlay | No | No | Low | **Remove** - Dev only |
| `NEXT_PUBLIC_DISABLE_CLIENT_AUTH` | Client | RequireAuth | No | No | High | **Remove** - Security risk |
| `HEALTH_TOKEN` | Server | Health endpoint | No | No | Medium | **Add** - For health auth |

---

## Auth Review

### Providers Configured
- **Credentials**: ✅ Configured (with demo mode bypass)
- **Google OAuth**: ✅ Conditional (requires env vars)
- **Email**: ✅ Conditional (requires env vars)

### Session Strategy
- **Strategy**: JWT (not database sessions)
- **Demo Mode**: `lib/auth.ts:34-46` bypasses password validation
- **Role Boundaries**: Admin/Advertiser/Publisher properly separated

### Missing Guards
- Password validation skipped in `lib/auth.ts:57-58`
- Demo mode should be disabled in production
- Email verification not implemented

### Password Hashing Status
- **Registration**: ✅ Uses `bcrypt.hash(password, 12)` in `app/api/auth/register/route.ts:31`
- **Sign-in**: ❌ **MISSING** - `lib/auth.ts:57-58` skips password validation
- **Demo Mode**: ❌ **BYPASSES** - `lib/auth.ts:34-46` allows any credentials

---

## CORS & Security

### Current CORS Policy
- **Configuration**: `lib/cors.ts:6` - `allowedOrigins: ['*']`
- **Risk**: High - allows any domain to make requests
- **Applied to**: Track APIs, delivery endpoints
- **Action**: Restrict to specific publisher domains

### Security Headers
- **HSTS**: ✅ `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- **X-Frame-Options**: ✅ `DENY`
- **X-Content-Type-Options**: ✅ `nosniff`
- **Referrer-Policy**: ✅ `strict-origin-when-cross-origin`
- **CSP**: ✅ Comprehensive policy with `unsafe-inline` for MVP

### Rate Limiting
- **Implementation**: In-memory store in `src/middleware.ts`
- **Limits**: 60 req/min (default), 300 req/min (track APIs)
- **Persistence**: None (lost on restart)
- **Action**: Consider Redis for production

---

## Health & Rate Limiting

### Health Endpoint
- **Path**: `/api/health`
- **Current**: No authentication required
- **Response**: `{ ok: true, db: "connected" }`
- **Action**: Add `x-health-token` authentication

### Rate Limiting Implementation
- **Location**: `src/middleware.ts:4-20`
- **Store**: In-memory Map (not persistent)
- **Limits**: 60/min (default), 300/min (track APIs)
- **Headers**: `X-RateLimit-*` headers present
- **Action**: Add Redis persistence for production

---

## UI/UX Hotspots

### Broken/No-op Buttons
- `app/app/admin/users/page.tsx:42` - `alert()` for user filter
- `app/app/admin/users/page.tsx:46` - `alert()` for add user
- Multiple TODO handlers throughout admin pages

### Demo Components
- `components/DebugOverlay.tsx` - Debug overlay (remove in production)
- Demo mode bypasses in authentication

### TODO/FIXME Hotspots
- `app/api/auth/register/route.ts:47` - Email verification
- `app/auth/verified/page.tsx:15` - Role-based redirect
- `lib/cors.ts:6` - CORS domain restriction
- `app/legal/cookie-preferences/page.tsx:58` - Consent API

---

## Observability

### Logging
- **Standardization**: Mixed `console.log` usage
- **Levels**: No structured logging
- **Action**: Implement structured logging (Winston/Pino)

### Error Boundaries
- **Missing**: No error boundaries implemented
- **Action**: Add error boundaries for production

### Monitoring
- **Sentry**: Not configured
- **Health Checks**: Basic implementation
- **Action**: Add production monitoring

---

## Blocking Risks (Top 5)

### 1. Demo Mode Authentication Bypass
**File**: `lib/auth.ts:34-46`  
**Risk**: High - allows any credentials in development  
**Impact**: Complete authentication bypass  
**Fix**: Remove demo mode or guard with `NODE_ENV !== 'production'`

### 2. CORS Allows All Origins
**File**: `lib/cors.ts:6`  
**Risk**: High - any domain can make requests  
**Impact**: CSRF, data exfiltration  
**Fix**: Restrict to specific publisher domains

### 3. Debug Pages Exposed
**Files**: `app/debug/page.tsx`, `app/test-auth/page.tsx`  
**Risk**: Medium - information disclosure  
**Impact**: Session data, environment info  
**Fix**: Remove or guard behind production check

### 4. No Password Validation
**File**: `lib/auth.ts:57-58`  
**Risk**: High - authentication bypass  
**Impact**: Account takeover  
**Fix**: Implement `bcrypt.compare` for sign-in

### 5. Health Endpoint Unprotected
**File**: `app/api/health/route.ts`  
**Risk**: Medium - information disclosure  
**Impact**: Database status, system info  
**Fix**: Add `x-health-token` authentication

---

## Immediate Actions

### 1. Remove Demo Mode
```typescript
// lib/auth.ts:34-46
// Remove or guard with NODE_ENV check
if (DEMO_MODE && process.env.NODE_ENV !== 'production') {
  // Demo mode logic
}
```

### 2. Restrict CORS
```typescript
// lib/cors.ts:6
allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*']
```

### 3. Remove Debug Pages
```typescript
// app/debug/page.tsx, app/test-auth/page.tsx
// Delete files or add production guard
if (process.env.NODE_ENV === 'production') {
  notFound();
}
```

### 4. Implement Password Validation
```typescript
// lib/auth.ts:57-58
// Add bcrypt.compare for sign-in
const isValid = await bcrypt.compare(credentials.password, user.password);
if (!isValid) return null;
```

### 5. Protect Health Endpoint
```typescript
// app/api/health/route.ts
const healthToken = request.headers.get('x-health-token');
if (healthToken !== process.env.HEALTH_TOKEN) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## Acceptance Criteria

- [ ] No references to demo/bypass auth remain
- [ ] CORS no longer allows `*` in production; `ALLOWED_ORIGINS` supported
- [ ] `/api/health` requires `x-health-token`; returns `{ ok, db, time }`
- [ ] Password hashing/compare is enforced for credentials auth
- [ ] Error boundaries present (`app/error.tsx`, `app/global-error.tsx`)
- [ ] `scripts/enforce-prod.js` blocks debug/test files in prod
- [ ] Zero TypeScript errors; Next build succeeds locally
- [ ] No changes to Google OAuth (only notes and env checks)

---

## Next PRs

### Observability & Monitoring
- Configure Sentry for error tracking
- Implement structured logging with Pino
- Add Redis for rate limiting persistence
- Add health check metrics

### Security Enhancements
- Implement email verification flow
- Add 2FA support
- Enhance CSP with nonces
- Add request signing for sensitive APIs

### Performance & Scalability
- Add Redis caching layer
- Implement database connection pooling
- Add CDN for static assets
- Optimize bundle size

---

## What Changed in This PR

### Security Fixes
- **Removed debug pages**: Deleted `app/debug/page.tsx` and `app/test-auth/page.tsx`
- **Guarded debug overlay**: Added production check to `components/DebugOverlay.tsx`
- **Fixed CORS policy**: Updated `lib/cors.ts` to use `ALLOWED_ORIGINS` env var instead of wildcard
- **Protected health endpoint**: Added `x-health-token` authentication to `/api/health`
- **Fixed demo mode**: Added production guards to demo mode bypasses in `lib/auth.ts`
- **Fixed client auth bypass**: Added production check to `NEXT_PUBLIC_DISABLE_CLIENT_AUTH`
- **Implemented password validation**: Added `bcrypt.compare` for sign-in authentication

### Error Handling
- **Added error boundaries**: Created `app/error.tsx` and `app/global-error.tsx`
- **Structured logging**: Added `lib/logger.ts` with Pino and redaction
- **Updated error logging**: Replaced `console.error` with structured logging in key files

### Build Safety
- **Production enforcement**: Added `scripts/enforce-prod.js` to block debug files in production
- **Build hook**: Added `prebuild` script to run production checks
- **Environment variables**: Added `ALLOWED_ORIGINS` and `HEALTH_TOKEN` to env samples

### Testing
- **Smoke tests**: Added `tests/smoke.spec.ts` for basic functionality testing
- **Documentation**: Updated README with smoke test instructions

### Dependencies
- **Added Pino**: For structured logging with redaction

---

**Report Status**: Complete  
**PR Status**: Ready for review and merge
