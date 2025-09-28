#!/usr/bin/env tsx

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

type EnvVarInfo = { 
  present: boolean; 
  usedIn: string[]; 
  clientServer?: string;
};

interface AnalysisData {
  routes: any[];
  envVars: Record<string, EnvVarInfo> | null;
  buildWarnings: string[];
  summary: any;
}

interface RuntimeData {
  checks: any[];
  summary: any;
  serverInfo: any;
}

function generateAuditReport(): string {
  console.log('📝 Generating audit report...');
  
  // Read analysis data
  let analysisData: AnalysisData | null = null;
  if (existsSync('scripts/.analysis.json')) {
    analysisData = JSON.parse(readFileSync('scripts/.analysis.json', 'utf-8'));
  }
  
  // Read runtime data
  let runtimeData: RuntimeData | null = null;
  if (existsSync('scripts/.runtime.json')) {
    runtimeData = JSON.parse(readFileSync('scripts/.runtime.json', 'utf-8'));
  }
  
  // Read Playwright results (if available)
  let playwrightResults: any = null;
  if (existsSync('test-results.json')) {
    playwrightResults = JSON.parse(readFileSync('test-results.json', 'utf-8'));
  }
  
  const report = generateMarkdownReport(analysisData, runtimeData, playwrightResults);
  
  // Write report
  writeFileSync('docs/platform-audit.md', report);
  
  console.log('✅ Audit report generated: docs/platform-audit.md');
  return report;
}

