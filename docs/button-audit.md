# CoinAds Button Audit Report

**Generated**: 2025-09-28
**Total Controls**: 539

## Summary

**Total Controls Found**: 539

### By Status
- ⚠️: 88
- ✅: 130
- 🔒: 321

### By Area
- Marketing: 20
- Other: 168
- Admin: 93
- Advertiser: 97
- App: 10
- Publisher: 73
- Auth: 47
- Legal: 31

## Top 10 Fixes (by Impact)

1. **app\auth\signin\page.tsx** (12 issues)
   - Status: ⚠️
   - Recommendation: Implement missing functionality or remove placeholder
   - Example: "Unknown"

2. **components\app\wallet-drawer.tsx** (9 issues)
   - Status: ⚠️
   - Recommendation: Implement missing functionality or remove placeholder
   - Example: "Unknown"

3. **app\advertisers\page.tsx** (8 issues)
   - Status: ⚠️
   - Recommendation: Implement missing functionality or remove placeholder
   - Example: "Unknown"

4. **app\ad-formats\page.tsx** (7 issues)
   - Status: ⚠️
   - Recommendation: Implement missing functionality or remove placeholder
   - Example: "Unknown"

5. **app\legal\cookie-preferences\page.tsx** (6 issues)
   - Status: ⚠️
   - Recommendation: Implement missing functionality or remove placeholder
   - Example: "Unknown"

6. **app\auth\reset-password\page.tsx** (5 issues)
   - Status: ⚠️
   - Recommendation: Implement missing functionality or remove placeholder
   - Example: "Unknown"

7. **app\contact\page.tsx** (5 issues)
   - Status: ⚠️
   - Recommendation: Implement missing functionality or remove placeholder
   - Example: "Unknown"

8. **components\marketing\Hero.tsx** (5 issues)
   - Status: ⚠️
   - Recommendation: Implement missing functionality or remove placeholder
   - Example: "Unknown"

9. **components\app\top-up-modal.tsx** (3 issues)
   - Status: ⚠️
   - Recommendation: Implement missing functionality or remove placeholder
   - Example: "Unknown"

10. **components\cookie\CookiePreferences.tsx** (3 issues)
   - Status: ⚠️
   - Recommendation: Implement missing functionality or remove placeholder
   - Example: "Unknown"

## Per-Screen Matrix

### /about

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\about\page.tsx:90 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\about\page.tsx:95 | Authenticated | navigate | navigate | /auth/signup?role=advertiser | ✅ |  |
| Unknown | Button | app\about\page.tsx:100 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\about\page.tsx:106 | Authenticated | navigate | navigate | /auth/signup?role=publisher | ✅ |  |

### /ad-formats

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Link | app\ad-formats\page.tsx:100 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\ad-formats\page.tsx:107 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | app\ad-formats\page.tsx:114 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\ad-formats\page.tsx:115 | Authenticated | navigate | navigate | /auth/signin | ✅ |  |
| Unknown | Button | app\ad-formats\page.tsx:135 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\ad-formats\page.tsx:136 | Authenticated | navigate | navigate | /auth/signup?role=advertiser | ✅ |  |
| Unknown | Button | app\ad-formats\page.tsx:141 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\ad-formats\page.tsx:142 | Authenticated | navigate | navigate | /contact | ✅ |  |
| Unknown | Button | app\ad-formats\page.tsx:289 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\ad-formats\page.tsx:290 | Authenticated | navigate | navigate | /auth/signup?role=advertiser | ✅ |  |
| Unknown | Button | app\ad-formats\page.tsx:294 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\ad-formats\page.tsx:295 | Authenticated | navigate | navigate | /contact | ✅ |  |
| For Advertisers | Link | app\ad-formats\page.tsx:317 | Authenticated | navigate | navigate | /advertisers | ✅ |  |
| For Publishers | Link | app\ad-formats\page.tsx:318 | Authenticated | navigate | navigate | /publishers | ✅ |  |
| Ad Formats | Link | app\ad-formats\page.tsx:319 | Authenticated | navigate | navigate | /ad-formats | ✅ |  |
| About | Link | app\ad-formats\page.tsx:325 | Authenticated | navigate | navigate | /about | ✅ |  |
| Contact | Link | app\ad-formats\page.tsx:326 | Authenticated | navigate | navigate | /contact | ✅ |  |
| Privacy | Link | app\ad-formats\page.tsx:327 | Authenticated | navigate | navigate | /legal/privacy | ✅ |  |
| Advertiser Terms | Link | app\ad-formats\page.tsx:333 | Authenticated | navigate | navigate | /legal/advertiser-terms | ✅ |  |
| Publisher Terms | Link | app\ad-formats\page.tsx:334 | Authenticated | navigate | navigate | /legal/publisher-terms | ✅ |  |
| Cookie Policy | Link | app\ad-formats\page.tsx:335 | Authenticated | navigate | navigate | /legal/cookies | ✅ |  |

### /advertisers

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Link | app\advertisers\page.tsx:127 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\advertisers\page.tsx:133 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\advertisers\page.tsx:139 | Authenticated | navigate | navigate | /auth/signin | ✅ |  |
| Unknown | Button | app\advertisers\page.tsx:140 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\advertisers\page.tsx:159 | Authenticated | navigate | navigate | /auth/signin | ✅ |  |
| Unknown | Button | app\advertisers\page.tsx:160 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\advertisers\page.tsx:165 | Authenticated | navigate | navigate | /contact | ✅ |  |
| Unknown | Button | app\advertisers\page.tsx:166 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | app\advertisers\page.tsx:328 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\advertisers\page.tsx:400 | Authenticated | navigate | navigate | /auth/signin | ✅ |  |
| Unknown | Button | app\advertisers\page.tsx:401 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | app\advertisers\page.tsx:405 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\advertisers\page.tsx:412 | Authenticated | navigate | navigate | /contact?subject=Schedule%20Demo | ✅ |  |
| For Advertisers | Link | app\advertisers\page.tsx:433 | Authenticated | navigate | navigate | /advertisers | ✅ |  |
| For Publishers | Link | app\advertisers\page.tsx:434 | Authenticated | navigate | navigate | /publishers | ✅ |  |
| Ad Formats | Link | app\advertisers\page.tsx:435 | Authenticated | navigate | navigate | /ad-formats | ✅ |  |
| About | Link | app\advertisers\page.tsx:441 | Authenticated | navigate | navigate | /about | ✅ |  |
| Contact | Link | app\advertisers\page.tsx:442 | Authenticated | navigate | navigate | /contact | ✅ |  |
| Privacy | Link | app\advertisers\page.tsx:443 | Authenticated | navigate | navigate | /legal/privacy | ✅ |  |
| Advertiser Terms | Link | app\advertisers\page.tsx:449 | Authenticated | navigate | navigate | /legal/advertiser-terms | ✅ |  |
| Publisher Terms | Link | app\advertisers\page.tsx:450 | Authenticated | navigate | navigate | /legal/publisher-terms | ✅ |  |
| Cookie Policy | Link | app\advertisers\page.tsx:451 | Authenticated | navigate | navigate | /legal/cookies | ✅ |  |

