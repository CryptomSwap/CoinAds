#!/usr/bin/env tsx

/**
 * Button Audit Report Generator
 * 
 * Merges static scan and runtime probe results into comprehensive audit reports.
 * Generates both Markdown and CSV outputs.
 */

import fs from 'fs';
import path from 'path';

interface StaticButtonControl {
  route: string;
  file: string;
  line: number;
  label: string;
  type: string;
  authRole?: string;
  expected: string;
  actual: string;
  target?: string;
  apiMethod?: string;
  apiPath?: string;
  status: '✅' | '⚠️' | '❌' | '🔒' | '🧭';
  notes: string;
  component: string;
  props: Record<string, any>;
}

interface RuntimeButtonResult {
  route: string;
  label: string;
  type: string;
  clicked: boolean;
  result: {
    url?: string;
    status?: number;
    error?: string;
    consoleErrors: string[];
    networkErrors: string[];
  };
  skipped: boolean;
  skipReason?: string;
}

interface StaticScanResult {
  controls: StaticButtonControl[];
  summary: {
    total: number;
    byStatus: Record<string, number>;
    byArea: Record<string, number>;
  };
}

interface RuntimeScanResult {
  buttons: RuntimeButtonResult[];
  summary: {
    total: number;
    clicked: number;
    skipped: number;
    errors: number;
  };
}

interface MergedButtonControl {
  route: string;
  file: string;
  line: number;
  label: string;
  type: string;
  authRole?: string;
  expected: string;
  actual: string;
  target?: string;
  apiMethod?: string;
  apiPath?: string;
  status: '✅' | '⚠️' | '❌' | '🔒' | '🧭';
  notes: string;
  runtimeResult?: RuntimeButtonResult;
  finalStatus: '✅' | '⚠️' | '❌' | '🔒' | '🧭';
  finalNotes: string;
}

function loadStaticResults(): StaticScanResult | null {
  const staticPath = path.join(process.cwd(), 'tools', '.artifacts', 'button-scan.json');
  if (!fs.existsSync(staticPath)) {
    console.warn('Static scan results not found. Run: tsx tools/scan-buttons.ts');
    return null;
  }
  
  try {
    const content = fs.readFileSync(staticPath, 'utf-8');
    const rawResults = JSON.parse(content);
    
    // Convert raw scan results to StaticScanResult format
    if (Array.isArray(rawResults)) {
      const controls: StaticButtonControl[] = rawResults.map((item: any) => ({
        route: `/${item.file.replace(/\\/g, '/').replace(/^app\//, '').replace(/\/page\.tsx$/, '')}`,
        file: item.file,
        line: item.line,
        label: item.text || 'Unknown',
        type: item.type,
        authRole: 'Authenticated',
        expected: item.status === 'WORKING' ? 'navigate' : item.status === 'NO-OP' ? 'unknown' : 'unknown',
        actual: item.status === 'WORKING' ? 'navigate' : item.status === 'NO-OP' ? 'no handler' : 'unknown',
        target: item.href || '',
        status: item.status === 'WORKING' ? '✅' : item.status === 'NO-OP' ? '⚠️' : item.status === 'AUTH-GATED' ? '🔒' : '⚠️',
        notes: item.status === 'NO-OP' ? 'No onClick or href' : '',
        component: item.file,
        props: {}
      }));
      
      return {
        controls,
        summary: {
          total: controls.length,
          byStatus: {
            '✅': controls.filter(c => c.status === '✅').length,
            '⚠️': controls.filter(c => c.status === '⚠️').length,
            '❌': controls.filter(c => c.status === '❌').length,
            '🔒': controls.filter(c => c.status === '🔒').length,
            '🧭': controls.filter(c => c.status === '🧭').length
          },
          byArea: {}
        }
      };
    }
    
    return rawResults as StaticScanResult;
  } catch (error) {
    console.error('Error loading static results:', error);
    return null;
  }
}