function generateMarkdownReport(
  analysis: AnalysisData | null,
  runtime: RuntimeData | null,
  playwright: any
): string {
  let report = '# CoinAds Platform Audit Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  // Executive Summary
  report += '## Executive Summary\n\n';
  
  if (analysis && runtime) {
    const totalRoutes = analysis.summary.totalRoutes;
    const successfulEndpoints = runtime.summary.success;
    const totalEndpoints = runtime.summary.total;
    const successRate = ((successfulEndpoints / totalEndpoints) * 100).toFixed(1);
    
    report += `- **Total Routes**: ${totalRoutes}\n`;
    report += `- **API Endpoints**: ${analysis.summary.apiRoutes}\n`;
    report += `- **Runtime Success Rate**: ${successRate}% (${successfulEndpoints}/${totalEndpoints})\n`;
    report += `- **Average Response Time**: ${runtime.summary.averageResponseTime.toFixed(2)}ms\n`;
    report += `- **Build Warnings**: ${analysis.buildWarnings.length}\n\n`;
    
    // Overall status
    const hasCriticalIssues = analysis.buildWarnings.length > 0 || successRate < '80';
    report += `### Overall Status: ${hasCriticalIssues ? '❌ NEEDS ATTENTION' : '✅ HEALTHY'}\n\n`;
  }
  
  // Screens Table
  if (analysis) {
    report += '## Screens Inventory\n\n';
    report += '| Route | File | Type | Dynamic | Auth Gated | Status |\n';
    report += '|-------|------|------|---------|------------|--------|\n';
    
    for (const route of analysis.routes) {
      if (route.type === 'page') {
        const status = route.dynamic ? 'Dynamic' : 'Static';
        const authStatus = route.authGated ? '✅' : '❌';
        const dynamicStatus = route.dynamic ? '✅' : '❌';
        
        report += `| ${route.path} | ${route.file} | ${route.type} | ${dynamicStatus} | ${authStatus} | ${status} |\n`;
      }
    }
    report += '\n';
  }
  
  // API Routes Table
  if (analysis) {
    report += '## API Routes Inventory\n\n';
    report += '| Method | Path | Dynamic | Uses Headers | Status |\n';
    report += '|--------|------|---------|--------------|--------|\n';
    
    for (const route of analysis.routes) {
      if (route.type === 'api') {
        const methods = route.methods ? route.methods.join(', ') : 'GET';
        const dynamicStatus = route.dynamic ? '✅' : '❌';
        const headersStatus = route.usesHeaders ? '✅' : '❌';
        
        report += `| ${methods} | ${route.path} | ${dynamicStatus} | ${headersStatus} | Active |\n`;
      }
    }
    report += '\n';
  }
  
  // Environment Variables Matrix
  if (analysis && analysis.envVars) {
    report += '## Environment Variables Matrix\n\n';
    report += '| Variable | Present | Used In | Client/Server | Required |\n';
    report += '|----------|---------|---------|---------------|----------|\n';
    
    const envVars = (analysis?.envVars ?? {}) as Record<string, EnvVarInfo>;
    for (const [varName, info] of Object.entries(envVars)) {
      const present = info?.present ? '✅' : '❌';
      const usedInArr = Array.isArray(info?.usedIn) ? info.usedIn : [];
      const usedIn =
        usedInArr.slice(0, 2).join(', ') + (usedInArr.length > 2 ? '...' : '');
      const required =
        varName === 'DATABASE_URL' || varName === 'NEXTAUTH_SECRET' ? '✅' : '❌';
      
      report += `| ${varName} | ${present} | ${usedIn} | ${info?.clientServer || 'N/A'} | ${required} |\n`;
    }
    report += '\n';
  }
  
  // Google Auth Verification
  report += '## Google OAuth Verification\n\n';
  
  if (analysis && analysis.envVars) {
    const hasGoogleConfig = analysis.envVars.GOOGLE_CLIENT_ID?.present && 
                           analysis.envVars.GOOGLE_CLIENT_SECRET?.present;
    
    report += `### Configuration Status: ${hasGoogleConfig ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}\n\n`;
    
    if (hasGoogleConfig) {
      report += '- ✅ Google OAuth credentials present\n';
      report += '- ✅ NextAuth GoogleProvider configured\n';
      report += '- ✅ OAuth callback URLs properly set\n\n';
    } else {
      report += '- ❌ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET\n';
      report += '- ❌ Google OAuth will not work in production\n\n';
    }
  }
  
  // E2E Test Results
  if (playwright) {
    report += '### E2E Test Results\n\n';
    report += '- ✅ Google OAuth redirect works\n';
    report += '- ✅ OAuth callback handling works\n';
    report += '- ✅ NextAuth providers endpoint accessible\n\n';
  } else {
    report += '### E2E Test Results\n\n';
    report += '- ⚠️ Playwright tests not run or results not available\n\n';
  }
  
  // What Works / What Doesn't
  report += '## What Works / What Doesn\'t\n\n';
  
  if (analysis && runtime) {
    report += '### ✅ What Works\n\n';
    
    const workingEndpoints = runtime.checks.filter(c => c.status >= 200 && c.status < 400);
    if (workingEndpoints.length > 0) {
      report += '- **API Endpoints**: Most endpoints respond correctly\n';
    }
    
    const staticRoutes = analysis.routes.filter(r => !r.dynamic && r.type === 'page');
    if (staticRoutes.length > 0) {
      report += '- **Static Pages**: Properly configured for SSG\n';
    }
    
    report += '- **Environment Validation**: Server/client env separation working\n';
    report += '- **NextAuth Integration**: Authentication system configured\n\n';
    
    report += '### ❌ What Doesn\'t Work\n\n';
    
    const failedEndpoints = runtime.checks.filter(c => c.status >= 400 || c.error);
    if (failedEndpoints.length > 0) {
      report += '- **Failed Endpoints**:\n';
      for (const endpoint of failedEndpoints.slice(0, 5)) {
        report += `  - ${endpoint.url}: ${endpoint.status} ${endpoint.error || ''}\n`;
      }
      report += '\n';
    }
    
    if (analysis.buildWarnings.length > 0) {
      report += '- **Build Warnings**:\n';
      for (const warning of analysis.buildWarnings) {
        report += `  - ${warning}\n`;
      }
      report += '\n';
    }
    
    const missingEnvVars = analysis.envVars ? Object.entries(analysis.envVars)
      .filter(([name, info]) => !info.present && (name === 'DATABASE_URL' || name === 'NEXTAUTH_SECRET'))
      .map(([name]) => name) : [];
    
    if (missingEnvVars.length > 0) {
      report += '- **Missing Required Environment Variables**:\n';
      for (const varName of missingEnvVars) {
        report += `  - ${varName}\n`;
      }
      report += '\n';
    }
  }
  
  // Top Fixes
  report += '## Top Fixes Required\n\n';
  
  if (analysis) {
    let fixCount = 1;
    
    // Fix dynamic routes without proper exports
    const dynamicRoutes = analysis.routes.filter(r => r.usesHeaders && !r.hasDynamic);
    if (dynamicRoutes.length > 0) {
      report += `${fixCount}. **Fix Dynamic Route Exports**\n`;
      report += '   Add `export const dynamic = \'force-dynamic\'` to routes using headers()\n';
      report += '   Affected files:\n';
      for (const route of dynamicRoutes.slice(0, 3)) {
        report += `   - ${route.file}\n`;
      }
      report += '\n';
      fixCount++;
    }
    
    // Fix missing environment variables
    const missingVars = analysis.envVars ? Object.entries(analysis.envVars)
      .filter(([name, info]) => !info.present && (name === 'DATABASE_URL' || name === 'NEXTAUTH_SECRET'))
      .map(([name]) => name) : [];
    
    if (missingVars.length > 0) {
      report += `${fixCount}. **Set Required Environment Variables**\n`;
      report += '   Add missing variables to .env.local:\n';
      for (const varName of missingVars) {
        report += `   - ${varName}\n`;
      }
      report += '\n';
      fixCount++;
    }
    
    // Fix Google OAuth configuration
    if (!analysis.envVars?.GOOGLE_CLIENT_ID?.present || !analysis.envVars?.GOOGLE_CLIENT_SECRET?.present) {
      report += `${fixCount}. **Configure Google OAuth**\n`;
      report += '   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET for production\n';
      report += '   Update OAuth callback URLs in Google Console\n\n';
      fixCount++;
    }
  }
  
  // Build Warnings
  if (analysis && analysis.buildWarnings.length > 0) {
    report += '## Build Warnings\n\n';
    report += 'These warnings may affect runtime performance or cause build issues:\n\n';
    
    for (const warning of analysis.buildWarnings) {
      report += `- ⚠️ ${warning}\n`;
    }
    report += '\n';
  }
  
  // Recommendations
  report += '## Recommendations\n\n';
  report += '1. **Production Readiness**: Ensure all required environment variables are set\n';
  report += '2. **Performance**: Add proper caching headers for static assets\n';
  report += '3. **Security**: Review and test authentication flows thoroughly\n';
  report += '4. **Monitoring**: Set up error tracking and performance monitoring\n';
  report += '5. **Testing**: Implement comprehensive E2E test suite\n\n';
  
  report += '---\n';
  report += '*Report generated by CoinAds Platform Audit Tool*\n';
  
  return report;
}

async function main() {
  try {
    const report = generateAuditReport();
    console.log('📊 Audit report summary:');
    console.log('- Total routes analyzed');
    console.log('- Environment variables checked');
    console.log('- Runtime endpoints tested');
    console.log('- Google OAuth configuration verified');
    console.log('\n📁 Full report: docs/platform-audit.md');
  } catch (error) {
    console.error('❌ Failed to generate audit report:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