### /app/admin/approvals

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\admin\approvals\page.tsx:265 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:267 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:288 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:290 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:296 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:298 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:363 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:366 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:375 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:378 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:487 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:490 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:495 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:499 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:504 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:508 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:545 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:549 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:553 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:558 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:562 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:580 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:584 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:588 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:593 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:597 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:628 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:632 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:636 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:641 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:645 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:663 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:667 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:671 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:676 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:680 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:714 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:718 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:722 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:727 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:731 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:752 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:756 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:760 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:765 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:769 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:838 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:840 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:844 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:846 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:854 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:856 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:895 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:897 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\approvals\page.tsx:905 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\approvals\page.tsx:907 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/admin/delivery

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\admin\delivery\page.tsx:198 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\delivery\page.tsx:200 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\delivery\page.tsx:206 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/admin/logs

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\admin\logs\page.tsx:231 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\logs\page.tsx:233 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\logs\page.tsx:253 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\logs\page.tsx:255 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\logs\page.tsx:327 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\logs\page.tsx:330 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\logs\page.tsx:334 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\logs\page.tsx:337 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\logs\page.tsx:465 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\logs\page.tsx:468 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\logs\page.tsx:474 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\logs\page.tsx:477 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/admin/overview

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\admin\overview\page.tsx:315 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\admin\overview\page.tsx:316 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\overview\page.tsx:329 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\admin\overview\page.tsx:330 | Authenticated | unknown | unknown | /app/admin/approvals | 🔒 |  |
| Unknown | Button | app\app\admin\overview\page.tsx:368 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\admin\overview\page.tsx:369 | Authenticated | unknown | unknown | /app/admin/approvals | 🔒 |  |
| Unknown | Button | app\app\admin\overview\page.tsx:374 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\admin\overview\page.tsx:375 | Authenticated | unknown | unknown | /app/admin/delivery | 🔒 |  |
| Unknown | Button | app\app\admin\overview\page.tsx:380 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\admin\overview\page.tsx:381 | Authenticated | unknown | unknown | /app/admin/transactions | 🔒 |  |
| Unknown | Button | app\app\admin\overview\page.tsx:386 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\admin\overview\page.tsx:387 | Authenticated | unknown | unknown | /app/admin/users | 🔒 |  |

### /app/admin/pricing

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\admin\pricing\page.tsx:214 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\pricing\page.tsx:216 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\pricing\page.tsx:221 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\pricing\page.tsx:224 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\pricing\page.tsx:240 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\admin\pricing\page.tsx:243 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/admin/transactions

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\admin\transactions\page.tsx:233 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\transactions\page.tsx:542 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/admin/users

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\admin\users\page.tsx:60 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\admin\users\page.tsx:64 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/advertiser/billing

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\advertiser\billing\page.tsx:313 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\billing\page.tsx:314 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/advertiser/campaigns

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\advertiser\campaigns\page.tsx:178 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\advertiser\campaigns\page.tsx:179 | Authenticated | unknown | unknown | /app/advertiser/campaigns/new | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\page.tsx:206 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\page.tsx:210 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\page.tsx:256 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\advertiser\campaigns\page.tsx:257 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\page.tsx:262 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\page.tsx:265 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\page.tsx:270 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\page.tsx:273 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\page.tsx:278 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\page.tsx:281 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\page.tsx:285 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\page.tsx:288 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\page.tsx:310 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\advertiser\campaigns\page.tsx:311 | Authenticated | unknown | unknown | /app/advertiser/campaigns/new | 🔒 |  |

### /app/advertiser/campaigns/[id]

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\advertiser\campaigns\[id]\page.tsx:174 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\[id]\page.tsx:193 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\advertiser\campaigns\[id]\page.tsx:209 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\[id]\page.tsx:210 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\[id]\page.tsx:217 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\[id]\page.tsx:219 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\[id]\page.tsx:227 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\[id]\page.tsx:228 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\[id]\page.tsx:235 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\[id]\page.tsx:237 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\[id]\page.tsx:383 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\[id]\page.tsx:401 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\[id]\page.tsx:421 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/advertiser/campaigns/new

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:467 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\page.tsx:469 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:478 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\page.tsx:481 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:511 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\page.tsx:512 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:519 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\page.tsx:520 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:548 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\page.tsx:550 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:555 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\page.tsx:558 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:700 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\page.tsx:704 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:723 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\page.tsx:727 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\page.tsx:770 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:913 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\page.tsx:915 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:976 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\page.tsx:979 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:1089 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:1093 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\page.tsx:1132 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\page.tsx:1134 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/advertiser/campaigns/new/review

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\advertiser\campaigns\new\review\page.tsx:297 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\review\page.tsx:299 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\review\page.tsx:306 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\review\page.tsx:308 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\campaigns\new\review\page.tsx:315 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\campaigns\new\review\page.tsx:316 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/advertiser/creatives

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\advertiser\creatives\page.tsx:194 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\creatives\page.tsx:203 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\creatives\page.tsx:216 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\creatives\page.tsx:219 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\creatives\page.tsx:223 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\creatives\page.tsx:226 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\creatives\page.tsx:290 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\creatives\page.tsx:292 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\creatives\page.tsx:350 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\creatives\page.tsx:352 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\creatives\page.tsx:359 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\creatives\page.tsx:360 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/advertiser/overview

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\advertiser\overview\page.tsx:271 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\overview\page.tsx:274 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\overview\page.tsx:289 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\advertiser\overview\page.tsx:290 | Authenticated | unknown | unknown | /app/advertiser/campaigns/new | 🔒 |  |
| Unknown | Button | app\app\advertiser\overview\page.tsx:374 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\overview\page.tsx:436 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\overview\page.tsx:439 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\overview\page.tsx:448 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\advertiser\overview\page.tsx:449 | Authenticated | unknown | unknown | /app/advertiser/campaigns | 🔒 |  |
| Unknown | Button | app\app\advertiser\overview\page.tsx:467 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\advertiser\overview\page.tsx:468 | Authenticated | unknown | unknown | /app/advertiser/campaigns/new | 🔒 |  |

