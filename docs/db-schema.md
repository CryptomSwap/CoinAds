# CoinAds Database Schema

**Generated:** $(date)  
**Database:** PostgreSQL with Prisma ORM  
**Migrations:** 3 migrations applied

## Overview

The CoinAds database schema consists of 12 models with comprehensive relationships supporting a three-tier advertising platform (Advertisers, Publishers, Admins) with campaign management, tracking, and financial operations.

## Models

### 1. User
**Purpose:** Core user entity with role-based access control

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Int | @id @default(autoincrement()) | Auto | Primary key |
| email | String | @unique | - | User email (unique) |
| password | String? | Optional | - | Hashed password (null for OAuth users) |
| role | Role | Enum | - | User role (ADVERTISER, PUBLISHER, ADMIN) |
| name | String? | Optional | - | Display name |
| createdAt | DateTime | @default(now()) | now() | Account creation timestamp |

**Relationships:**
- One-to-many: Campaigns, Sites, Transactions, Approvals, AdminLogs

**Indexes:**
- Primary: id
- Unique: email
- Index: email, role

### 2. Campaign
**Purpose:** Advertising campaigns created by advertisers

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Int | @id @default(autoincrement()) | Auto | Primary key |
| advertiserId | Int | Foreign key | - | Reference to User (advertiser) |
| name | String | Required | - | Campaign name |
| budget | Float | Required | - | Campaign budget |
| status | CampaignStatus | @default(PENDING) | PENDING | Campaign status |
| startDate | DateTime? | Optional | - | Campaign start date |
| endDate | DateTime? | Optional | - | Campaign end date |
| createdAt | DateTime | @default(now()) | now() | Creation timestamp |

**Relationships:**
- Many-to-one: User (advertiser)
- One-to-many: Creatives, Placements, Reports, Impressions, Conversions

**Indexes:**
- Primary: id
- Index: advertiserId + status, status + createdAt

### 3. Creative
**Purpose:** Ad creative assets for campaigns

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Int | @id @default(autoincrement()) | Auto | Primary key |
| campaignId | Int | Foreign key | - | Reference to Campaign |
| fileUrl | String | Required | - | Creative file URL |
| clickUrl | String | Required | - | Click destination URL |
| altText | String? | Optional | - | Alt text for accessibility |
| createdAt | DateTime | @default(now()) | now() | Creation timestamp |

**Relationships:**
- Many-to-one: Campaign
- One-to-many: Impressions

**Indexes:**
- Primary: id

### 4. Site
**Purpose:** Publisher websites for ad placement

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Int | @id @default(autoincrement()) | Auto | Primary key |
| publisherId | Int | Foreign key | - | Reference to User (publisher) |
| domain | String | Required | - | Website domain |
| verified | Boolean | @default(false) | false | Site verification status |
| approved | Boolean | @default(false) | false | Admin approval status |

**Relationships:**
- Many-to-one: User (publisher)
- One-to-many: Placements, Impressions

**Indexes:**
- Primary: id

### 5. Placement
**Purpose:** Ad placement slots on publisher sites

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Int | @id @default(autoincrement()) | Auto | Primary key |
| siteId | Int | Foreign key | - | Reference to Site |
| size | String | Required | - | Ad size (e.g., "728x90") |
| pricing | PricingType | Enum | - | Pricing model |
| price | Float | Required | - | Price per unit |
| approved | Boolean | @default(false) | false | Admin approval status |
| campaignId | Int? | Optional foreign key | - | Reference to Campaign (optional) |

**Relationships:**
- Many-to-one: Site, Campaign (optional)
- One-to-many: Impressions

**Indexes:**
- Primary: id

### 6. Transaction
**Purpose:** Financial transactions (deposits, payouts)

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Int | @id @default(autoincrement()) | Auto | Primary key |
| userId | Int | Foreign key | - | Reference to User |
| amount | Float | Required | - | Transaction amount |
| type | TransactionType | Enum | - | Transaction type |
| status | String | @default("PENDING") | "PENDING" | Transaction status |
| createdAt | DateTime | @default(now()) | now() | Creation timestamp |

**Relationships:**
- Many-to-one: User

**Indexes:**
- Primary: id

### 7. Approval
**Purpose:** Admin approval workflow for campaigns, sites, creatives, placements

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Int | @id @default(autoincrement()) | Auto | Primary key |
| entityType | String | Required | - | Type of entity being approved |
| entityId | Int | Required | - | ID of the entity |
| status | ApprovalStatus | Enum | - | Approval status |
| reason | String? | Optional | - | Reason for rejection |
| adminUserId | Int | Foreign key | - | Reference to User (admin) |
| createdAt | DateTime | @default(now()) | now() | Creation timestamp |

**Relationships:**
- Many-to-one: User (admin)

**Indexes:**
- Primary: id

### 8. AdminLog
**Purpose:** System audit log for admin actions

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Int | @id @default(autoincrement()) | Auto | Primary key |
| userId | Int | Foreign key | - | Reference to User (admin) |
| action | String | Required | - | Action performed |
| entityType | String | Required | - | Type of entity affected |
| entityId | Int? | Optional | - | ID of the entity |
| createdAt | DateTime | @default(now()) | now() | Creation timestamp |

**Relationships:**
- Many-to-one: User (admin)

**Indexes:**
- Primary: id

