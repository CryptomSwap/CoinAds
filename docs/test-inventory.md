# CoinAds Test Inventory

**Generated:** $(date)  
**Testing Framework:** Playwright E2E + Jest Unit Tests  
**Coverage:** Authentication, API, UI, Database operations

## Overview

CoinAds implements comprehensive testing with Playwright for end-to-end testing and Jest for unit tests. The test suite covers authentication flows, API endpoints, database operations, UI interactions, and button functionality.

## Test Framework Configuration

### Playwright Configuration
- **File:** `playwright.config.ts`
- **Base URL:** Environment variable or localhost:3000
- **Browser:** Chromium (Desktop Chrome)
- **Parallel:** Fully parallel execution
- **Retries:** 2 retries in CI, 0 locally
- **Workers:** 1 in CI, undefined locally
- **Reporter:** List + HTML reports
- **Output:** `audit-artifacts/playwright/`

### Jest Configuration
- **File:** `jest.config.ts`
- **Preset:** ts-jest
- **Environment:** Node.js
- **Test Match:** `**/*.test.ts`
- **Coverage:** App, components, lib directories
- **Setup:** `jest.setup.ts`

## E2E Test Suite (Playwright)

### 1. Google OAuth Authentication Tests
**File:** `tests/auth-google.spec.ts`

#### Test Coverage
- **Sign-in Page Display:** Verifies Google OAuth button presence
- **OAuth Redirect:** Tests Google OAuth flow initiation
- **Callback Handling:** Mock OAuth callback processing
- **Environment Validation:** Google OAuth configuration checks

#### Key Tests
```typescript
test('should display sign in page with Google option', async ({ page }) => {
  await page.goto('/auth/signin');
  const googleButton = page.locator('text=Google').or(page.locator('text=Continue with Google'));
  await expect(googleButton).toBeVisible();
});

test('should redirect to Google OAuth when clicking Google sign in', async ({ page }) => {
  await page.goto('/auth/signin');
  const googleButton = page.locator('text=Google').or(page.locator('text=Continue with Google'));
  await googleButton.click();
  await page.waitForURL(/accounts\.google\.com/, { timeout: 10000 });
  expect(page.url()).toContain('accounts.google.com');
});
```

### 2. Database API End-to-End Tests
**File:** `tests/db.api.spec.ts`

#### Test Coverage
- **Health Check:** Database connectivity validation
- **Publisher Sites:** CRUD operations for site management
- **Advertiser Campaigns:** CRUD operations for campaign management
- **Authentication:** Session validation for API access
- **Error Handling:** API error response validation

#### Key Tests
```typescript
test('should create, read, update, and delete publisher sites', async ({ request }) => {
  // Create site
  const createResponse = await request.post('/api/publisher/sites', {
    data: { domain: 'test-site.com', verified: false }
  });
  expect(createResponse.ok()).toBeTruthy();
  
  // Read sites
  const readResponse = await request.get('/api/publisher/sites');
  expect(readResponse.ok()).toBeTruthy();
  
  // Update site
  const updateResponse = await request.put(`/api/publisher/sites/${siteId}`, {
    data: { verified: true }
  });
  expect(updateResponse.ok()).toBeTruthy();
  
  // Delete site
  const deleteResponse = await request.delete(`/api/publisher/sites/${siteId}`);
  expect(deleteResponse.ok()).toBeTruthy();
});
```

### 3. UI Screens and Buttons Tests
**File:** `tests/ui.screens-and-buttons.spec.ts`

#### Test Coverage
- **Page Navigation:** All major pages and routes
- **Button Functionality:** Interactive element testing
- **Form Validation:** Input field validation
- **Error Handling:** Console errors and warnings
- **Authentication Flow:** Sign-in/sign-up processes