### /app/advertiser/reports

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\advertiser\reports\page.tsx:235 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\reports\page.tsx:239 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\reports\page.tsx:240 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/advertiser/support

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\advertiser\support\page.tsx:31 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\support\page.tsx:35 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\support\page.tsx:39 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\support\page.tsx:111 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/advertiser/wallet

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\advertiser\wallet\page.tsx:140 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\wallet\page.tsx:228 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\wallet\page.tsx:231 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\advertiser\wallet\page.tsx:289 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\advertiser\wallet\page.tsx:293 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/notifications

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\notifications\page.tsx:166 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\notifications\page.tsx:167 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\notifications\page.tsx:273 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\notifications\page.tsx:276 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/profile

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Save Changes | Button | app\app\profile\page.tsx:73 | Authenticated | unknown | unknown | - | 🔒 |  |
| Change Password | Button | app\app\profile\page.tsx:135 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/publisher/ad-tags

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\publisher\ad-tags\page.tsx:304 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/publisher/earnings

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\publisher\earnings\page.tsx:169 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\earnings\page.tsx:173 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/publisher/overview

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\publisher\overview\page.tsx:284 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\publisher\overview\page.tsx:285 | Authenticated | unknown | unknown | /app/publisher/sites | 🔒 |  |
| Unknown | Button | app\app\publisher\overview\page.tsx:363 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\publisher\overview\page.tsx:364 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\overview\page.tsx:428 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\publisher\overview\page.tsx:429 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\overview\page.tsx:433 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\overview\page.tsx:442 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\publisher\overview\page.tsx:443 | Authenticated | unknown | unknown | /app/publisher/sites | 🔒 |  |
| Unknown | Button | app\app\publisher\overview\page.tsx:461 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\publisher\overview\page.tsx:462 | Authenticated | unknown | unknown | /app/publisher/sites/new | 🔒 |  |

### /app/publisher/payouts/PayoutsClient.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\publisher\payouts\PayoutsClient.tsx:115 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\payouts\PayoutsClient.tsx:176 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\payouts\PayoutsClient.tsx:178 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\payouts\PayoutsClient.tsx:182 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\payouts\PayoutsClient.tsx:183 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\payouts\PayoutsClient.tsx:278 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\payouts\PayoutsClient.tsx:287 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/publisher/placements

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\publisher\placements\page.tsx:231 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\placements\page.tsx:240 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\placements\page.tsx:281 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\placements\page.tsx:284 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\placements\page.tsx:288 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\placements\page.tsx:291 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\placements\page.tsx:375 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\placements\page.tsx:378 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\placements\page.tsx:444 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\placements\page.tsx:447 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/publisher/reports

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\publisher\reports\page.tsx:157 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\reports\page.tsx:161 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/publisher/sites

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Link | app\app\publisher\sites\page.tsx:152 | Authenticated | unknown | unknown | /app/publisher/sites/new | 🔒 |  |
| Unknown | Button | app\app\publisher\sites\page.tsx:153 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\publisher\sites\page.tsx:221 | Authenticated | unknown | unknown | /app/publisher/sites/new | 🔒 |  |
| Unknown | Button | app\app\publisher\sites\page.tsx:222 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\publisher\sites\page.tsx:277 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\sites\page.tsx:278 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\sites\page.tsx:286 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | app\app\publisher\sites\page.tsx:292 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\sites\page.tsx:298 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\sites\page.tsx:304 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\sites\page.tsx:311 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/publisher/sites/[id]/verify

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\publisher\sites\[id]\verify\page.tsx:138 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\sites\[id]\verify\page.tsx:139 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\sites\[id]\verify\page.tsx:184 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\sites\[id]\verify\page.tsx:185 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\sites\[id]\verify\page.tsx:214 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\sites\[id]\verify\page.tsx:215 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/publisher/sites/new

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\publisher\sites\new\page.tsx:82 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\sites\new\page.tsx:84 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\sites\new\page.tsx:191 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\sites\new\page.tsx:194 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\sites\new\page.tsx:198 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/publisher/support

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\publisher\support\page.tsx:78 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\support\page.tsx:80 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\support\page.tsx:94 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\support\page.tsx:97 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\support\page.tsx:103 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\support\page.tsx:106 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\support\page.tsx:111 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\support\page.tsx:114 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\support\page.tsx:197 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\support\page.tsx:198 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\support\page.tsx:309 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\support\page.tsx:312 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\support\page.tsx:320 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\support\page.tsx:323 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\support\page.tsx:331 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\support\page.tsx:334 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | app\app\publisher\support\page.tsx:342 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\publisher\support\page.tsx:345 | Authenticated | unknown | unknown | - | 🔒 |  |

### /app/settings

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\app\settings\page.tsx:135 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | app\app\settings\page.tsx:136 | Authenticated | unknown | unknown | - | 🔒 |  |
| Save Privacy Settings | Button | app\app\settings\page.tsx:214 | Authenticated | unknown | unknown | - | 🔒 |  |
| Save Preferences | Button | app\app\settings\page.tsx:300 | Authenticated | unknown | unknown | - | 🔒 |  |

### /auth/forgot-password

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\auth\forgot-password\page.tsx:97 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\auth\forgot-password\page.tsx:110 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |

### /auth/link-expired

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\auth\link-expired\page.tsx:51 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\link-expired\page.tsx:52 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\auth\link-expired\page.tsx:67 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\auth\link-expired\page.tsx:72 | Authenticated | navigate | navigate | /auth/signin | ✅ |  |
| Unknown | Link | app\auth\link-expired\page.tsx:82 | Authenticated | navigate | navigate | /contact | ✅ |  |

### /auth/reset-password

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Link | app\auth\reset-password\page.tsx:89 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | app\auth\reset-password\page.tsx:150 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\reset-password\page.tsx:155 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\auth\reset-password\page.tsx:181 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\reset-password\page.tsx:186 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\auth\reset-password\page.tsx:197 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\auth\reset-password\page.tsx:210 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |

### /auth/signin

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\auth\signin\page.tsx:147 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\signin\page.tsx:151 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\auth\signin\page.tsx:193 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\signin\page.tsx:196 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\auth\signin\page.tsx:242 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\signin\page.tsx:247 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\auth\signin\page.tsx:258 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | app\auth\signin\page.tsx:282 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\signin\page.tsx:285 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\auth\signin\page.tsx:291 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\signin\page.tsx:294 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Link | app\auth\signin\page.tsx:302 | Authenticated | navigate | navigate | / | ✅ |  |
| Unknown | Button | app\auth\signin\page.tsx:330 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\signin\page.tsx:334 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\auth\signin\page.tsx:528 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\signin\page.tsx:533 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\auth\signin\page.tsx:556 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\signin\page.tsx:561 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\auth\signin\page.tsx:573 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | app\auth\signin\page.tsx:661 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | app\auth\signin\page.tsx:681 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\signin\page.tsx:684 | Authenticated | navigate | navigate | - | ✅ |  |

### /auth/signup

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\auth\signup\page.tsx:125 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\signup\page.tsx:130 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\auth\signup\page.tsx:165 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\auth\signup\page.tsx:180 | Authenticated | navigate | navigate | /auth/signin | ✅ |  |

### /auth/verified

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\auth\verified\page.tsx:43 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\verified\page.tsx:44 | Authenticated | navigate | navigate | - | ✅ |  |

### /auth/verify-email

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\auth\verify-email\page.tsx:81 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\auth\verify-email\page.tsx:82 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\auth\verify-email\page.tsx:99 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\auth\verify-email\page.tsx:105 | Authenticated | navigate | navigate | /auth/signin | ✅ |  |
| Unknown | Link | app\auth\verify-email\page.tsx:115 | Authenticated | navigate | navigate | /contact | ✅ |  |

### /components/Footer.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| For Advertisers | Link | components\Footer.tsx:21 | Authenticated | navigate | navigate | /advertisers | ✅ |  |
| For Publishers | Link | components\Footer.tsx:22 | Authenticated | navigate | navigate | /publishers | ✅ |  |
| Ad Formats | Link | components\Footer.tsx:23 | Authenticated | navigate | navigate | /ad-formats | ✅ |  |
| About | Link | components\Footer.tsx:29 | Authenticated | navigate | navigate | /about | ✅ |  |
| Contact | Link | components\Footer.tsx:30 | Authenticated | navigate | navigate | /contact | ✅ |  |
| Privacy | Link | components\Footer.tsx:31 | Authenticated | navigate | navigate | /legal/privacy | ✅ |  |
| Advertiser Terms | Link | components\Footer.tsx:37 | Authenticated | navigate | navigate | /legal/advertiser-terms | ✅ |  |
| Publisher Terms | Link | components\Footer.tsx:38 | Authenticated | navigate | navigate | /legal/publisher-terms | ✅ |  |
| Cookie Policy | Link | components\Footer.tsx:39 | Authenticated | navigate | navigate | /legal/cookies | ✅ |  |
| Cookie Preferences | Link | components\Footer.tsx:40 | Authenticated | navigate | navigate | /legal/cookie-preferences | ✅ |  |

### /components/FormatsTeaser.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Link | components\FormatsTeaser.tsx:68 | Authenticated | navigate | navigate | /ad-formats | ✅ |  |
| Unknown | Button | components\FormatsTeaser.tsx:69 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |

### /components/Hero.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Link | components\Hero.tsx:65 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | components\Hero.tsx:66 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\Hero.tsx:70 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | components\Hero.tsx:71 | Authenticated | unknown | unknown | - | 🔒 |  |

### /components/TopBar.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Link | components\TopBar.tsx:23 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\TopBar.tsx:29 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\TopBar.tsx:35 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\TopBar.tsx:47 | Authenticated | unknown | unknown | /app | 🔒 |  |
| Unknown | Button | components\TopBar.tsx:48 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\TopBar.tsx:57 | Authenticated | unknown | unknown | /auth/signin | 🔒 |  |
| Unknown | Button | components\TopBar.tsx:58 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\TopBar.tsx:65 | Authenticated | unknown | unknown | /auth/signin | 🔒 |  |
| Unknown | Button | components\TopBar.tsx:66 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | components\TopBar.tsx:78 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\TopBar.tsx:93 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\TopBar.tsx:99 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\TopBar.tsx:105 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\TopBar.tsx:113 | Authenticated | unknown | unknown | /app | 🔒 |  |
| Unknown | Button | components\TopBar.tsx:114 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\TopBar.tsx:123 | Authenticated | unknown | unknown | /auth/signin | 🔒 |  |
| Unknown | Button | components\TopBar.tsx:124 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\TopBar.tsx:131 | Authenticated | unknown | unknown | /auth/signin | 🔒 |  |
| Unknown | Button | components\TopBar.tsx:132 | Authenticated | unknown | unknown | - | 🔒 |  |

### /components/app/sidebar.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Link | components\app\sidebar.tsx:151 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | components\app\sidebar.tsx:172 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |

### /components/app/top-bar.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | components\app\top-bar.tsx:102 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | components\app\top-bar.tsx:109 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | components\app\top-bar.tsx:115 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | components\app\top-bar.tsx:121 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | components\app\top-bar.tsx:132 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | components\app\top-bar.tsx:164 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | components\app\top-bar.tsx:166 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | components\app\top-bar.tsx:175 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | components\app\top-bar.tsx:176 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | components\app\top-bar.tsx:185 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | components\app\top-bar.tsx:189 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | components\app\top-bar.tsx:198 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | components\app\top-bar.tsx:202 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | components\app\top-bar.tsx:210 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | components\app\top-bar.tsx:221 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | components\app\top-bar.tsx:225 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Unknown | components\app\top-bar.tsx:230 | Authenticated | unknown | unknown | - | 🔒 |  |

### /components/app/top-up-modal.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | components\app\top-up-modal.tsx:300 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | components\app\top-up-modal.tsx:303 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\app\top-up-modal.tsx:304 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | components\app\top-up-modal.tsx:361 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\app\top-up-modal.tsx:365 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | components\app\top-up-modal.tsx:385 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | components\app\top-up-modal.tsx:388 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | components\app\top-up-modal.tsx:415 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | components\app\top-up-modal.tsx:418 | Authenticated | navigate | navigate | - | ✅ |  |

### /components/app/wallet-drawer.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | components\app\wallet-drawer.tsx:175 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\app\wallet-drawer.tsx:177 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | components\app\wallet-drawer.tsx:228 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\app\wallet-drawer.tsx:231 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | components\app\wallet-drawer.tsx:251 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\app\wallet-drawer.tsx:254 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | components\app\wallet-drawer.tsx:283 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\app\wallet-drawer.tsx:286 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | components\app\wallet-drawer.tsx:303 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\app\wallet-drawer.tsx:306 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |

