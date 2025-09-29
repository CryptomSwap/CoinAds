#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface ApiTestResult {
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  response?: any;
  error?: string;
  timestamp: number;
}

interface DbTestSummary {
  health: ApiTestResult;
  publisherSites: {
    create: ApiTestResult;
    read: ApiTestResult;
    update: ApiTestResult;
    delete: ApiTestResult;
  };
  advertiserCampaigns: {
    create: ApiTestResult;
    read: ApiTestResult;
    update?: ApiTestResult;
    delete?: ApiTestResult;
  };
  createdResources: Array<{
    type: string;
    id: string;
    data: any;
  }>;
}

interface PageTestResult {
  route: string;
  title: string;
  h1?: string;
  authRequired: boolean;
  authSuccess: boolean;
  controlsFound: number;
  controlsClicked: number;
  controlsSkipped: number;
  clicks: Array<{
    text: string;
    type: string;
    success: boolean;
    error?: string;
  }>;
  consoleErrors: string[];
  consoleWarnings: string[];
  failedRequests: Array<{
    url: string;
    status: number;
    statusText: string;
    method: string;
  }>;
  formFieldsFilled: number;
  formFieldsSkipped: number;
  formErrors: string[];
  screenshot?: string;
  timestamp: number;
}

interface UITestSummary {
  totalPages: number;
  authSuccess: boolean;
  totalControlsFound: number;
  totalControlsClicked: number;
  totalControlsSkipped: number;
  totalConsoleErrors: number;
  totalConsoleWarnings: number;
  totalFailedRequests: number;
  totalFormFieldsFilled: number;
  pages: Array<{
    route: string;
    title: string;
    controlsFound: number;
    controlsClicked: number;
    controlsSkipped: number;
    consoleErrors: number;
    failedRequests: number;
    screenshot?: string;
  }>;
}

function loadApiResults(): DbTestSummary | null {
  const apiDir = path.join(process.cwd(), 'audit-artifacts', 'api');
  if (!fs.existsSync(apiDir)) {
    return null;
  }

  const files = fs.readdirSync(apiDir).filter(f => f.startsWith('db-api-test-') && f.endsWith('.json'));
  if (files.length === 0) {
    return null;
  }

  // Get the most recent file
  const latestFile = files.sort().pop()!;
  const filePath = path.join(apiDir, latestFile);
  
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.log('Error loading API results:', error);
    return null;
  }
}

function loadUIResults(): UITestSummary | null {
  const uiDir = path.join(process.cwd(), 'audit-artifacts', 'ui');
  if (!fs.existsSync(uiDir)) {
    return null;
  }

  const files = fs.readdirSync(uiDir).filter(f => f.startsWith('ui-test-summary-') && f.endsWith('.json'));
  if (files.length === 0) {
    return null;
  }

  // Get the most recent file
  const latestFile = files.sort().pop()!;
  const filePath = path.join(uiDir, latestFile);
  
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.log('Error loading UI results:', error);
    return null;
  }
}