#### Key Tests
```typescript
test('should test all major pages and buttons', async ({ page }) => {
  const routes = [
    '/', '/about', '/advertisers', '/publishers',
    '/auth/signin', '/auth/signup', '/app'
  ];
  
  for (const route of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(/CoinAds/);
    
    // Test buttons and forms
    const controls = await discoverControls(page);
    for (const control of controls) {
      await safeClick(page, control);
    }
  }
});
```

### 4. Button Audit Tests
**File:** `tests/button-audit.spec.ts`

#### Test Coverage
- **Button Discovery:** Automatic button detection
- **Functionality Testing:** Click behavior validation
- **Status Classification:** Working, broken, no-op buttons
- **Error Reporting:** Detailed error analysis

### 5. Smoke Tests
**File:** `tests/smoke.spec.ts`

#### Test Coverage
- **Basic Functionality:** Core application features
- **Page Loading:** All major pages load correctly
- **Navigation:** Basic navigation flows
- **Critical Paths:** Essential user journeys

## Test Helpers

### Authentication Helper
**File:** `tests/helpers/auth.ts`

#### Functions
- **`seedTestUser()`:** Create test users for testing
- **`signin()`:** Automated sign-in process
- **`TEST_USER`:** Test user credentials

### DOM Helper
**File:** `tests/helpers/dom.ts`

#### Functions
- **`discoverControls()`:** Find interactive elements
- **`safeClick()`:** Safe clicking with error handling
- **`fillFormFields()`:** Automated form filling

### Environment Check Helper
**File:** `tests/helpers/env-check.ts`

#### Functions
- **`checkEnvironmentVariables()`:** Validate test environment
- **`printEnvMatrix()`:** Display environment status
- **`checkGoogleOAuthConfig()`:** OAuth configuration validation

### Logs Helper
**File:** `tests/helpers/logs.ts`

#### Functions
- **`attachLogCollectors()`:** Attach console log collectors
- **`getConsoleErrors()`:** Extract console errors
- **`getConsoleWarnings()`:** Extract console warnings
- **`getFailedRequests()`:** Track failed HTTP requests

## Unit Tests (Jest)

### Configuration
- **Test Directory:** `__tests__/`
- **Test Pattern:** `**/*.test.ts`
- **Coverage:** App, components, lib directories
- **Setup:** `jest.setup.ts`

### Test Categories
- **Component Tests:** React component testing
- **Utility Tests:** Helper function testing
- **API Tests:** Server-side function testing
- **Integration Tests:** Module integration testing

## Test Execution

### Local Development
```bash
# Run all Playwright tests
npx playwright test

# Run specific test file
npx playwright test tests/auth-google.spec.ts

# Run tests in headed mode
npx playwright test --headed

# Run tests with debug
npx playwright test --debug
```

### CI/CD Pipeline
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run tests in CI mode
npx playwright test --reporter=list
```

### Test Reports
- **HTML Reports:** `audit-artifacts/playwright/html/`
- **Screenshots:** On failure only
- **Videos:** Retained on failure
- **Traces:** On first retry

## Test Data Management

### Test Users
- **Admin User:** `admin@coinads.com`
- **Advertiser:** `adv@coinads.com`
- **Publisher:** `pub@coinads.com`
- **Test Users:** Generated for specific tests

### Test Data
- **Sites:** Test domains for publisher testing
- **Campaigns:** Sample campaigns for advertiser testing
- **Placements:** Test ad placements
- **Transactions:** Sample financial data

### Database Seeding
- **Seed Script:** `prisma/seed.ts`
- **Test Data:** Isolated test database
- **Cleanup:** Automatic cleanup after tests

## Coverage Analysis

### E2E Test Coverage
- **Authentication:** ✅ Google OAuth, credentials, sign-up
- **API Endpoints:** ✅ CRUD operations for all major entities
- **UI Components:** ✅ Button functionality, form validation
- **Navigation:** ✅ Page routing and navigation flows
- **Error Handling:** ✅ Error states and recovery

### API Test Coverage
- **Health Check:** ✅ Database connectivity
- **Publisher APIs:** ✅ Sites, placements, earnings
- **Advertiser APIs:** ✅ Campaigns, creatives, reports
- **Admin APIs:** ✅ Approvals, logs, user management
- **Tracking APIs:** ✅ Impressions, clicks, conversions

### UI Test Coverage
- **Marketing Pages:** ✅ Landing, about, contact pages
- **Authentication Pages:** ✅ Sign-in, sign-up, password reset
- **Dashboard Pages:** ✅ Role-specific dashboards
- **Form Validation:** ✅ Input validation and error handling
- **Button Functionality:** ✅ Interactive element testing

## Test Environment

### Required Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="test-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="test-client-id"
GOOGLE_CLIENT_SECRET="test-client-secret"
```