### 9. Impression
**Purpose:** Ad impression tracking with detailed analytics

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Int | @id @default(autoincrement()) | Auto | Primary key |
| campaignId | Int | Foreign key | - | Reference to Campaign |
| creativeId | Int | Foreign key | - | Reference to Creative |
| placementId | Int? | Optional foreign key | - | Reference to Placement |
| siteId | Int? | Optional foreign key | - | Reference to Site |
| device | String? | Optional | - | Device type |
| country | String? | Optional | - | Country code |
| browser | String? | Optional | - | Browser type |
| os | String? | Optional | - | Operating system |
| costMicros | Int | @default(0) | 0 | Cost in micros (for precision) |
| createdAt | DateTime | @default(now()) | now() | Creation timestamp |

**Relationships:**
- Many-to-one: Campaign, Creative, Placement (optional), Site (optional)
- One-to-many: Clicks

**Indexes:**
- Primary: id
- Index: campaignId + creativeId + placementId + createdAt, siteId + createdAt, createdAt

### 10. Click
**Purpose:** Click tracking for impressions

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Int | @id @default(autoincrement()) | Auto | Primary key |
| impressionId | Int | Foreign key | - | Reference to Impression |
| createdAt | DateTime | @default(now()) | now() | Creation timestamp |

**Relationships:**
- Many-to-one: Impression
- One-to-many: Conversions

**Indexes:**
- Primary: id
- Index: impressionId + createdAt, createdAt

### 11. Conversion
**Purpose:** Conversion tracking for campaigns

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Int | @id @default(autoincrement()) | Auto | Primary key |
| clickId | Int? | Optional foreign key | - | Reference to Click |
| campaignId | Int | Foreign key | - | Reference to Campaign |
| value | Float | @default(0) | 0 | Conversion value |
| currency | String | @default("USD") | "USD" | Currency code |
| createdAt | DateTime | @default(now()) | now() | Creation timestamp |

**Relationships:**
- Many-to-one: Click (optional), Campaign

**Indexes:**
- Primary: id

### 12. Report
**Purpose:** Aggregated performance reports

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | Int | @id @default(autoincrement()) | Auto | Primary key |
| campaignId | Int | Foreign key | - | Reference to Campaign |
| date | DateTime | Required | - | Report date |
| impressions | Int | Required | - | Total impressions |
| clicks | Int | Required | - | Total clicks |
| spend | Float | Required | - | Total spend |

**Relationships:**
- Many-to-one: Campaign

**Indexes:**
- Primary: id
- Index: campaignId + date, date

## Enums

### Role
- **ADVERTISER:** Can create campaigns, manage creatives, view reports
- **PUBLISHER:** Can manage sites, placements, view earnings
- **ADMIN:** Can approve/reject content, manage users, view system logs

### CampaignStatus
- **PENDING:** Awaiting admin approval
- **ACTIVE:** Running and serving ads
- **PAUSED:** Temporarily stopped
- **COMPLETED:** Finished
- **REJECTED:** Rejected by admin

### PricingType
- **CPM:** Cost per mille (1000 impressions)
- **CPA:** Cost per acquisition
- **CPI:** Cost per install
- **FIXED:** Fixed price

### TransactionType
- **DEPOSIT:** Money in (advertiser funding)
- **PAYOUT:** Money out (publisher earnings)

### ApprovalStatus
- **APPROVED:** Approved by admin
- **REJECTED:** Rejected by admin

## Migrations

### 1. mvp_schema_update (2025-09-18 10:15:59)
- Initial MVP schema creation
- Core models and relationships

### 2. add_missing_models (2025-09-18 10:47:01)
- Added missing models and fields
- Enhanced tracking capabilities

### 3. fix_organization_fields (2025-09-18 10:51:22)
- Fixed organization-related fields
- Schema refinements

## Database Configuration

### Connection
- **Provider:** PostgreSQL
- **URL:** Environment variable `DATABASE_URL`
- **Pooling:** Managed by Prisma Client

### Indexes
- **Primary Keys:** All models have auto-incrementing integer primary keys
- **Unique Constraints:** User.email
- **Performance Indexes:** Campaign (advertiserId + status), Impression (campaignId + creativeId + placementId + createdAt)
- **Time-based Indexes:** CreatedAt fields for efficient time-range queries

### Data Integrity
- **Foreign Keys:** All relationships properly constrained
- **Cascade Rules:** Appropriate cascade behavior for data consistency
- **Default Values:** Sensible defaults for status fields and timestamps

## Seed Data

The database includes comprehensive seed data for development and testing:

### Users
- **Admin:** admin@coinads.com (ADMIN role)
- **Advertisers:** adv@coinads.com, adv2@coinads.com
- **Publishers:** pub@coinads.com, pub2@coinads.com

### Sample Data
- Campaigns with different statuses
- Sites with verification states
- Placements with pricing models
- Sample reports and transactions
- Admin logs and approvals

## Performance Considerations

### Query Optimization
- Indexes on frequently queried fields
- Composite indexes for multi-field queries
- Time-based partitioning ready (createdAt fields)

### Scalability
- Micros precision for financial calculations
- Efficient tracking with optional relationships
- Aggregated reporting for performance

### Data Retention
- Audit trail with AdminLog
- Comprehensive tracking for analytics
- Financial transaction history

## Security

### Data Protection
- Password hashing with bcrypt
- Role-based access control
- Audit logging for admin actions

### Privacy
- No sensitive data in tracking
- Anonymized analytics data
- GDPR-compliant data structure

## Maintenance

### Regular Tasks
- Monitor index performance
- Clean up old tracking data
- Backup critical financial data
- Review and rotate audit logs

### Monitoring
- Database connection health
- Query performance metrics
- Storage usage trends
- Migration status tracking
