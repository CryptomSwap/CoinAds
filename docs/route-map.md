# CoinAds Route Map

**Generated:** $(date)  
**Scope:** Complete page and API route inventory with authentication and status

## Page Routes

### Marketing & Public Pages
| Path | File | Auth Required | Status | Description |
|------|------|---------------|--------|-------------|
| `/` | `app/page.tsx` | ❌ | ✅ Working | Landing page with hero, features, CTA |
| `/about` | `app/about/page.tsx` | ❌ | ✅ Working | About page with company info |
| `/advertisers` | `app/advertisers/page.tsx` | ❌ | ✅ Working | Advertiser-focused landing page |
| `/publishers` | `app/publishers/page.tsx` | ❌ | ✅ Working | Publisher-focused landing page |
| `/ad-formats` | `app/ad-formats/page.tsx` | ❌ | ✅ Working | Ad formats showcase page |
| `/contact` | `app/contact/page.tsx` | ❌ | ✅ Working | Contact form page |
| `/health` | `app/health/page.tsx` | ❌ | ✅ Working | Health check page |

### Legal Pages
| Path | File | Auth Required | Status | Description |
|------|------|---------------|--------|-------------|
| `/legal/privacy` | `app/legal/privacy/page.tsx` | ❌ | ✅ Working | Privacy policy |
| `/legal/cookies` | `app/legal/cookies/page.tsx` | ❌ | ✅ Working | Cookie policy |
| `/legal/cookie-preferences` | `app/legal/cookie-preferences/page.tsx` | ❌ | ✅ Working | Cookie preferences |
| `/legal/advertiser-terms` | `app/legal/advertiser-terms/page.tsx` | ❌ | ✅ Working | Advertiser terms of service |
| `/legal/publisher-terms` | `app/legal/publisher-terms/page.tsx` | ❌ | ✅ Working | Publisher terms of service |

### Authentication Pages
| Path | File | Auth Required | Status | Description |
|------|------|---------------|--------|-------------|
| `/auth/signin` | `app/auth/signin/page.tsx` | ❌ | ✅ Working | Sign in form with Google OAuth |
| `/auth/signup` | `app/auth/signup/page.tsx` | ❌ | ✅ Working | Sign up form with role selection |
| `/auth/forgot-password` | `app/auth/forgot-password/page.tsx` | ❌ | ✅ Working | Password reset request |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | ❌ | ✅ Working | Password reset form |
| `/auth/verify-email` | `app/auth/verify-email/page.tsx` | ❌ | ✅ Working | Email verification |
| `/auth/verified` | `app/auth/verified/page.tsx` | ❌ | ✅ Working | Email verified confirmation |
| `/auth/link-expired` | `app/auth/link-expired/page.tsx` | ❌ | ✅ Working | Expired link page |

### Documentation
| Path | File | Auth Required | Status | Description |
|------|------|---------------|--------|-------------|
| `/docs/publisher-integration` | `app/docs/publisher-integration/page.tsx` | ❌ | ✅ Working | Publisher integration guide |

### App Dashboard (Protected)
| Path | File | Auth Required | Role | Status | Description |
|------|------|---------------|------|--------|-------------|
| `/app` | `app/app/page.tsx` | ✅ | Any | ✅ Working | Dashboard home with role-based content |
| `/app/profile` | `app/app/profile/page.tsx` | ✅ | Any | ✅ Working | User profile management |
| `/app/settings` | `app/app/settings/page.tsx` | ✅ | Any | ✅ Working | User settings |
| `/app/notifications` | `app/app/notifications/page.tsx` | ✅ | Any | ✅ Working | Notifications center |