### /components/cookie/CookiePreferences.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | components\cookie\CookiePreferences.tsx:138 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\cookie\CookiePreferences.tsx:140 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | components\cookie\CookiePreferences.tsx:145 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\cookie\CookiePreferences.tsx:146 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | components\cookie\CookiePreferences.tsx:153 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\cookie\CookiePreferences.tsx:154 | Authenticated | navigate | navigate | - | ✅ |  |

### /components/marketing/Hero.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | components\marketing\Hero.tsx:82 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | components\marketing\Hero.tsx:87 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | components\marketing\Hero.tsx:93 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | components\marketing\Hero.tsx:99 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | components\marketing\Hero.tsx:108 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |

### /components/publishers/CtaBand.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | components\publishers\CtaBand.tsx:14 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\publishers\CtaBand.tsx:15 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | components\publishers\CtaBand.tsx:19 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\publishers\CtaBand.tsx:20 | Authenticated | unknown | unknown | /docs/publisher-integration | 🔒 |  |

### /components/publishers/HeroPublishers.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | components\publishers\HeroPublishers.tsx:28 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\publishers\HeroPublishers.tsx:29 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Button | components\publishers\HeroPublishers.tsx:33 | Authenticated | unknown | unknown | - | 🔒 |  |
| Unknown | Link | components\publishers\HeroPublishers.tsx:34 | Authenticated | unknown | unknown | /contact | 🔒 |  |

### /components/ui/confirm-dialog.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | components\ui\confirm-dialog.tsx:65 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\ui\confirm-dialog.tsx:67 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | components\ui\confirm-dialog.tsx:72 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\ui\confirm-dialog.tsx:74 | Authenticated | navigate | navigate | - | ✅ |  |

### /components/ui/empty-state.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | components\ui\empty-state.tsx:36 | Authenticated | navigate | navigate | - | ✅ |  |

### /components/ui/logo.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Link | components\ui\logo.tsx:20 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |

### /components/ui/theme-toggle.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | components\ui\theme-toggle.tsx:26 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | components\ui\theme-toggle.tsx:40 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | components\ui\theme-toggle.tsx:43 | Authenticated | navigate | navigate | - | ✅ |  |

### /contact

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Link | app\contact\page.tsx:162 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\contact\page.tsx:168 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\contact\page.tsx:174 | Authenticated | navigate | navigate | /auth/signin | ✅ |  |
| Unknown | Button | app\contact\page.tsx:175 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Button | app\contact\page.tsx:223 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\contact\page.tsx:225 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\contact\page.tsx:368 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| For Advertisers | Link | app\contact\page.tsx:493 | Authenticated | navigate | navigate | /advertisers | ✅ |  |
| For Publishers | Link | app\contact\page.tsx:494 | Authenticated | navigate | navigate | /publishers | ✅ |  |
| Ad Formats | Link | app\contact\page.tsx:495 | Authenticated | navigate | navigate | /ad-formats | ✅ |  |
| About | Link | app\contact\page.tsx:501 | Authenticated | navigate | navigate | /about | ✅ |  |
| Contact | Link | app\contact\page.tsx:502 | Authenticated | navigate | navigate | /contact | ✅ |  |
| Privacy | Link | app\contact\page.tsx:503 | Authenticated | navigate | navigate | /legal/privacy | ✅ |  |
| Advertiser Terms | Link | app\contact\page.tsx:509 | Authenticated | navigate | navigate | /legal/advertiser-terms | ✅ |  |
| Publisher Terms | Link | app\contact\page.tsx:510 | Authenticated | navigate | navigate | /legal/publisher-terms | ✅ |  |
| Cookie Policy | Link | app\contact\page.tsx:511 | Authenticated | navigate | navigate | /legal/cookies | ✅ |  |

### /docs/publisher-integration

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Link | app\docs\publisher-integration\page.tsx:150 | Authenticated | navigate | navigate | /auth/signup?role=publisher | ✅ |  |
| Unknown | Button | app\docs\publisher-integration\page.tsx:151 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\docs\publisher-integration\page.tsx:156 | Authenticated | navigate | navigate | /contact | ✅ |  |
| Unknown | Button | app\docs\publisher-integration\page.tsx:157 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| For Advertisers | Link | app\docs\publisher-integration\page.tsx:173 | Authenticated | navigate | navigate | /advertisers | ✅ |  |
| For Publishers | Link | app\docs\publisher-integration\page.tsx:174 | Authenticated | navigate | navigate | /publishers | ✅ |  |
| Ad Formats | Link | app\docs\publisher-integration\page.tsx:175 | Authenticated | navigate | navigate | /ad-formats | ✅ |  |
| About | Link | app\docs\publisher-integration\page.tsx:181 | Authenticated | navigate | navigate | /about | ✅ |  |
| Contact | Link | app\docs\publisher-integration\page.tsx:182 | Authenticated | navigate | navigate | /contact | ✅ |  |
| Privacy | Link | app\docs\publisher-integration\page.tsx:188 | Authenticated | navigate | navigate | /legal/privacy | ✅ |  |
| Advertiser Terms | Link | app\docs\publisher-integration\page.tsx:189 | Authenticated | navigate | navigate | /legal/advertiser-terms | ✅ |  |
| Publisher Terms | Link | app\docs\publisher-integration\page.tsx:190 | Authenticated | navigate | navigate | /legal/publisher-terms | ✅ |  |
| Cookie Policy | Link | app\docs\publisher-integration\page.tsx:191 | Authenticated | navigate | navigate | /legal/cookies | ✅ |  |
| Contact Support | Link | app\docs\publisher-integration\page.tsx:197 | Authenticated | navigate | navigate | /contact | ✅ |  |
| Sign In | Link | app\docs\publisher-integration\page.tsx:198 | Authenticated | navigate | navigate | /auth/signin | ✅ |  |

### /error.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\error.tsx:40 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\error.tsx:41 | Authenticated | navigate | navigate | - | ✅ |  |

### /global-error.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\global-error.tsx:42 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\global-error.tsx:43 | Authenticated | navigate | navigate | - | ✅ |  |

### /legal/advertiser-terms

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Privacy Policy | Link | app\legal\advertiser-terms\page.tsx:160 | Authenticated | navigate | navigate | /legal/privacy | ✅ |  |
| Advertiser Terms | Link | app\legal\advertiser-terms\page.tsx:161 | Authenticated | navigate | navigate | /legal/advertiser-terms | ✅ |  |
| Publisher Terms | Link | app\legal\advertiser-terms\page.tsx:162 | Authenticated | navigate | navigate | /legal/publisher-terms | ✅ |  |
| Cookie Policy | Link | app\legal\advertiser-terms\page.tsx:163 | Authenticated | navigate | navigate | /legal/cookies | ✅ |  |

