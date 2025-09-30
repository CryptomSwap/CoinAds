#!/usr/bin/env node

/**
 * Build log guard script
 * Scans build output for known problematic patterns and fails if found
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface BuildLogIssue {
  pattern: string;
  message: string;
  severity: 'error' | 'warning';
}

// Known problematic patterns in build logs
const ISSUE_PATTERNS: BuildLogIssue[] = [
  {
    pattern: 'Event handlers cannot be passed to Client Component props',
    message: 'Client Component prop issue detected - check for event handler props being passed to client components',
    severity: 'error',
  },
  {
    pattern: 'Static page generation timeout',
    message: 'SSG timeout detected - ensure app routes use dynamic rendering',
    severity: 'error',
  },
  {
    pattern: 'server-only.*import.*misuse',
    message: 'Server-only import misuse detected - check for client-side imports of server-only modules',
    severity: 'error',
  },
  {
    pattern: 'Failed to generate static page',
    message: 'Static generation failure - check for dynamic content in static routes',
    severity: 'warning',
  },
  {
    pattern: 'Warning.*useEffect.*missing dependency',
    message: 'React Hook dependency warning - review useEffect dependencies',
    severity: 'warning',
  },
  {
    pattern: 'Warning.*Cannot update a component.*while rendering',
    message: 'React state update during render warning - check for state updates in render phase',
    severity: 'warning',
  },
];

interface ScanResult {
  issues: Array<BuildLogIssue & { line?: number; context?: string }>;
  totalErrors: number;
  totalWarnings: number;
  buildLogPath: string;
  scanSuccess: boolean;
}

function scanBuildLog(buildLogPath: string): ScanResult {
  const result: ScanResult = {
    issues: [],
    totalErrors: 0,
    totalWarnings: 0,
    buildLogPath,
    scanSuccess: false,
  };

  if (!existsSync(buildLogPath)) {
    console.error(`❌ Build log not found at: ${buildLogPath}`);
    return result;
  }

  try {
    const buildLog = readFileSync(buildLogPath, 'utf-8');
    const lines = buildLog.split('\n');

    // Scan each line for issues
    lines.forEach((line, index) => {
      ISSUE_PATTERNS.forEach(issue => {
        if (line.includes(issue.pattern)) {
          result.issues.push({
            ...issue,
            line: index + 1,
            context: line.trim(),
          });

          if (issue.severity === 'error') {
            result.totalErrors++;
          } else {
            result.totalWarnings++;
          }
        }
      });
    });

    result.scanSuccess = true;
  } catch (error) {
    console.error(`❌ Error reading build log: ${error}`);
  }

  return result;
}

function printResults(result: ScanResult): void {
  console.log('🔍 Build Log Guard Report');
  console.log('========================\n');

  console.log(`Build Log: ${result.buildLogPath}`);
  console.log(`Scan Status: ${result.scanSuccess ? '✅ Success' : '❌ Failed'}\n`);

  if (result.issues.length === 0) {
    console.log('✅ No issues found in build log');
    console.log('Build is clean and ready for deployment!');
    return;
  }

  console.log(`📊 Summary:`);
  console.log(`  ❌ Errors: ${result.totalErrors}`);
  console.log(`  ⚠️  Warnings: ${result.totalWarnings}`);
  console.log(`  📋 Total Issues: ${result.issues.length}\n`);

  // Group issues by severity
  const errors = result.issues.filter(issue => issue.severity === 'error');
  const warnings = result.issues.filter(issue => issue.severity === 'warning');

  if (errors.length > 0) {
    console.log('❌ ERRORS (must be fixed):');
    errors.forEach(issue => {
      console.log(`  Line ${issue.line}: ${issue.message}`);
      console.log(`    Context: ${issue.context}`);
      console.log('');
    });
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (should be reviewed):');
    warnings.forEach(issue => {
      console.log(`  Line ${issue.line}: ${issue.message}`);
      console.log(`    Context: ${issue.context}`);
      console.log('');
    });
  }
}

function saveResults(result: ScanResult): void {
  const fs = require('fs');
  const path = require('path');
  
  const artifactsDir = path.join(process.cwd(), 'artifacts', 'launch');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }
  
  const outputFile = path.join(artifactsDir, 'build-log-scan.txt');
  
  let report = 'Build Log Guard Scan Report\n';
  report += '============================\n\n';
  report += `Scan Date: ${new Date().toISOString()}\n`;
  report += `Build Log: ${result.buildLogPath}\n`;
  report += `Scan Status: ${result.scanSuccess ? 'Success' : 'Failed'}\n\n`;
  
  if (result.issues.length === 0) {
    report += 'No issues found in build log.\n';
  } else {
    report += `Summary:\n`;
    report += `  Errors: ${result.totalErrors}\n`;
    report += `  Warnings: ${result.totalWarnings}\n`;
    report += `  Total Issues: ${result.issues.length}\n\n`;
    
    result.issues.forEach(issue => {
      report += `${issue.severity.toUpperCase()}: ${issue.message}\n`;
      report += `  Line ${issue.line}: ${issue.context}\n\n`;
    });
  }
  
  fs.writeFileSync(outputFile, report);
  console.log(`📄 Detailed report saved to: ${outputFile}`);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const buildLogPath = args[0] || join(process.cwd(), '.next', 'build.log');
  
  const result = scanBuildLog(buildLogPath);
  printResults(result);
  saveResults(result);
  
  // Exit with error code if critical issues found
  if (result.totalErrors > 0) {
    console.log('\n❌ Build log contains errors. Deployment blocked.');
    process.exit(1);
  } else if (result.totalWarnings > 0) {
    console.log('\n⚠️  Build log contains warnings. Review before deployment.');
    process.exit(0);
  } else {
    console.log('\n✅ Build log is clean. Ready for deployment!');
    process.exit(0);
  }
}

export { scanBuildLog, type ScanResult, ISSUE_PATTERNS };