### Advertiser Dashboard
| Path | File | Auth Required | Role | Status | Description |
|------|------|---------------|------|--------|-------------|
| `/app/advertiser/overview` | `app/app/advertiser/overview/page.tsx` | ✅ | ADVERTISER | ✅ Working | Advertiser dashboard overview |
| `/app/advertiser/campaigns` | `app/app/advertiser/campaigns/page.tsx` | ✅ | ADVERTISER | ✅ Working | Campaign management list |
| `/app/advertiser/campaigns/new` | `app/app/advertiser/campaigns/new/page.tsx` | ✅ | ADVERTISER | ✅ Working | Create new campaign |
| `/app/advertiser/campaigns/[id]` | `app/app/advertiser/campaigns/[id]/page.tsx` | ✅ | ADVERTISER | ✅ Working | Campaign details and editing |
| `/app/advertiser/campaigns/new/review` | `app/app/advertiser/campaigns/new/review/page.tsx` | ✅ | ADVERTISER | ✅ Working | Campaign review before submission |
| `/app/advertiser/creatives` | `app/app/advertiser/creatives/page.tsx` | ✅ | ADVERTISER | ✅ Working | Creative asset management |
| `/app/advertiser/reports` | `app/app/advertiser/reports/page.tsx` | ✅ | ADVERTISER | ✅ Working | Campaign performance reports |
| `/app/advertiser/billing` | `app/app/advertiser/billing/page.tsx` | ✅ | ADVERTISER | ✅ Working | Billing and payment management |
| `/app/advertiser/wallet` | `app/app/advertiser/wallet/page.tsx` | ✅ | ADVERTISER | ✅ Working | Wallet balance and transactions |
| `/app/advertiser/support` | `app/app/advertiser/support/page.tsx` | ✅ | ADVERTISER | ✅ Working | Support ticket system |

### Publisher Dashboard
| Path | File | Auth Required | Role | Status | Description |
|------|------|---------------|------|--------|-------------|
| `/app/publisher/overview` | `app/app/publisher/overview/page.tsx` | ✅ | PUBLISHER | ✅ Working | Publisher dashboard overview |
| `/app/publisher/sites` | `app/app/publisher/sites/page.tsx` | ✅ | PUBLISHER | ✅ Working | Site management list |
| `/app/publisher/sites/new` | `app/app/publisher/sites/new/page.tsx` | ✅ | PUBLISHER | ✅ Working | Add new site |
| `/app/publisher/sites/[id]/verify` | `app/app/publisher/sites/[id]/verify/page.tsx` | ✅ | PUBLISHER | ✅ Working | Site verification process |
| `/app/publisher/placements` | `app/app/publisher/placements/page.tsx` | ✅ | PUBLISHER | ✅ Working | Ad placement management |
| `/app/publisher/ad-tags` | `app/app/publisher/ad-tags/page.tsx` | ✅ | PUBLISHER | ✅ Working | Ad tag generation |
| `/app/publisher/earnings` | `app/app/publisher/earnings/page.tsx` | ✅ | PUBLISHER | ✅ Working | Earnings dashboard |
| `/app/publisher/payouts` | `app/app/publisher/payouts/page.tsx` | ✅ | PUBLISHER | ✅ Working | Payout management |
| `/app/publisher/reports` | `app/app/publisher/reports/page.tsx` | ✅ | PUBLISHER | ✅ Working | Performance reports |
| `/app/publisher/support` | `app/app/publisher/support/page.tsx` | ✅ | PUBLISHER | ✅ Working | Support ticket system |

### Admin Dashboard
| Path | File | Auth Required | Role | Status | Description |
|------|------|---------------|------|--------|-------------|
| `/app/admin/overview` | `app/app/admin/overview/page.tsx` | ✅ | ADMIN | ✅ Working | Admin dashboard overview |
| `/app/admin/users` | `app/app/admin/users/page.tsx` | ✅ | ADMIN | ✅ Working | User management |
| `/app/admin/approvals` | `app/app/admin/approvals/page.tsx` | ✅ | ADMIN | ✅ Working | Approval queue management |
| `/app/admin/transactions` | `app/app/admin/transactions/page.tsx` | ✅ | ADMIN | ✅ Working | Transaction monitoring |
| `/app/admin/delivery` | `app/app/admin/delivery/page.tsx` | ✅ | ADMIN | ✅ Working | Ad delivery monitoring |
| `/app/admin/logs` | `app/app/admin/logs/page.tsx` | ✅ | ADMIN | ✅ Working | System logs viewer |
| `/app/admin/pricing` | `app/app/admin/pricing/page.tsx` | ✅ | ADMIN | ✅ Working | Pricing management |