function loadRuntimeResults(): RuntimeScanResult | null {
  const runtimePath = path.join(process.cwd(), 'tests', '.artifacts', 'button-audit-runtime.json');
  if (!fs.existsSync(runtimePath)) {
    console.warn('Runtime scan results not found. Run: npx playwright test tests/button-audit.spec.ts');
    return null;
  }
  
  try {
    const content = fs.readFileSync(runtimePath, 'utf-8');
    return JSON.parse(content) as RuntimeScanResult;
  } catch (error) {
    console.error('Error loading runtime results:', error);
    return null;
  }
}

function mergeResults(staticResult: StaticScanResult, runtimeResult?: RuntimeScanResult): MergedButtonControl[] {
  const merged: MergedButtonControl[] = [];
  
  // Create a map of runtime results by route and label
  const runtimeMap = new Map<string, RuntimeButtonResult>();
  if (runtimeResult) {
    runtimeResult.buttons.forEach(button => {
      const key = `${button.route}:${button.label}`;
      runtimeMap.set(key, button);
    });
  }
  
  // Merge static controls with runtime results
  staticResult.controls.forEach(control => {
    const key = `${control.route}:${control.label}`;
    const runtimeResult = runtimeMap.get(key);
    
    let finalStatus = control.status;
    let finalNotes = control.notes;
    
    // Update status based on runtime results
    if (runtimeResult) {
      if (runtimeResult.skipped) {
        finalNotes += ` (Runtime: skipped - ${runtimeResult.skipReason})`;
      } else if (runtimeResult.result.error) {
        finalStatus = '❌';
        finalNotes += ` (Runtime error: ${runtimeResult.result.error})`;
      } else if (runtimeResult.result.consoleErrors.length > 0) {
        finalStatus = '❌';
        finalNotes += ` (Console errors: ${runtimeResult.result.consoleErrors.length})`;
      } else if (runtimeResult.result.networkErrors.length > 0) {
        finalStatus = '❌';
        finalNotes += ` (Network errors: ${runtimeResult.result.networkErrors.length})`;
      } else if (runtimeResult.clicked && runtimeResult.result.url) {
        // Successful navigation
        if (finalStatus === '🧭') {
          finalStatus = '✅';
          finalNotes += ` (Runtime: navigated to ${runtimeResult.result.url})`;
        }
      }
    }
    
    merged.push({
      ...control,
      runtimeResult,
      finalStatus,
      finalNotes
    });
  });
  
  return merged;
}