### /legal/cookie-preferences

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\legal\cookie-preferences\page.tsx:205 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\legal\cookie-preferences\page.tsx:206 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\legal\cookie-preferences\page.tsx:215 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\legal\cookie-preferences\page.tsx:216 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\legal\cookie-preferences\page.tsx:225 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\legal\cookie-preferences\page.tsx:226 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | a | app\legal\cookie-preferences\page.tsx:247 | Authenticated | navigate | navigate | /legal/cookies | ✅ |  |
| Unknown | a | app\legal\cookie-preferences\page.tsx:254 | Authenticated | navigate | navigate | /legal/privacy | ✅ |  |
| Unknown | a | app\legal\cookie-preferences\page.tsx:261 | Authenticated | navigate | navigate | /contact | ✅ |  |
| Unknown | Button | app\legal\cookie-preferences\page.tsx:364 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\legal\cookie-preferences\page.tsx:366 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\legal\cookie-preferences\page.tsx:370 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\legal\cookie-preferences\page.tsx:371 | Authenticated | navigate | navigate | - | ✅ |  |
| Unknown | Button | app\legal\cookie-preferences\page.tsx:377 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Unknown | app\legal\cookie-preferences\page.tsx:378 | Authenticated | navigate | navigate | - | ✅ |  |

### /legal/cookies

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Privacy Policy | Link | app\legal\cookies\page.tsx:169 | Authenticated | navigate | navigate | /legal/privacy | ✅ |  |
| Advertiser Terms | Link | app\legal\cookies\page.tsx:170 | Authenticated | navigate | navigate | /legal/advertiser-terms | ✅ |  |
| Publisher Terms | Link | app\legal\cookies\page.tsx:171 | Authenticated | navigate | navigate | /legal/publisher-terms | ✅ |  |
| Cookie Policy | Link | app\legal\cookies\page.tsx:172 | Authenticated | navigate | navigate | /legal/cookies | ✅ |  |

### /legal/privacy

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Privacy Policy | Link | app\legal\privacy\page.tsx:144 | Authenticated | navigate | navigate | /legal/privacy | ✅ |  |
| Advertiser Terms | Link | app\legal\privacy\page.tsx:145 | Authenticated | navigate | navigate | /legal/advertiser-terms | ✅ |  |
| Publisher Terms | Link | app\legal\privacy\page.tsx:146 | Authenticated | navigate | navigate | /legal/publisher-terms | ✅ |  |
| Cookie Policy | Link | app\legal\privacy\page.tsx:147 | Authenticated | navigate | navigate | /legal/cookies | ✅ |  |

### /legal/publisher-terms

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Privacy Policy | Link | app\legal\publisher-terms\page.tsx:144 | Authenticated | navigate | navigate | /legal/privacy | ✅ |  |
| Advertiser Terms | Link | app\legal\publisher-terms\page.tsx:145 | Authenticated | navigate | navigate | /legal/advertiser-terms | ✅ |  |
| Publisher Terms | Link | app\legal\publisher-terms\page.tsx:146 | Authenticated | navigate | navigate | /legal/publisher-terms | ✅ |  |
| Cookie Policy | Link | app\legal\publisher-terms\page.tsx:147 | Authenticated | navigate | navigate | /legal/cookies | ✅ |  |

### /not-found.tsx

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
| Unknown | Button | app\not-found.tsx:26 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\not-found.tsx:27 | Authenticated | navigate | navigate | / | ✅ |  |
| Unknown | Button | app\not-found.tsx:33 | Authenticated | unknown | no handler | - | ⚠️ | No onClick or href |
| Unknown | Link | app\not-found.tsx:34 | Authenticated | navigate | navigate | javascript:history.back() | ✅ |  |
| Unknown | Link | app\not-found.tsx:44 | Authenticated | navigate | navigate | /contact | ✅ |  |

## Broken/No-op Details

### Unknown (/about)

```typescript
// app\about\page.tsx:90
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/about)

```typescript
// app\about\page.tsx:100
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/ad-formats)

```typescript
// app\ad-formats\page.tsx:100
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/ad-formats)

```typescript
// app\ad-formats\page.tsx:107
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/ad-formats)

```typescript
// app\ad-formats\page.tsx:114
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/ad-formats)

```typescript
// app\ad-formats\page.tsx:135
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/ad-formats)

```typescript
// app\ad-formats\page.tsx:141
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/ad-formats)

```typescript
// app\ad-formats\page.tsx:289
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/ad-formats)

```typescript
// app\ad-formats\page.tsx:294
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/advertisers)

```typescript
// app\advertisers\page.tsx:127
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/advertisers)

```typescript
// app\advertisers\page.tsx:133
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/advertisers)

```typescript
// app\advertisers\page.tsx:140
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/advertisers)

```typescript
// app\advertisers\page.tsx:160
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/advertisers)

```typescript
// app\advertisers\page.tsx:166
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/advertisers)

```typescript
// app\advertisers\page.tsx:328
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/advertisers)

```typescript
// app\advertisers\page.tsx:401
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/advertisers)

```typescript
// app\advertisers\page.tsx:405
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/forgot-password)

```typescript
// app\auth\forgot-password\page.tsx:97
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/forgot-password)

```typescript
// app\auth\forgot-password\page.tsx:110
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/link-expired)

```typescript
// app\auth\link-expired\page.tsx:51
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/link-expired)

```typescript
// app\auth\link-expired\page.tsx:67
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/reset-password)

```typescript
// app\auth\reset-password\page.tsx:89
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/reset-password)

```typescript
// app\auth\reset-password\page.tsx:150
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/reset-password)

```typescript
// app\auth\reset-password\page.tsx:181
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/reset-password)

```typescript
// app\auth\reset-password\page.tsx:197
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/reset-password)

```typescript
// app\auth\reset-password\page.tsx:210
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signin)

```typescript
// app\auth\signin\page.tsx:147
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signin)

```typescript
// app\auth\signin\page.tsx:193
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signin)

```typescript
// app\auth\signin\page.tsx:242
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signin)

```typescript
// app\auth\signin\page.tsx:258
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signin)

```typescript
// app\auth\signin\page.tsx:282
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signin)

```typescript
// app\auth\signin\page.tsx:291
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signin)

```typescript
// app\auth\signin\page.tsx:330
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signin)

```typescript
// app\auth\signin\page.tsx:528
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signin)

```typescript
// app\auth\signin\page.tsx:556
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signin)

```typescript
// app\auth\signin\page.tsx:573
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signin)