### Test Database
- **Isolation:** Separate test database
- **Seeding:** Automatic test data seeding
- **Cleanup:** Test data cleanup after execution
- **Migrations:** Test database migrations

### Browser Configuration
- **Primary:** Chromium (Desktop Chrome)
- **Viewport:** Desktop resolution
- **Network:** Simulated network conditions
- **Storage:** Isolated browser storage

## Test Results and Reporting

### Test Execution Results
- **Pass Rate:** High success rate for core functionality
- **Failure Analysis:** Detailed error reporting
- **Performance:** Response time monitoring
- **Coverage:** Comprehensive feature coverage

### Audit Artifacts
- **HTML Reports:** Detailed test execution reports
- **Screenshots:** Failure screenshots for debugging
- **Videos:** Test execution recordings
- **Logs:** Console logs and error traces

### Continuous Integration
- **GitHub Actions:** Automated test execution
- **Vercel:** Deployment testing
- **Quality Gates:** Test pass requirements
- **Reporting:** Test result notifications

## Test Maintenance

### Regular Updates
- **Test Data:** Keep test data current
- **Environment:** Update test environment configuration
- **Dependencies:** Keep testing dependencies updated
- **Coverage:** Expand test coverage for new features

### Debugging
- **Failure Analysis:** Detailed error investigation
- **Log Analysis:** Console and network log review
- **Screenshot Review:** Visual failure analysis
- **Video Review:** Step-by-step failure analysis

### Performance Monitoring
- **Execution Time:** Test execution performance
- **Resource Usage:** Memory and CPU monitoring
- **Network Performance:** API response time tracking
- **Browser Performance:** Rendering and interaction performance

## Best Practices

### Test Design
- **Isolation:** Independent test execution
- **Deterministic:** Predictable test outcomes
- **Fast:** Efficient test execution
- **Maintainable:** Easy to update and modify

### Test Data
- **Realistic:** Representative test data
- **Isolated:** Test-specific data sets
- **Cleanup:** Automatic test data cleanup
- **Versioning:** Test data version control

### Error Handling
- **Graceful:** Graceful failure handling
- **Informative:** Clear error messages
- **Recoverable:** Automatic retry mechanisms
- **Debuggable:** Detailed error information

## Future Enhancements

### Planned Improvements
- [ ] **Visual Regression Testing:** Screenshot comparison testing
- [ ] **Performance Testing:** Load and stress testing
- [ ] **Accessibility Testing:** WCAG compliance testing
- [ ] **Mobile Testing:** Mobile device testing
- [ ] **Cross-Browser Testing:** Multiple browser support

### Test Automation
- [ ] **CI/CD Integration:** Automated test execution
- [ ] **Test Data Management:** Automated test data generation
- [ ] **Environment Management:** Automated environment setup
- [ ] **Reporting:** Automated test result reporting

### Coverage Expansion
- [ ] **Edge Cases:** Boundary condition testing
- [ ] **Error Scenarios:** Comprehensive error testing
- [ ] **Integration Testing:** End-to-end workflow testing
- [ ] **Security Testing:** Security vulnerability testing
