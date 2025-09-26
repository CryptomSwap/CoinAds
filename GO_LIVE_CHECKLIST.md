# CoinAds MVP - Go Live Checklist

This checklist ensures all critical systems are working before deploying to production.

## Environment & Configuration

- [ ] **Vercel env vars set**: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `EMAIL_*` (if using email)
  - [ ] `DATABASE_URL` points to production Neon database
  - [ ] `NEXTAUTH_SECRET` is a secure random string (32+ characters)
  - [ ] `NEXTAUTH_URL` matches your production domain
  - [ ] `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD`, `EMAIL_FROM` configured (if using email)

## Build & Database

- [ ] **`npm run build` succeeds locally**
  - [ ] No TypeScript errors
  - [ ] No linting errors
  - [ ] All imports resolve correctly
  - [ ] Environment variables validated

- [ ] **`npx prisma migrate deploy` succeeds against Neon**
  - [ ] All migrations applied successfully
  - [ ] Database schema matches Prisma schema
  - [ ] No migration conflicts
  - [ ] Test connection to production database

## API Health & Functionality

- [ ] **`/api/health` returns `{ ok: true }` in Preview & Prod**
  - [ ] Health endpoint responds correctly
  - [ ] Database connection working
  - [ ] No error responses

- [ ] **Advertiser reports CSV downloads with correct columns & totals**
  - [ ] CSV endpoint `/api/reports/advertiser.csv` works
  - [ ] Required columns present: `date,campaignId,campaignName,site,placement,size,country,device,impressions,clicks,ctr,spend_cents,ecpm`
  - [ ] Data totals match dashboard values
  - [ ] File downloads with correct filename
  - [ ] Proper CSV formatting (escaped values, headers)

- [ ] **Admin can approve/reject with reasons; logs appear in Admin Logs**
  - [ ] Approval workflow functions correctly
  - [ ] Rejection requires reason (validation working)
  - [ ] Approval records created in database
  - [ ] Admin logs appear in `/app/admin/logs`
  - [ ] Entity status updates correctly (campaigns → ACTIVE, sites → approved)

## Code Quality & Security

- [ ] **Demo/mock code removed**
  - [ ] No hardcoded test data
  - [ ] No console.log statements in production code
  - [ ] No placeholder URLs or emails
  - [ ] All TODO comments addressed or documented

- [ ] **Basic rate limiting tested (429 on flood)**
  - [ ] Rate limiting middleware active
  - [ ] 429 response returned on limit exceeded
  - [ ] `X-RateLimit-*` headers present
  - [ ] Different limits for track APIs vs regular APIs
  - [ ] Rate limit resets after window expires

- [ ] **Security headers present (check devtools → Network → Headers)**
  - [ ] `Strict-Transport-Security` header
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`
  - [ ] `Permissions-Policy: interest-cohort=()`
  - [ ] `Content-Security-Policy` header present

- [ ] **CORS OK for `/api/track` from publisher domains**
  - [ ] CORS headers present on track endpoints
  - [ ] `Access-Control-Allow-Origin` set correctly
  - [ ] `Access-Control-Allow-Methods` includes GET, POST, OPTIONS
  - [ ] Preflight OPTIONS requests handled
  - [ ] Test from actual publisher domain

## Testing Scenarios

### Authentication & Authorization
- [ ] Admin users can access admin pages
- [ ] Non-admin users redirected from admin pages
- [ ] Advertiser users can access advertiser pages
- [ ] Publisher users can access publisher pages
- [ ] Unauthenticated users redirected to signin

### Data Integrity
- [ ] Campaign creation and approval workflow
- [ ] Site registration and approval workflow
- [ ] Creative upload and approval workflow
- [ ] Placement creation and approval workflow
- [ ] Transaction recording and balance updates

### Performance
- [ ] Page load times acceptable (< 3 seconds)
- [ ] Database queries optimized
- [ ] No memory leaks in long-running processes
- [ ] Image optimization working
- [ ] Static assets cached properly

### Error Handling
- [ ] 404 pages render correctly
- [ ] 500 errors show user-friendly messages
- [ ] Form validation errors display properly
- [ ] Network errors handled gracefully
- [ ] Database connection errors logged

## Deployment Verification

### Vercel Deployment
- [ ] Preview deployment successful
- [ ] Production deployment successful
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] CDN working properly

### Database
- [ ] Production database accessible
- [ ] Connection pooling configured
- [ ] Backup strategy in place
- [ ] Monitoring set up

### Monitoring & Logging
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Performance monitoring active
- [ ] Log aggregation working
- [ ] Alerts configured for critical issues

## Post-Deployment

### Smoke Tests
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] Email verification (if enabled)
- [ ] Password reset functionality
- [ ] Admin dashboard accessible
- [ ] Advertiser dashboard accessible
- [ ] Publisher dashboard accessible

### Business Logic
- [ ] Campaign creation and management
- [ ] Site registration and verification
- [ ] Ad delivery and tracking
- [ ] Reporting and analytics
- [ ] Payment processing (if enabled)

### Integration Tests
- [ ] Email service working (if configured)
- [ ] Payment gateway integration (if enabled)
- [ ] Third-party API integrations
- [ ] Webhook endpoints responding

## Rollback Plan

- [ ] Database migration rollback procedure documented
- [ ] Vercel deployment rollback process tested
- [ ] Environment variable rollback plan
- [ ] Emergency contact list updated
- [ ] Monitoring alerts configured for rollback triggers

## Documentation

- [ ] API documentation updated
- [ ] User guides created/updated
- [ ] Admin documentation complete
- [ ] Troubleshooting guide available
- [ ] Contact information updated

---

## Quick Commands for Testing

```bash
# Test build locally
npm run build

# Test database migration
npx prisma migrate deploy

# Test health endpoint
curl https://your-domain.vercel.app/api/health

# Test rate limiting
for i in {1..100}; do curl https://your-domain.vercel.app/api/health; done

# Test CORS
curl -H "Origin: https://publisher-site.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-domain.vercel.app/api/track/imp
```

## Emergency Contacts

- **Technical Lead**: [Name] - [Email] - [Phone]
- **DevOps**: [Name] - [Email] - [Phone]
- **Database Admin**: [Name] - [Email] - [Phone]
- **Vercel Support**: [Support Ticket URL]

---

**Last Updated**: [Date]
**Version**: 1.0
**Status**: Ready for Production