```typescript
// app\auth\signin\page.tsx:661
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signin)

```typescript
// app\auth\signin\page.tsx:681
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signup)

```typescript
// app\auth\signup\page.tsx:125
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/signup)

```typescript
// app\auth\signup\page.tsx:165
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/verified)

```typescript
// app\auth\verified\page.tsx:43
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/verify-email)

```typescript
// app\auth\verify-email\page.tsx:81
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/auth/verify-email)

```typescript
// app\auth\verify-email\page.tsx:99
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/contact)

```typescript
// app\contact\page.tsx:162
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/contact)

```typescript
// app\contact\page.tsx:168
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/contact)

```typescript
// app\contact\page.tsx:175
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/contact)

```typescript
// app\contact\page.tsx:223
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/contact)

```typescript
// app\contact\page.tsx:368
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/docs/publisher-integration)

```typescript
// app\docs\publisher-integration\page.tsx:151
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/docs/publisher-integration)

```typescript
// app\docs\publisher-integration\page.tsx:157
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/error.tsx)

```typescript
// app\error.tsx:40
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/global-error.tsx)

```typescript
// app\global-error.tsx:42
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/legal/cookie-preferences)

```typescript
// app\legal\cookie-preferences\page.tsx:205
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/legal/cookie-preferences)

```typescript
// app\legal\cookie-preferences\page.tsx:215
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/legal/cookie-preferences)

```typescript
// app\legal\cookie-preferences\page.tsx:225
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/legal/cookie-preferences)

```typescript
// app\legal\cookie-preferences\page.tsx:364
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/legal/cookie-preferences)

```typescript
// app\legal\cookie-preferences\page.tsx:370
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/legal/cookie-preferences)

```typescript
// app\legal\cookie-preferences\page.tsx:377
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/not-found.tsx)

```typescript
// app\not-found.tsx:26
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/not-found.tsx)

```typescript
// app\not-found.tsx:33
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/sidebar.tsx)

```typescript
// components\app\sidebar.tsx:151
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/sidebar.tsx)

```typescript
// components\app\sidebar.tsx:172
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/top-up-modal.tsx)

```typescript
// components\app\top-up-modal.tsx:303
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/top-up-modal.tsx)

```typescript
// components\app\top-up-modal.tsx:361
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/top-up-modal.tsx)

```typescript
// components\app\top-up-modal.tsx:365
// Unknown (Unknown)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/wallet-drawer.tsx)

```typescript
// components\app\wallet-drawer.tsx:175
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/wallet-drawer.tsx)

```typescript
// components\app\wallet-drawer.tsx:228
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/wallet-drawer.tsx)

```typescript
// components\app\wallet-drawer.tsx:231
// Unknown (Unknown)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/wallet-drawer.tsx)

```typescript
// components\app\wallet-drawer.tsx:251
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/wallet-drawer.tsx)

```typescript
// components\app\wallet-drawer.tsx:254
// Unknown (Unknown)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/wallet-drawer.tsx)

```typescript
// components\app\wallet-drawer.tsx:283
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/wallet-drawer.tsx)

```typescript
// components\app\wallet-drawer.tsx:286
// Unknown (Unknown)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/wallet-drawer.tsx)

```typescript
// components\app\wallet-drawer.tsx:303
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/app/wallet-drawer.tsx)

```typescript
// components\app\wallet-drawer.tsx:306
// Unknown (Unknown)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/cookie/CookiePreferences.tsx)

```typescript
// components\cookie\CookiePreferences.tsx:138
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/cookie/CookiePreferences.tsx)

```typescript
// components\cookie\CookiePreferences.tsx:145
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/cookie/CookiePreferences.tsx)

```typescript
// components\cookie\CookiePreferences.tsx:153
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/FormatsTeaser.tsx)

```typescript
// components\FormatsTeaser.tsx:69
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/marketing/Hero.tsx)

```typescript
// components\marketing\Hero.tsx:82
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/marketing/Hero.tsx)

```typescript
// components\marketing\Hero.tsx:87
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/marketing/Hero.tsx)

```typescript
// components\marketing\Hero.tsx:93
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/marketing/Hero.tsx)

```typescript
// components\marketing\Hero.tsx:99
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/marketing/Hero.tsx)

```typescript
// components\marketing\Hero.tsx:108
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/ui/confirm-dialog.tsx)

```typescript
// components\ui\confirm-dialog.tsx:65
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/ui/confirm-dialog.tsx)

```typescript
// components\ui\confirm-dialog.tsx:72
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/ui/logo.tsx)

```typescript
// components\ui\logo.tsx:20
// Unknown (Link)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/ui/theme-toggle.tsx)

