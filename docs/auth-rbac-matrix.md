# CoinAds Authentication & RBAC Matrix

**Generated:** $(date)  
**Authentication:** NextAuth.js with JWT strategy  
**RBAC:** Three-tier role system with granular permissions

## Authentication Providers

### 1. Credentials Provider
- **Type:** Email/Password authentication
- **Implementation:** `lib/auth.ts` - CredentialsProvider
- **Password Hashing:** bcrypt with 12 rounds
- **Validation:** Zod schema validation
- **Status:** ✅ Production Ready

### 2. Google OAuth Provider
- **Type:** Google OAuth 2.0
- **Implementation:** `lib/auth.ts` - GoogleProvider
- **Configuration:** Conditional (requires GOOGLE_CLIENT_ID/SECRET)
- **User Creation:** Automatic account creation/linking
- **Status:** ✅ Production Ready (Optional)

### 3. Email Provider
- **Type:** Magic link authentication
- **Implementation:** `lib/auth.ts` - EmailProvider
- **Configuration:** Conditional (requires email server config)
- **Status:** ✅ Production Ready (Optional)

## Session Strategy

### JWT Configuration
- **Strategy:** JWT (not database sessions)
- **Secret:** NEXTAUTH_SECRET environment variable
- **Adapter:** PrismaAdapter for user management
- **Session Callback:** Database lookup for role validation
- **JWT Callback:** Role and user ID in token

### Session Security
- **CSRF Protection:** Built-in NextAuth.js protection
- **Session Timeout:** Default NextAuth.js behavior
- **Token Refresh:** Automatic token refresh
- **Secure Cookies:** HTTPS-only in production

## Role-Based Access Control (RBAC)

### Role Definitions

| Role | Description | Access Level | Database Value |
|------|-------------|--------------|----------------|
| **ADVERTISER** | Campaign creators and managers | Campaign management, creatives, reports, billing | `ADVERTISER` |
| **PUBLISHER** | Website owners and content creators | Site management, placements, earnings, payouts | `PUBLISHER` |
| **ADMIN** | System administrators | User management, approvals, system monitoring | `ADMIN` |

### Role Context Implementation
- **Provider:** `contexts/RoleContext.tsx`
- **Hook:** `useRole()` for component access
- **State Management:** React Context with session integration
- **Role Switching:** Automatic based on session data

## Page-Level Access Control

### Public Pages (No Authentication Required)
```
/ (landing)
/about
/advertisers
/publishers
/ad-formats
/contact
/health
/legal/*
/auth/*
/docs/*
```

### Protected Pages (Authentication Required)
```
/app/* (all app routes)
```

### Role-Specific Pages

#### ADVERTISER Pages
```
/app/advertiser/overview
/app/advertiser/campaigns
/app/advertiser/campaigns/new
/app/advertiser/campaigns/[id]
/app/advertiser/campaigns/new/review
/app/advertiser/creatives
/app/advertiser/reports
/app/advertiser/billing
/app/advertiser/wallet
/app/advertiser/support
```

#### PUBLISHER Pages
```
/app/publisher/overview
/app/publisher/sites
/app/publisher/sites/new
/app/publisher/sites/[id]/verify
/app/publisher/placements
/app/publisher/ad-tags
/app/publisher/earnings
/app/publisher/payouts
/app/publisher/reports
/app/publisher/support
```

#### ADMIN Pages
```
/app/admin/overview
/app/admin/users
/app/admin/approvals
/app/admin/transactions
/app/admin/delivery
/app/admin/logs
/app/admin/pricing
```

## API-Level Access Control

### Public APIs (No Authentication Required)
```
POST /api/auth/register
POST /api/auth/reset-password
GET/POST /api/auth/[...nextauth]
POST /api/track/imp
GET /api/track/click
POST /api/track/conversion
GET /c (click redirect)
```

### Protected APIs (Authentication Required)

#### ADVERTISER APIs
```
GET /api/advertiser/campaigns
POST /api/advertiser/campaigns
GET /api/advertiser/campaigns/[id]
PUT /api/advertiser/campaigns/[id]
DELETE /api/advertiser/campaigns/[id]
GET /api/advertiser/wallet
GET /api/reports/advertiser
GET /api/reports/advertiser.csv
```

#### PUBLISHER APIs
```
GET /api/publisher/sites
POST /api/publisher/sites
GET /api/publisher/sites/[id]
PUT /api/publisher/sites/[id]
DELETE /api/publisher/sites/[id]
GET /api/publisher/placements
POST /api/publisher/placements
GET /api/publisher/placements/[id]
PATCH /api/publisher/placements/[id]
DELETE /api/publisher/placements/[id]
GET /api/publisher/earnings
```

#### ADMIN APIs
```
GET /api/admin/approvals
POST /api/admin/approvals
GET /api/admin/logs
```

#### Universal APIs (Any Authenticated User)
```
POST /api/user/settings
POST /api/support
GET /api/delivery
```

### Special Access APIs

#### Token-Protected APIs
```
GET /api/health (requires x-health-token header)
```

#### Development-Only APIs
```
POST /api/dev/seed-admin (development environment only)
GET /api/debug/email (development environment only)
```

## Authorization Implementation

