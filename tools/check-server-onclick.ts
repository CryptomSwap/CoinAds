#!/usr/bin/env tsx

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface CheckResult {
  file: string;
  hasUseClient: boolean;
  hasOnClick: boolean;
  hasOnChange: boolean;
  hasOnSubmit: boolean;
  hasUseRouter: boolean;
  hasUseState: boolean;
  hasUseEffect: boolean;
  hasUseSession: boolean;
  hasButtonBinder: boolean;
  isOffender: boolean;
  reasons: string[];
}

function checkFile(filePath: string): CheckResult | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Check for "use client" directive
    const hasUseClient = content.includes('"use client"') || content.includes("'use client'");
    
    // Check for interactive patterns
    const hasOnClick = /onClick\s*=/i.test(content);
    const hasOnChange = /onChange\s*=/i.test(content);
    const hasOnSubmit = /onSubmit\s*=/i.test(content);
    const hasUseRouter = /useRouter/i.test(content);
    const hasUseState = /useState/i.test(content);
    const hasUseEffect = /useEffect/i.test(content);
    const hasUseSession = /useSession/i.test(content);
    const hasButtonBinder = /ButtonBinder/i.test(content);
    
    const hasInteractivePatterns = hasOnClick || hasOnChange || hasOnSubmit || 
                                  hasUseRouter || hasUseState || hasUseEffect || 
                                  hasUseSession || hasButtonBinder;
    
    const isOffender = !hasUseClient && hasInteractivePatterns;
    
    const reasons: string[] = [];
    if (!hasUseClient && hasOnClick) reasons.push('onClick without use client');
    if (!hasUseClient && hasOnChange) reasons.push('onChange without use client');
    if (!hasUseClient && hasOnSubmit) reasons.push('onSubmit without use client');
    if (!hasUseClient && hasUseRouter) reasons.push('useRouter without use client');
    if (!hasUseClient && hasUseState) reasons.push('useState without use client');
    if (!hasUseClient && hasUseEffect) reasons.push('useEffect without use client');
    if (!hasUseClient && hasUseSession) reasons.push('useSession without use client');
    if (!hasUseClient && hasButtonBinder) reasons.push('ButtonBinder without use client');
    
    return {
      file: filePath,
      hasUseClient,
      hasOnClick,
      hasOnChange,
      hasOnSubmit,
      hasUseRouter,
      hasUseState,
      hasUseEffect,
      hasUseSession,
      hasButtonBinder,
      isOffender,
      reasons
    };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

function scanDirectory(dirPath: string): CheckResult[] {
  const results: CheckResult[] = [];
  
  try {
    const entries = readdirSync(dirPath);
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and other common directories
        if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(entry)) {
          results.push(...scanDirectory(fullPath));
        }
      } else if (entry.endsWith('.tsx') || entry.endsWith('.jsx')) {
        const result = checkFile(fullPath);
        if (result) {
          results.push(result);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
  
  return results;
}

function main() {
  console.log('🔍 Checking for server components with interactive patterns...\n');
  
  const appDir = join(process.cwd(), 'app');
  const componentsDir = join(process.cwd(), 'components');
  
  const allResults: CheckResult[] = [];
  
  // Scan app directory
  if (statSync(appDir).isDirectory()) {
    allResults.push(...scanDirectory(appDir));
  }
  
  // Scan components directory
  if (statSync(componentsDir).isDirectory()) {
    allResults.push(...scanDirectory(componentsDir));
  }
  
  const offenders = allResults.filter(result => result.isOffender);
  
  console.log(`📊 Summary:`);
  console.log(`   Total files checked: ${allResults.length}`);
  console.log(`   Offenders found: ${offenders.length}\n`);
  
  if (offenders.length > 0) {
    console.log('❌ OFFENDING FILES:\n');
    offenders.forEach(offender => {
      console.log(`📁 ${offender.file}`);
      console.log(`   Reasons: ${offender.reasons.join(', ')}`);
      console.log(`   Patterns found:`);
      if (offender.hasOnClick) console.log(`     - onClick`);
      if (offender.hasOnChange) console.log(`     - onChange`);
      if (offender.hasOnSubmit) console.log(`     - onSubmit`);
      if (offender.hasUseRouter) console.log(`     - useRouter`);
      if (offender.hasUseState) console.log(`     - useState`);
      if (offender.hasUseEffect) console.log(`     - useEffect`);
      if (offender.hasUseSession) console.log(`     - useSession`);
      if (offender.hasButtonBinder) console.log(`     - ButtonBinder`);
      console.log('');
    });
    
    process.exit(1);
  } else {
    console.log('✅ All files are properly configured!');
    console.log('   No server components with interactive patterns found.');
  }
}

if (require.main === module) {
  main();
}