```typescript
// components\ui\theme-toggle.tsx:26
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

### Unknown (/components/ui/theme-toggle.tsx)

```typescript
// components\ui\theme-toggle.tsx:40
// Unknown (Button)
// Status: ⚠️
// Notes: No onClick or href
```

**Recommendation**: Implement the missing functionality or remove the placeholder.

## Navigation Map

```mermaid
graph TD
/about --> /auth/signup?role=advertiser
/about --> /auth/signup?role=publisher
/ad-formats --> /auth/signin
/ad-formats --> /auth/signup?role=advertiser
/ad-formats --> /contact
/ad-formats --> /advertisers
/ad-formats --> /publishers
/ad-formats --> /about
/ad-formats --> /legal/privacy
/ad-formats --> /legal/advertiser-terms
/ad-formats --> /legal/publisher-terms
/ad-formats --> /legal/cookies
/advertisers --> /auth/signin
/advertisers --> /contact
/advertisers --> /contact?subject=Schedule%20Demo
/advertisers --> /publishers
/advertisers --> /ad-formats
/advertisers --> /about
/advertisers --> /legal/privacy
/advertisers --> /legal/advertiser-terms
/advertisers --> /legal/publisher-terms
/advertisers --> /legal/cookies
/app/admin/overview --> /app/admin/approvals
/app/admin/overview --> /app/admin/delivery
/app/admin/overview --> /app/admin/transactions
/app/admin/overview --> /app/admin/users
/app/advertiser/campaigns --> /app/advertiser/campaigns/new
/app/advertiser/overview --> /app/advertiser/campaigns/new
/app/advertiser/overview --> /app/advertiser/campaigns
/app/publisher/overview --> /app/publisher/sites
/app/publisher/overview --> /app/publisher/sites/new
/app/publisher/sites --> /app/publisher/sites/new
/auth/link-expired --> /auth/signin
/auth/link-expired --> /contact
/auth/signin --> /
/auth/signup --> /auth/signin
/auth/verify-email --> /auth/signin
/auth/verify-email --> /contact
/contact --> /auth/signin
/contact --> /advertisers
/contact --> /publishers
/contact --> /ad-formats
/contact --> /about
/contact --> /legal/privacy
/contact --> /legal/advertiser-terms
/contact --> /legal/publisher-terms
/contact --> /legal/cookies
/docs/publisher-integration --> /auth/signup?role=publisher
/docs/publisher-integration --> /contact
/docs/publisher-integration --> /advertisers
/docs/publisher-integration --> /publishers
/docs/publisher-integration --> /ad-formats
/docs/publisher-integration --> /about
/docs/publisher-integration --> /legal/privacy
/docs/publisher-integration --> /legal/advertiser-terms
/docs/publisher-integration --> /legal/publisher-terms
/docs/publisher-integration --> /legal/cookies
/docs/publisher-integration --> /auth/signin
/legal/advertiser-terms --> /legal/privacy
/legal/advertiser-terms --> /legal/publisher-terms
/legal/advertiser-terms --> /legal/cookies
/legal/cookie-preferences --> /legal/cookies
/legal/cookie-preferences --> /legal/privacy
/legal/cookie-preferences --> /contact
/legal/cookies --> /legal/privacy
/legal/cookies --> /legal/advertiser-terms
/legal/cookies --> /legal/publisher-terms
/legal/privacy --> /legal/advertiser-terms
/legal/privacy --> /legal/publisher-terms
/legal/privacy --> /legal/cookies
/legal/publisher-terms --> /legal/privacy
/legal/publisher-terms --> /legal/advertiser-terms
/legal/publisher-terms --> /legal/cookies
/not-found.tsx --> /
/not-found.tsx --> /contact
/components/Footer.tsx --> /advertisers
/components/Footer.tsx --> /publishers
/components/Footer.tsx --> /ad-formats
/components/Footer.tsx --> /about
/components/Footer.tsx --> /contact
/components/Footer.tsx --> /legal/privacy
/components/Footer.tsx --> /legal/advertiser-terms
/components/Footer.tsx --> /legal/publisher-terms
/components/Footer.tsx --> /legal/cookies
/components/Footer.tsx --> /legal/cookie-preferences
/components/FormatsTeaser.tsx --> /ad-formats
/components/publishers/CtaBand.tsx --> /docs/publisher-integration
/components/publishers/HeroPublishers.tsx --> /contact
/components/TopBar.tsx --> /app
/components/TopBar.tsx --> /auth/signin
```

## Appendix

### Component Types Found
- app\about\page.tsx
- app\ad-formats\page.tsx
- app\advertisers\page.tsx
- app\app\admin\approvals\page.tsx
- app\app\admin\delivery\page.tsx
- app\app\admin\logs\page.tsx
- app\app\admin\overview\page.tsx
- app\app\admin\pricing\page.tsx
- app\app\admin\transactions\page.tsx
- app\app\admin\users\page.tsx
- app\app\advertiser\billing\page.tsx
- app\app\advertiser\campaigns\new\page.tsx
- app\app\advertiser\campaigns\new\review\page.tsx
- app\app\advertiser\campaigns\page.tsx
- app\app\advertiser\campaigns\[id]\page.tsx
- app\app\advertiser\creatives\page.tsx
- app\app\advertiser\overview\page.tsx
- app\app\advertiser\reports\page.tsx
- app\app\advertiser\support\page.tsx
- app\app\advertiser\wallet\page.tsx
- app\app\notifications\page.tsx
- app\app\profile\page.tsx
- app\app\publisher\ad-tags\page.tsx
- app\app\publisher\earnings\page.tsx
- app\app\publisher\overview\page.tsx
- app\app\publisher\payouts\PayoutsClient.tsx
- app\app\publisher\placements\page.tsx
- app\app\publisher\reports\page.tsx
- app\app\publisher\sites\new\page.tsx
- app\app\publisher\sites\page.tsx
- app\app\publisher\sites\[id]\verify\page.tsx
- app\app\publisher\support\page.tsx
- app\app\settings\page.tsx
- app\auth\forgot-password\page.tsx
- app\auth\link-expired\page.tsx
- app\auth\reset-password\page.tsx
- app\auth\signin\page.tsx
- app\auth\signup\page.tsx
- app\auth\verified\page.tsx
- app\auth\verify-email\page.tsx
- app\contact\page.tsx
- app\docs\publisher-integration\page.tsx
- app\error.tsx
- app\global-error.tsx
- app\legal\advertiser-terms\page.tsx
- app\legal\cookie-preferences\page.tsx
- app\legal\cookies\page.tsx
- app\legal\privacy\page.tsx
- app\legal\publisher-terms\page.tsx
- app\not-found.tsx
- components\app\sidebar.tsx
- components\app\top-bar.tsx
- components\app\top-up-modal.tsx
- components\app\wallet-drawer.tsx
- components\cookie\CookiePreferences.tsx
- components\Footer.tsx
- components\FormatsTeaser.tsx
- components\Hero.tsx
- components\marketing\Hero.tsx
- components\publishers\CtaBand.tsx
- components\publishers\HeroPublishers.tsx
- components\TopBar.tsx
- components\ui\confirm-dialog.tsx
- components\ui\empty-state.tsx
- components\ui\logo.tsx
- components\ui\theme-toggle.tsx

### Common Props


### Heuristics Used
- **Label-based**: "Create/New/Add" → create flow, "Save/Update" → persist, "Delete/Remove" → destructive
- **Icon-based**: Plus → create, Edit → edit, Trash → delete, Download → export
- **Component-based**: Link → navigate, button[type="submit"] → submit
- **Route-based**: /app/admin/* → Admin role, /app/advertiser/* → Advertiser role

### Status Classifications
- **✅ Working**: Navigation completes or action returns success
- **⚠️ No-op/Stub**: Only alert/log/TODO or empty handler
- **❌ Broken**: Throws error, 4xx/5xx, or unhandled promise rejection
- **🔒 Auth-gated mismatch**: Visible but disabled or throws 401/403 for expected role
- **🧭 Missing target**: Label implies navigation but no href/router usage

## How to Run

### Static Scan
```bash
tsx tools/scan-buttons.ts > tools/.artifacts/button-scan.json
```

### Runtime Probe (Optional)
```bash
E2E_BASE_URL="https://<deployment>" npx playwright test tests/button-audit.spec.ts
```

### Generate Report
```bash
tsx tools/generate-button-audit.ts
```