function generateSummary(merged: MergedButtonControl[]): string {
  const total = merged.length;
  const byStatus = merged.reduce((acc, control) => {
    acc[control.finalStatus] = (acc[control.finalStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byArea = merged.reduce((acc, control) => {
    let area = 'Other';
    if (control.route.startsWith('/app/admin/')) area = 'Admin';
    else if (control.route.startsWith('/app/advertiser/')) area = 'Advertiser';
    else if (control.route.startsWith('/app/publisher/')) area = 'Publisher';
    else if (control.route.startsWith('/app/')) area = 'App';
    else if (control.route.startsWith('/auth/')) area = 'Auth';
    else if (control.route.startsWith('/legal/')) area = 'Legal';
    else if (control.route === '/' || control.route.startsWith('/about') || control.route.startsWith('/contact')) area = 'Marketing';
    
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return `## Summary

**Total Controls Found**: ${total}

### By Status
${Object.entries(byStatus).map(([status, count]) => `- ${status}: ${count}`).join('\n')}

### By Area
${Object.entries(byArea).map(([area, count]) => `- ${area}: ${count}`).join('\n')}`;
}

function generateTopFixes(merged: MergedButtonControl[]): string {
  const issues = merged.filter(control => 
    control.finalStatus === '⚠️' || 
    control.finalStatus === '❌' || 
    control.finalStatus === '🧭'
  );
  
  // Group by issue type and file
  const issueGroups = new Map<string, MergedButtonControl[]>();
  issues.forEach(control => {
    const key = `${control.finalStatus}:${control.file}`;
    if (!issueGroups.has(key)) {
      issueGroups.set(key, []);
    }
    issueGroups.get(key)!.push(control);
  });
  
  // Sort by frequency and importance
  const sortedIssues = Array.from(issueGroups.entries())
    .sort((a, b) => {
      // Prioritize by status (❌ > ⚠️ > 🧭)
      const statusPriority = { '❌': 3, '⚠️': 2, '🧭': 1 };
      const aPriority = statusPriority[a[0].split(':')[0] as keyof typeof statusPriority] || 0;
      const bPriority = statusPriority[b[0].split(':')[0] as keyof typeof statusPriority] || 0;
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      return b[1].length - a[1].length;
    })
    .slice(0, 10);
  
  return `## Top 10 Fixes (by Impact)

${sortedIssues.map(([key, controls], index) => {
  const [status, file] = key.split(':');
  const count = controls.length;
  const firstControl = controls[0];
  
  let recommendation = '';
  if (status === '❌') {
    recommendation = 'Fix broken functionality or add proper error handling';
  } else if (status === '⚠️') {
    recommendation = 'Implement missing functionality or remove placeholder';
  } else if (status === '🧭') {
    recommendation = 'Add proper navigation target or handler';
  }
  
  return `${index + 1}. **${file}** (${count} issues)
   - Status: ${status}
   - Recommendation: ${recommendation}
   - Example: "${firstControl.label}"`;
}).join('\n\n')}`;
}

function generatePerScreenMatrix(merged: MergedButtonControl[]): string {
  // Group by route
  const byRoute = new Map<string, MergedButtonControl[]>();
  merged.forEach(control => {
    if (!byRoute.has(control.route)) {
      byRoute.set(control.route, []);
    }
    byRoute.get(control.route)!.push(control);
  });
  
  // Sort routes
  const sortedRoutes = Array.from(byRoute.keys()).sort();
  
  return `## Per-Screen Matrix

${sortedRoutes.map(route => {
  const controls = byRoute.get(route)!;
  
  return `### ${route}

| Label/Text | Type | File:Line | Auth/Role | Expected | Actual | Target | Status | Notes |
|------------|------|-----------|-----------|----------|--------|--------|--------|-------|
${controls.map(control => {
  const fileLine = `${control.file}:${control.line}`;
  const authRole = control.authRole || '-';
  const target = control.target || '-';
  
  return `| ${control.label} | ${control.type} | ${fileLine} | ${authRole} | ${control.expected} | ${control.actual} | ${target} | ${control.finalStatus} | ${control.finalNotes} |`;
}).join('\n')}`;
}).join('\n\n')}`;
}

function generateBrokenDetails(merged: MergedButtonControl[]): string {
  const broken = merged.filter(control => 
    control.finalStatus === '⚠️' || 
    control.finalStatus === '❌' || 
    control.finalStatus === '🧭'
  );
  
  if (broken.length === 0) {
    return '## Broken/No-op Details\n\nNo broken or incomplete buttons found.';
  }
  
  return `## Broken/No-op Details

${broken.map(control => {
  const codeSnippet = `// ${control.file}:${control.line}
// ${control.label} (${control.type})
// Status: ${control.finalStatus}
// Notes: ${control.finalNotes}`;
  
  let recommendation = '';
  if (control.finalStatus === '❌') {
    recommendation = 'Fix the error or add proper error handling.';
  } else if (control.finalStatus === '⚠️') {
    recommendation = 'Implement the missing functionality or remove the placeholder.';
  } else if (control.finalStatus === '🧭') {
    recommendation = 'Add proper navigation target or click handler.';
  }
  
  return `### ${control.label} (${control.route})

\`\`\`typescript
${codeSnippet}
\`\`\`

**Recommendation**: ${recommendation}`;
}).join('\n\n')}`;
}

function generateNavigationMap(merged: MergedButtonControl[]): string {
  // Extract navigation relationships
  const navigationEdges = new Set<string>();
  
  merged.forEach(control => {
    if (control.target && typeof control.target === 'string' && control.target.startsWith('/')) {
      const from = control.route;
      const to = control.target;
      if (from !== to) {
        navigationEdges.add(`${from} --> ${to}`);
      }
    }
  });
  
  if (navigationEdges.size === 0) {
    return '## Navigation Map\n\nNo navigation relationships found.';
  }
  
  const mermaidGraph = `graph TD
${Array.from(navigationEdges).join('\n')}`;
  
  return `## Navigation Map

\`\`\`mermaid
${mermaidGraph}
\`\`\``;
}

function generateAppendix(merged: MergedButtonControl[]): string {
  // Collect unique component types
  const componentTypes = new Set(merged.map(control => control.file));
  
  // Collect common props (note: props field doesn't exist in MergedButtonControl)
  const allProps = new Set<string>();
  
  return `## Appendix

### Component Types Found
${Array.from(componentTypes).map(type => `- ${type}`).join('\n')}

### Common Props
${Array.from(allProps).map(prop => `- ${prop}`).join('\n')}

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
- **🧭 Missing target**: Label implies navigation but no href/router usage`;
}

function generateMarkdownReport(merged: MergedButtonControl[]): string {
  return `# CoinAds Button Audit Report

**Generated**: ${new Date().toISOString().split('T')[0]}
**Total Controls**: ${merged.length}

${generateSummary(merged)}

${generateTopFixes(merged)}

${generatePerScreenMatrix(merged)}

${generateBrokenDetails(merged)}

${generateNavigationMap(merged)}

${generateAppendix(merged)}

## How to Run

### Static Scan
\`\`\`bash
tsx tools/scan-buttons.ts > tools/.artifacts/button-scan.json
\`\`\`

### Runtime Probe (Optional)
\`\`\`bash
E2E_BASE_URL="https://<deployment>" npx playwright test tests/button-audit.spec.ts
\`\`\`

### Generate Report
\`\`\`bash
tsx tools/generate-button-audit.ts
\`\`\`
`;
}

function generateCSVReport(merged: MergedButtonControl[]): string {
  const headers = [
    'route',
    'file',
    'line',
    'label',
    'type',
    'auth_role',
    'expected',
    'actual',
    'target',
    'api_method',
    'api_path',
    'status',
    'notes'
  ];
  
  const rows = merged.map(control => [
    control.route,
    control.file,
    control.line.toString(),
    control.label,
    control.type,
    control.authRole || '',
    control.expected,
    control.actual,
    control.target || '',
    control.apiMethod || '',
    control.apiPath || '',
    control.finalStatus,
    control.finalNotes
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  
  return csvContent;
}

async function main() {
  try {
    console.log('Loading scan results...');
    
    const staticResult = loadStaticResults();
    if (!staticResult) {
      console.error('No static scan results found. Please run the static scanner first.');
      process.exit(1);
    }
    
    const runtimeResult = loadRuntimeResults();
    if (runtimeResult) {
      console.log('Runtime results found and will be merged.');
    } else {
      console.log('No runtime results found. Generating report from static scan only.');
    }
    
    console.log('Merging results...');
    const merged = mergeResults(staticResult, runtimeResult || undefined);
    
    console.log('Generating reports...');
    
    // Ensure docs directory exists
    const docsDir = path.join(process.cwd(), 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    // Generate Markdown report
    const markdownReport = generateMarkdownReport(merged);
    const markdownPath = path.join(docsDir, 'button-audit.md');
    fs.writeFileSync(markdownPath, markdownReport);
    
    // Generate CSV report
    const csvReport = generateCSVReport(merged);
    const csvPath = path.join(docsDir, 'button-audit.csv');
    fs.writeFileSync(csvPath, csvReport);
    
    console.log(`\nReports generated successfully!`);
    console.log(`Markdown: ${markdownPath}`);
    console.log(`CSV: ${csvPath}`);
    console.log(`\nTotal controls analyzed: ${merged.length}`);
    
    // Print summary
    const statusCounts = merged.reduce((acc, control) => {
      acc[control.finalStatus] = (acc[control.finalStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\nFinal status breakdown:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
  } catch (error) {
    console.error('Error generating reports:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
