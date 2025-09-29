# Mock Data Removal Inventory

This document catalogs all mock/demo/sample data sources found in the CoinAds codebase that need to be removed or refactored.

## Summary

**Total files with mock patterns: 96**
**Critical mock sources: 7 files**
**Demo mode flags: 9 files**

## Mock Data Sources by Category

### 1. API Routes with Demo Mode Fallbacks

| Path | Symbol(s) | Type | Used By | Keep/Remove | Rationale |
|------|-----------|------|---------|-------------|-----------|
| `app/api/publisher/sites/route.ts` | `DEMO_MODE`, `mockSites` | inline | Publisher sites API | **REMOVE** | Demo mode bypasses DB, returns mock data |
| `app/api/publisher/earnings/route.ts` | `DEMO_MODE`, `mockEarningsData`, `mockPayouts` | inline | Publisher earnings API | **REMOVE** | Demo mode returns fake earnings data |
| `app/api/advertiser/campaigns/route.ts` | `DEMO_MODE`, `mockCampaigns` | inline | Advertiser campaigns API | **REMOVE** | Demo mode returns fake campaign data |
| `app/api/advertiser/wallet/route.ts` | `DEMO_MODE`, `mockWallet`, `mockOrganization` | inline | Advertiser wallet API | **REMOVE** | Demo mode returns fake wallet/transaction data |

### 2. Seed Scripts with Demo Data

| Path | Symbol(s) | Type | Used By | Keep/Remove | Rationale |
|------|-----------|------|---------|-------------|-----------|
| `prisma/seed.ts` | `alice@demo.com`, `bob@demo.com`, demo transactions, sample impressions | inline | Database seeding | **REFACTOR** | Contains demo users, fake transactions, sample data |
| `scripts/dev-seed.ts` | Demo users, sample campaigns, fake impressions/clicks | inline | Development seeding | **REMOVE** | Pure demo data, not needed in production |
| `scripts/seed-partner-inventory.ts` | `demo@advertiser.com`, `demo@publisher.com` | inline | Partner seeding | **REFACTOR** | Contains demo users but also real partner data |

### 3. Debug/Development Components

| Path | Symbol(s) | Type | Used By | Keep/Remove | Rationale |
|------|-----------|------|---------|-------------|-----------|
| `components/DebugOverlay.tsx` | `NEXT_PUBLIC_DEBUG_OVERLAY`, `NEXT_PUBLIC_DISABLE_CLIENT_AUTH` | component | Development debugging | **KEEP** | Already guarded by `NODE_ENV !== 'production'` |

### 4. Environment Configuration

| Path | Symbol(s) | Type | Used By | Keep/Remove | Rationale |
|------|-----------|------|---------|-------------|-----------|
| `lib/env/server.ts` | `isDevelopment` | helper | API routes, seed scripts | **KEEP** | Legitimate environment detection |

### 5. Test Files (KEEP - Test Environment Only)

| Path | Symbol(s) | Type | Used By | Keep/Remove | Rationale |
|------|-----------|------|---------|-------------|-----------|
| `tests/**/*.spec.ts` | Various mock patterns | test files | Jest/Playwright tests | **KEEP** | Test-only mocks, properly scoped |

## Publishers Catalog (KEEP - Real Data)

The following files contain the **real publishers catalog** that should be preserved:

| Path | Content | Status |
|------|---------|--------|
| `scripts/seed-partner-inventory.ts` | Real partner sites (coinranking.com, cryptodaily.co.uk) | **KEEP** |
| Partner placements data | Real placement sizes, pricing types | **KEEP** |

## Mock Data Patterns Found

### 1. Demo Mode Flags
- `DEMO_MODE = isDevelopment` in API routes
- `NEXT_PUBLIC_DEBUG_OVERLAY` in DebugOverlay
- `NEXT_PUBLIC_DISABLE_CLIENT_AUTH` in DebugOverlay

### 2. Mock Data Objects
- `mockSites` - Fake site data with demo domains
- `mockCampaigns` - Fake campaign data with sample budgets
- `mockEarningsData` - Fake earnings with random impressions/clicks
- `mockWallet` - Fake wallet balance and transactions
- `mockPayouts` - Fake payout history

### 3. Demo User Accounts
- `alice@demo.com` (ADVERTISER)
- `bob@demo.com` (PUBLISHER) 
- `demo@advertiser.com`
- `demo@publisher.com`
- `admin@coinads.com` (keep as real admin)

### 4. Sample/Fake Data
- 100 fake impressions with random countries/devices
- Fake clicks with 2% CTR
- Sample transactions (deposits, payouts)
- Mock creatives with placeholder images
- Fake reports with random metrics

## Action Plan

### Phase 1: Remove API Mock Fallbacks
1. Remove `DEMO_MODE` checks from all API routes
2. Ensure all APIs query database only
3. Add proper error handling for empty results

### Phase 2: Refactor Seed Scripts
1. Create minimal `prisma/seed.ts` with:
   - Admin user from env vars
   - Publishers catalog (sites + placements)
   - No demo users or fake data
2. Remove `scripts/dev-seed.ts`
3. Refactor `scripts/seed-partner-inventory.ts` to remove demo users

### Phase 3: Environment Cleanup
1. Remove `NEXT_PUBLIC_DEBUG_OVERLAY` from production
2. Keep `DebugOverlay` component but ensure it's dev-only
3. Update env validation schemas

### Phase 4: UI Empty States
1. Replace mock data fallbacks with proper empty states
2. Add loading skeletons
3. Remove fake KPI cards

### Phase 5: Test Updates
1. Create test factories for database seeding
2. Update tests to use real DB with test data
3. Ensure no production code imports test mocks

## Files to Delete
- `scripts/dev-seed.ts` (pure demo data)

## Files to Refactor
- `prisma/seed.ts` (remove demo data, keep admin + publishers)
- `scripts/seed-partner-inventory.ts` (remove demo users, keep partners)
- All API routes with `DEMO_MODE` fallbacks

## Files to Keep
- `components/DebugOverlay.tsx` (already properly guarded)
- `lib/env/server.ts` (legitimate environment detection)
- All test files (properly scoped to test environment)
- Publishers catalog data (real partner sites and placements)
