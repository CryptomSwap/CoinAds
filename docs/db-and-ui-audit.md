# Database + UI End-to-End Audit System

This document describes the comprehensive audit system built to verify database connectivity and UI functionality across your Next.js CoinAds application.

## Overview

The audit system provides end-to-end testing that:
- ✅ Verifies database connectivity through real API calls
- ✅ Tests UI screens and button interactions
- ✅ Generates comprehensive reports with screenshots and logs
- ✅ Works without Google OAuth (uses email/password authentication)
- ✅ Cleans up test data automatically

## Quick Start

1. **Install dependencies** (already done):
   ```bash
   npm install -D @playwright/test tsx
   npx playwright install
   ```

2. **Run the complete audit**:
   ```bash
   npm run audit:all
   ```

3. **View results**:
   - Open `docs/db-and-ui-audit.md` for the comprehensive report
   - Check `audit-artifacts/` for screenshots, logs, and detailed results

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run audit:routes` | Discover all pages and API routes |
| `npm run audit:db` | Test database connectivity and API endpoints |
| `npm run audit:ui` | Test UI screens and button interactions |
| `npm run audit:report` | Generate the final audit report |
| `npm run audit:all` | Run the complete audit pipeline |

## What Gets Tested

### Database Connectivity
- **Health Check**: `/api/health` endpoint verification
- **Publisher Sites**: Full CRUD operations (Create, Read, Update, Delete)
- **Advertiser Campaigns**: Create and Read operations
- **Persistence Verification**: Confirms data is actually saved to database
- **Cleanup**: Automatically removes test data

### UI Testing
- **Page Discovery**: Automatically finds all pages in your app
- **Authentication**: Signs in with test credentials (`tester@example.com` / `Password123!`)
- **Button Testing**: Clicks safe UI controls (skips dangerous actions)
- **Form Interaction**: Fills optional form fields with test data
- **Error Collection**: Captures console errors and failed network requests
- **Screenshots**: Takes full-page screenshots of each tested page

### Safety Features
- **Non-destructive**: Skips "Delete", "Remove", "Danger" buttons
- **Smart Detection**: Identifies safe vs. dangerous actions
- **Error Handling**: Continues testing even if individual actions fail
- **Resource Cleanup**: Removes all test data after completion

## Configuration

### Environment Variables
- `RUNTIME_BASE_URL`: Your app's URL (defaults to `http://localhost:3000`)
- `NEXT_PUBLIC_SITE_URL`: Alternative URL setting
- Standard Next.js environment variables for database and auth

### Test User
The system uses a test user with these credentials:
- **Email**: `tester@example.com`
- **Password**: `Password123!`

If the user doesn't exist, the system will attempt to create it via `/api/dev/seed-admin`.

## Output Structure

```
audit-artifacts/
├── routes.json                 # Discovered pages and APIs
├── api/
│   └── db-api-test-*.json      # Database test results
├── ui/
│   ├── ui-test-summary-*.json  # UI test summary
│   └── *.json                  # Individual page results
├── screenshots/
│   └── *.png                   # Page screenshots
└── playwright/
    └── html/
        └── index.html          # Playwright HTML report
```

## Report Contents

The generated `docs/db-and-ui-audit.md` includes:

1. **Executive Summary**
   - Database connectivity status
   - UI testing results overview
   - Key metrics and statistics

2. **Database Verification Details**
   - Per-endpoint test results
   - Success/failure status
   - Error messages and responses

3. **UI Testing Details**
   - Page-by-page results table
   - Controls found/clicked/skipped
   - Console errors and failed requests
   - Screenshot links

4. **Issues and Recommendations**
   - Failed endpoints
   - Pages with errors
   - Authentication issues
   - Actionable recommendations

## Troubleshooting

### Common Issues

1. **Authentication Fails**
   - Check if test user exists
   - Verify `/api/dev/seed-admin` endpoint
   - Ensure auth configuration is correct

2. **Database Connection Issues**
   - Verify `DATABASE_URL` environment variable
   - Check database server is running
   - Ensure Prisma migrations are applied

3. **UI Tests Fail**
   - Check if app is running on correct port
   - Verify no blocking modals or overlays
   - Review console errors in the report

### Debug Mode
Run individual components to isolate issues:
```bash
# Test just the route discovery
npm run audit:routes

# Test just database connectivity
npm run audit:db

# Test just UI interactions
npm run audit:ui
```

## Customization

### Adding New Test Endpoints
Edit `tests/db.api.spec.ts` to add new API endpoint tests.

### Modifying UI Test Behavior
Edit `tests/helpers/dom.ts` to change button detection logic or form filling behavior.

### Customizing Reports
Edit `scripts/generate-db-and-ui-report.ts` to modify report format and content.

## Integration with CI/CD

The audit system can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run DB + UI Audit
  run: |
    npm run audit:all
    # Upload audit-artifacts/ as build artifacts
```

## Support

For issues or questions about the audit system:
1. Check the generated report for specific error details
2. Review the Playwright HTML report for detailed test results
3. Examine individual JSON files in `audit-artifacts/` for raw data

---

*This audit system was built to provide comprehensive end-to-end testing without requiring Google OAuth, ensuring your application's database and UI components work correctly together.*