## API Routes

### Authentication APIs
| Method | Path | File | Auth Required | Status | Description |
|--------|------|------|---------------|--------|-------------|
| POST | `/api/auth/register` | `app/api/auth/register/route.ts` | ❌ | ✅ Working | User registration with role selection |
| POST | `/api/auth/reset-password` | `app/api/auth/reset-password/route.ts` | ❌ | ✅ Working | Password reset functionality |
| GET/POST | `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | ❌ | ✅ Working | NextAuth.js authentication |

### User Management APIs
| Method | Path | File | Auth Required | Status | Description |
|--------|------|------|---------------|--------|-------------|
| POST | `/api/user/settings` | `app/api/user/settings/route.ts` | ✅ | ✅ Working | Update user settings |

### Advertiser APIs
| Method | Path | File | Auth Required | Role | Status | Description |
|--------|------|------|---------------|------|--------|-------------|
| GET | `/api/advertiser/campaigns` | `app/api/advertiser/campaigns/route.ts` | ✅ | ADVERTISER | ✅ Working | List advertiser campaigns |
| POST | `/api/advertiser/campaigns` | `app/api/advertiser/campaigns/route.ts` | ✅ | ADVERTISER | ✅ Working | Create new campaign |
| GET | `/api/advertiser/campaigns/[id]` | `app/api/advertiser/campaigns/[id]/route.ts` | ✅ | ADVERTISER | ✅ Working | Get campaign details |
| PUT | `/api/advertiser/campaigns/[id]` | `app/api/advertiser/campaigns/[id]/route.ts` | ✅ | ADVERTISER | ✅ Working | Update campaign |
| DELETE | `/api/advertiser/campaigns/[id]` | `app/api/advertiser/campaigns/[id]/route.ts` | ✅ | ADVERTISER | ✅ Working | Delete campaign |
| GET | `/api/advertiser/wallet` | `app/api/advertiser/wallet/route.ts` | ✅ | ADVERTISER | ✅ Working | Get wallet balance and transactions |

### Publisher APIs
| Method | Path | File | Auth Required | Role | Status | Description |
|--------|------|------|---------------|------|--------|-------------|
| GET | `/api/publisher/sites` | `app/api/publisher/sites/route.ts` | ✅ | PUBLISHER | ✅ Working | List publisher sites |
| POST | `/api/publisher/sites` | `app/api/publisher/sites/route.ts` | ✅ | PUBLISHER | ✅ Working | Create new site |
| GET | `/api/publisher/sites/[id]` | `app/api/publisher/sites/[id]/route.ts` | ✅ | PUBLISHER | ✅ Working | Get site details |
| PUT | `/api/publisher/sites/[id]` | `app/api/publisher/sites/[id]/route.ts` | ✅ | PUBLISHER | ✅ Working | Update site |
| DELETE | `/api/publisher/sites/[id]` | `app/api/publisher/sites/[id]/route.ts` | ✅ | PUBLISHER | ✅ Working | Delete site |
| GET | `/api/publisher/placements` | `app/api/publisher/placements/route.ts` | ✅ | PUBLISHER | ✅ Working | List placements |
| POST | `/api/publisher/placements` | `app/api/publisher/placements/route.ts` | ✅ | PUBLISHER | ✅ Working | Create placement |
| GET | `/api/publisher/placements/[id]` | `app/api/publisher/placements/[id]/route.ts` | ✅ | PUBLISHER | ✅ Working | Get placement details |
| PATCH | `/api/publisher/placements/[id]` | `app/api/publisher/placements/[id]/route.ts` | ✅ | PUBLISHER | ✅ Working | Update placement |
| DELETE | `/api/publisher/placements/[id]` | `app/api/publisher/placements/[id]/route.ts` | ✅ | PUBLISHER | ✅ Working | Delete placement |
| GET | `/api/publisher/earnings` | `app/api/publisher/earnings/route.ts` | ✅ | PUBLISHER | ✅ Working | Get earnings data |

### Admin APIs
| Method | Path | File | Auth Required | Role | Status | Description |
|--------|------|------|---------------|------|--------|-------------|
| GET | `/api/admin/approvals` | `app/api/admin/approvals/route.ts` | ✅ | ADMIN | ✅ Working | Get pending approvals |
| POST | `/api/admin/approvals` | `app/api/admin/approvals/route.ts` | ✅ | ADMIN | ✅ Working | Approve/reject items |
| GET | `/api/admin/logs` | `app/api/admin/logs/route.ts` | ✅ | ADMIN | ✅ Working | Get admin logs |

### Tracking APIs
| Method | Path | File | Auth Required | Status | Description |
|--------|------|------|---------------|--------|-------------|
| POST | `/api/track/imp` | `app/api/track/imp/route.ts` | ❌ | ✅ Working | Track ad impressions |
| GET | `/api/track/click` | `app/api/track/click/route.ts` | ❌ | ✅ Working | Track ad clicks |
| POST | `/api/track/conversion` | `app/api/track/conversion/route.ts` | ❌ | ✅ Working | Track conversions |

### Reporting APIs
| Method | Path | File | Auth Required | Role | Status | Description |
|--------|------|------|---------------|------|--------|-------------|
| GET | `/api/reports/advertiser` | `app/api/reports/advertiser/route.ts` | ✅ | ADVERTISER | ✅ Working | Advertiser reports |
| GET | `/api/reports/advertiser.csv` | `app/api/reports/advertiser.csv/route.ts` | ✅ | ADVERTISER | ✅ Working | CSV export for reports |

### Utility APIs
| Method | Path | File | Auth Required | Status | Description |
|--------|------|------|---------------|--------|-------------|
| GET | `/api/health` | `app/api/health/route.ts` | 🔒 Token | ✅ Working | Health check with database connectivity |
| POST | `/api/support` | `app/api/support/route.ts` | ✅ | ✅ Working | Submit support tickets |
| GET | `/api/delivery` | `app/api/delivery/route.ts` | ✅ | ✅ Working | Ad delivery status |

### Development APIs
| Method | Path | File | Auth Required | Status | Description |
|--------|------|------|---------------|--------|-------------|
| POST | `/api/dev/seed-admin` | `app/api/dev/seed-admin/route.ts` | 🔒 Dev Only | ✅ Working | Seed admin user (development only) |
| GET | `/api/debug/email` | `app/api/debug/email/route.ts` | 🔒 Dev Only | ✅ Working | Email configuration debug |

### Special Routes
| Method | Path | File | Auth Required | Status | Description |
|--------|------|------|---------------|--------|-------------|
| GET | `/c` | `app/c/route.ts` | ❌ | ✅ Working | Click tracking redirect |

## Authentication & Authorization

### Middleware Protection
- **Path:** `/app/*` - All app routes protected by middleware
- **Implementation:** `middleware.ts` with fail-open strategy
- **Client-side:** `RequireAuth` component for role-based access

### Role-Based Access Control (RBAC)
- **ADVERTISER:** Campaign management, creatives, reports, billing
- **PUBLISHER:** Site management, placements, earnings, payouts
- **ADMIN:** User management, approvals, system monitoring

### Session Strategy
- **Type:** JWT with database adapter
- **Provider:** NextAuth.js with Credentials + Google OAuth
- **Security:** Password hashing with bcrypt, email verification ready

## Status Legend
- ✅ **Working:** Fully functional and tested
- ⚠️ **Partial:** Some functionality missing or TODO items
- ❌ **Broken:** Non-functional or has critical issues
- 🔒 **Protected:** Requires authentication or special tokens
- 🚧 **In Progress:** Currently being developed

## Notes
- All app routes require authentication
- Role-based access is enforced at both API and UI levels
- Development APIs are production-guarded
- Health endpoint requires special token
- Tracking APIs are public for ad delivery
- Support system uses AdminLog for internal tracking