function generateReport(apiResults: DbTestSummary | null, uiResults: UITestSummary | null): string {
  const timestamp = new Date().toISOString();
  const baseURL = process.env.RUNTIME_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  let report = `# Database + UI End-to-End Audit Report

**Generated:** ${timestamp}  
**Base URL:** ${baseURL}  
**Environment:** ${process.env.NODE_ENV || 'development'}

## Executive Summary

`;

  // Database connectivity summary
  if (apiResults) {
    const healthOk = apiResults.health.success;
    const dbConnected = apiResults.health.response?.db === 'connected';
    
    report += `### Database Connectivity: ${healthOk && dbConnected ? '✅ PASS' : '❌ FAIL'}\n`;
    report += `- Health endpoint: ${apiResults.health.success ? '✅' : '❌'} (${apiResults.health.status})\n`;
    report += `- Database status: ${dbConnected ? '✅ Connected' : '❌ Not connected'}\n\n`;
    
    // API endpoints summary
    report += `### API Endpoints Tested:\n`;
    report += `- Publisher Sites: `;
    const sitesCreate = apiResults.publisherSites.create.success;
    const sitesRead = apiResults.publisherSites.read.success;
    const sitesUpdate = apiResults.publisherSites.update?.success;
    const sitesDelete = apiResults.publisherSites.delete?.success;
    report += `Create ${sitesCreate ? '✅' : '❌'}, Read ${sitesRead ? '✅' : '❌'}, Update ${sitesUpdate ? '✅' : '❌'}, Delete ${sitesDelete ? '✅' : '❌'}\n`;
    
    report += `- Advertiser Campaigns: `;
    const campaignsCreate = apiResults.advertiserCampaigns.create.success;
    const campaignsRead = apiResults.advertiserCampaigns.read.success;
    report += `Create ${campaignsCreate ? '✅' : '❌'}, Read ${campaignsRead ? '✅' : '❌'}\n\n`;
    
    // Created resources
    if (apiResults.createdResources.length > 0) {
      report += `### Test Resources Created:\n`;
      apiResults.createdResources.forEach(resource => {
        report += `- ${resource.type}: ${resource.id}\n`;
      });
      report += '\n';
    }
  } else {
    report += `### Database Connectivity: ⚠️ NO DATA\n`;
    report += `- API test results not found\n\n`;
  }

  // UI summary
  if (uiResults) {
    report += `### UI Testing: ${uiResults.authSuccess ? '✅ AUTHENTICATED' : '⚠️ PUBLIC ONLY'}\n`;
    report += `- Pages tested: ${uiResults.totalPages}\n`;
    report += `- Controls found: ${uiResults.totalControlsFound}\n`;
    report += `- Controls clicked: ${uiResults.totalControlsClicked}\n`;
    report += `- Controls skipped: ${uiResults.totalControlsSkipped}\n`;
    report += `- Form fields filled: ${uiResults.totalFormFieldsFilled}\n`;
    report += `- Console errors: ${uiResults.totalConsoleErrors}\n`;
    report += `- Console warnings: ${uiResults.totalConsoleWarnings}\n`;
    report += `- Failed requests: ${uiResults.totalFailedRequests}\n\n`;
  } else {
    report += `### UI Testing: ⚠️ NO DATA\n`;
    report += `- UI test results not found\n\n`;
  }

  // Detailed API results
  if (apiResults) {
    report += `## Database Verification Details\n\n`;
    
    // Health check
    report += `### Health Check\n`;
    report += `- **Endpoint:** ${apiResults.health.endpoint}\n`;
    report += `- **Status:** ${apiResults.health.status}\n`;
    report += `- **Success:** ${apiResults.health.success ? '✅' : '❌'}\n`;
    if (apiResults.health.error) {
      report += `- **Error:** ${apiResults.health.error}\n`;
    }
    if (apiResults.health.response) {
      report += `- **Response:** \`${JSON.stringify(apiResults.health.response)}\`\n`;
    }
    report += '\n';
    
    // Publisher Sites
    report += `### Publisher Sites API\n`;
    report += `- **Create:** ${apiResults.publisherSites.create.success ? '✅' : '❌'} (${apiResults.publisherSites.create.status})\n`;
    if (apiResults.publisherSites.create.error) {
      report += `  - Error: ${apiResults.publisherSites.create.error}\n`;
    }
    report += `- **Read:** ${apiResults.publisherSites.read.success ? '✅' : '❌'} (${apiResults.publisherSites.read.status})\n`;
    if (apiResults.publisherSites.read.error) {
      report += `  - Error: ${apiResults.publisherSites.read.error}\n`;
    }
    if (apiResults.publisherSites.update) {
      report += `- **Update:** ${apiResults.publisherSites.update.success ? '✅' : '❌'} (${apiResults.publisherSites.update.status})\n`;
      if (apiResults.publisherSites.update.error) {
        report += `  - Error: ${apiResults.publisherSites.update.error}\n`;
      }
    }
    if (apiResults.publisherSites.delete) {
      report += `- **Delete:** ${apiResults.publisherSites.delete.success ? '✅' : '❌'} (${apiResults.publisherSites.delete.status})\n`;
      if (apiResults.publisherSites.delete.error) {
        report += `  - Error: ${apiResults.publisherSites.delete.error}\n`;
      }
    }
    report += '\n';
    
    // Advertiser Campaigns
    report += `### Advertiser Campaigns API\n`;
    report += `- **Create:** ${apiResults.advertiserCampaigns.create.success ? '✅' : '❌'} (${apiResults.advertiserCampaigns.create.status})\n`;
    if (apiResults.advertiserCampaigns.create.error) {
      report += `  - Error: ${apiResults.advertiserCampaigns.create.error}\n`;
    }
    report += `- **Read:** ${apiResults.advertiserCampaigns.read.success ? '✅' : '❌'} (${apiResults.advertiserCampaigns.read.status})\n`;
    if (apiResults.advertiserCampaigns.read.error) {
      report += `  - Error: ${apiResults.advertiserCampaigns.read.error}\n`;
    }
    if (apiResults.advertiserCampaigns.update) {
      report += `- **Update:** ${apiResults.advertiserCampaigns.update.success ? '✅' : '❌'} (${apiResults.advertiserCampaigns.update.status})\n`;
      if (apiResults.advertiserCampaigns.update.error) {
        report += `  - Error: ${apiResults.advertiserCampaigns.update.error}\n`;
      }
    }
    if (apiResults.advertiserCampaigns.delete) {
      report += `- **Delete:** ${apiResults.advertiserCampaigns.delete.success ? '✅' : '❌'} (${apiResults.advertiserCampaigns.delete.status})\n`;
      if (apiResults.advertiserCampaigns.delete.error) {
        report += `  - Error: ${apiResults.advertiserCampaigns.delete.error}\n`;
      }
    }
    report += '\n';
  }

  // Detailed UI results
  if (uiResults) {
    report += `## UI Testing Details\n\n`;
    
    report += `### Pages Tested\n\n`;
    report += `| Route | Title | Auth | Controls (Found/Clicked/Skipped) | Console Errors | Failed Requests | Screenshot |\n`;
    report += `|-------|-------|------|-----------------------------------|----------------|-----------------|------------|\n`;
    
    uiResults.pages.forEach(page => {
      const authStatus = page.route.startsWith('/app/') ? (uiResults.authSuccess ? '✅' : '❌') : 'N/A';
      const controls = `${page.controlsFound}/${page.controlsClicked}/${page.controlsSkipped}`;
      const screenshot = page.screenshot ? `[📸](${page.screenshot})` : 'N/A';
      
      report += `| ${page.route} | ${page.title || 'N/A'} | ${authStatus} | ${controls} | ${page.consoleErrors} | ${page.failedRequests} | ${screenshot} |\n`;
    });
    
    report += '\n';
  }

  // Issues and recommendations
  report += `## Issues and Recommendations\n\n`;
  
  if (apiResults) {
    const failedEndpoints = [];
    if (!apiResults.health.success) failedEndpoints.push('Health check');
    if (!apiResults.publisherSites.create.success) failedEndpoints.push('Publisher Sites Create');
    if (!apiResults.publisherSites.read.success) failedEndpoints.push('Publisher Sites Read');
    if (apiResults.publisherSites.update && !apiResults.publisherSites.update.success) failedEndpoints.push('Publisher Sites Update');
    if (apiResults.publisherSites.delete && !apiResults.publisherSites.delete.success) failedEndpoints.push('Publisher Sites Delete');
    if (!apiResults.advertiserCampaigns.create.success) failedEndpoints.push('Advertiser Campaigns Create');
    if (!apiResults.advertiserCampaigns.read.success) failedEndpoints.push('Advertiser Campaigns Read');
    
    if (failedEndpoints.length > 0) {
      report += `### Database Issues\n`;
      report += `- Failed endpoints: ${failedEndpoints.join(', ')}\n`;
      report += `- Review API logs and database connectivity\n\n`;
    }
  }
  
  if (uiResults) {
    const pagesWithErrors = uiResults.pages.filter(p => p.consoleErrors > 0 || p.failedRequests > 0);
    if (pagesWithErrors.length > 0) {
      report += `### UI Issues\n`;
      report += `- Pages with console errors: ${pagesWithErrors.length}\n`;
      report += `- Pages with failed requests: ${pagesWithErrors.filter(p => p.failedRequests > 0).length}\n`;
      report += `- Review browser console and network logs\n\n`;
    }
    
    if (!uiResults.authSuccess) {
      report += `### Authentication Issues\n`;
      report += `- Authentication failed - only public pages were tested\n`;
      report += `- Check test user credentials and auth configuration\n\n`;
    }
  }
  
  // Artifacts
  report += `## Artifacts\n\n`;
  report += `- **Screenshots:** \`audit-artifacts/screenshots/\`\n`;
  report += `- **API Results:** \`audit-artifacts/api/\`\n`;
  report += `- **UI Results:** \`audit-artifacts/ui/\`\n`;
  report += `- **Playwright Report:** \`audit-artifacts/playwright/html/index.html\`\n\n`;
  
  report += `---\n`;
  report += `*Report generated by DB + UI Audit System*\n`;
  
  return report;
}

function main() {
  console.log('📊 Generating audit report...');
  
  const apiResults = loadApiResults();
  const uiResults = loadUIResults();
  
  if (!apiResults && !uiResults) {
    console.log('❌ No test results found. Run the audit tests first.');
    process.exit(1);
  }
  
  const report = generateReport(apiResults, uiResults);
  
  // Ensure docs directory exists
  const docsDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  // Write report
  const reportFile = path.join(docsDir, 'db-and-ui-audit.md');
  fs.writeFileSync(reportFile, report);
  
  console.log(`✅ Audit report generated: ${reportFile}`);
  
  // Print summary
  if (apiResults) {
    const healthOk = apiResults.health.success;
    console.log(`📊 Database: ${healthOk ? '✅' : '❌'} (${apiResults.health.status})`);
  }
  
  if (uiResults) {
    console.log(`📊 UI: ${uiResults.totalPages} pages, ${uiResults.totalControlsClicked}/${uiResults.totalControlsFound} controls clicked`);
    console.log(`📊 Errors: ${uiResults.totalConsoleErrors} console, ${uiResults.totalFailedRequests} network`);
  }
}

if (require.main === module) {
  main();
}