### Server-Side Authorization
- **Middleware:** `middleware.ts` - Route protection
- **API Routes:** `getServerSession(authOptions)` for session validation
- **Role Checks:** Direct role comparison in API handlers
- **Database Queries:** User ID filtering for data access

### Client-Side Authorization
- **Component:** `RequireAuth.tsx` - Route protection
- **Layout:** `app/app/layout.tsx` - App-wide protection
- **Role Context:** `RoleContext.tsx` - Role-based UI rendering
- **Redirects:** Automatic redirect to sign-in for unauthenticated users

### Authorization Patterns

#### 1. Route Protection
```typescript
// middleware.ts
export const config = {
  matcher: ['/app/:path*'],
};

// app/app/layout.tsx
if (!session) {
  redirect("/auth/signin");
}
```

#### 2. API Authorization
```typescript
// API route example
const session = await getServerSession(authOptions);
if (!session?.user || session.user.role !== "ADVERTISER") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

#### 3. Component-Level Authorization
```typescript
// Component example
const { currentRole } = useRole();
if (currentRole !== "admin") {
  return <div>Access denied</div>;
}
```

## Security Measures

### Password Security
- **Hashing:** bcrypt with 12 rounds
- **Validation:** Minimum 8 characters, uppercase, lowercase, number
- **Storage:** Hashed passwords only, never plain text
- **OAuth Users:** No password required (null in database)

### Session Security
- **JWT Strategy:** Stateless tokens with database validation
- **Secret Management:** Environment variable protection
- **Token Expiration:** Default NextAuth.js behavior
- **Secure Cookies:** HTTPS-only in production

### Input Validation
- **Zod Schemas:** All API inputs validated
- **Type Safety:** TypeScript for compile-time checks
- **SQL Injection:** Prisma ORM protection
- **XSS Prevention:** React's built-in protection

### Access Control
- **Role-Based:** Three-tier role system
- **Resource-Based:** User ID filtering for data access
- **API Protection:** Server-side session validation
- **Route Protection:** Middleware and component guards

## Authentication Flow

### 1. User Registration
```
POST /api/auth/register
├── Validate input (Zod)
├── Check email uniqueness
├── Hash password (bcrypt)
├── Create user in database
├── Return success response
└── TODO: Send verification email
```

### 2. User Sign-In
```
POST /api/auth/signin
├── Validate credentials
├── Check user exists
├── Verify password (bcrypt)
├── Create JWT session
├── Return user data
└── Redirect to /app
```

### 3. OAuth Flow
```
GET /api/auth/signin/google
├── Redirect to Google OAuth
├── Handle OAuth callback
├── Create/update user in database
├── Create JWT session
└── Redirect to /app
```

### 4. Session Validation
```
Every API request:
├── Extract JWT token
├── Validate token signature
├── Lookup user in database
├── Check user role
└── Allow/deny access
```

## Security Considerations

### Production Readiness
- ✅ **Password Hashing:** bcrypt with appropriate rounds
- ✅ **Session Security:** JWT with secret management
- ✅ **Input Validation:** Zod schemas for all inputs
- ✅ **Role-Based Access:** Comprehensive RBAC implementation
- ✅ **Route Protection:** Middleware and component guards
- ✅ **API Authorization:** Server-side session validation

### Areas for Improvement
- ⚠️ **Email Verification:** Not implemented (MVP assumption)
- ⚠️ **Password Reset:** Basic implementation, needs enhancement
- ⚠️ **Account Lockout:** No failed attempt protection
- ⚠️ **Two-Factor Auth:** Not implemented
- ⚠️ **Session Timeout:** Default behavior, may need customization

### Security Headers
- **CORS:** Configured with allow-list
- **CSRF:** NextAuth.js built-in protection
- **XSS:** React's built-in protection
- **Content Security Policy:** Not explicitly configured

## Error Handling

### Authentication Errors
- **Invalid Credentials:** 401 Unauthorized
- **Missing Session:** Redirect to sign-in
- **Invalid Role:** 403 Forbidden
- **Token Expired:** Automatic refresh or re-authentication

### Authorization Errors
- **Insufficient Permissions:** 403 Forbidden
- **Resource Not Found:** 404 Not Found
- **Validation Errors:** 400 Bad Request with details

## Monitoring & Logging

### Authentication Logs
- **Sign-in Attempts:** Logged in AdminLog
- **Failed Attempts:** Not currently tracked
- **OAuth Events:** NextAuth.js internal logging
- **Session Events:** NextAuth.js internal logging

### Authorization Logs
- **Admin Actions:** Logged in AdminLog
- **API Access:** Not currently tracked
- **Role Changes:** Not currently tracked
- **Permission Denials:** Not currently tracked

## Development vs Production

### Development Features
- **Debug Routes:** `/api/debug/*` (production-guarded)
- **Seed Admin:** `/api/dev/seed-admin` (development only)
- **Client Auth Bypass:** `NEXT_PUBLIC_DISABLE_CLIENT_AUTH=1`

### Production Considerations
- **Environment Variables:** All required vars must be set
- **HTTPS:** Required for secure cookies
- **Secret Management:** Secure NEXTAUTH_SECRET
- **Database Security:** Proper connection string protection
