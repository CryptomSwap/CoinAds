#!/usr/bin/env npx tsx

/**
 * No-op Button Checker
 * 
 * Scans TypeScript/TSX files for buttons without proper handlers.
 * This is a safety net to prevent no-op buttons from being introduced.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

interface NoOpButton {
  file: string;
  line: number;
  code: string;
  reason: string;
}

const BUTTON_PATTERNS = [
  // Empty onClick handlers
  /onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\}/g,
  /onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\/\/.*\}\s*\}/g,
];

const IGNORE_PATTERNS = [
  // Form submit buttons are OK
  /type\s*=\s*["']submit["']/,
  
  // Buttons with asChild are OK (they use child Link)
  /asChild/,
  
  // Buttons with onClick handlers are OK
  /onClick/,
  
  // Buttons with data-testid are usually connected (new pages)
  /data-testid/,
  
  // Disabled buttons are OK
  /disabled\s*=\s*\{?true\}?/,
  
  // Test files
  /\.(test|spec)\.(ts|tsx|js|jsx)$/,
  
  // Node modules
  /node_modules/,
  
  // Build outputs
  /\.(next|dist|build)\//,
  
  // Tool files themselves
  /tools\//,
];

function shouldIgnoreFile(filePath: string): boolean {
  return IGNORE_PATTERNS.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(filePath);
    }
    return filePath.includes(pattern as string);
  });
}

function shouldIgnoreLine(line: string): boolean {
  return IGNORE_PATTERNS.some(pattern => {
    if (pattern instanceof RegExp && pattern.source.includes('type|asChild|disabled')) {
      return pattern.test(line);
    }
    return false;
  });
}

function scanFile(filePath: string): NoOpButton[] {
  const issues: NoOpButton[] = [];
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Skip lines that should be ignored
      if (shouldIgnoreLine(line)) {
        return;
      }
      
      // Check for problematic patterns
      BUTTON_PATTERNS.forEach(pattern => {
        pattern.lastIndex = 0; // Reset regex state
        const matches = pattern.exec(line);
        
        if (matches) {
          issues.push({
            file: filePath,
            line: lineNumber,
            code: line.trim(),
            reason: getReasonForPattern(pattern, matches[0])
          });
        }
      });
    });
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}:`, error);
  }
  
  return issues;
}

function getReasonForPattern(pattern: RegExp, match: string): string {
  if (match.includes('onClick') && match.includes('{}')) {
    return 'Empty onClick handler';
  }
  if (match.includes('<Button') && !match.includes('onClick') && !match.includes('asChild')) {
    return 'Button without onClick or asChild';
  }
  if (match.includes('<Link') && !match.includes('href')) {
    return 'Link without href';
  }
  return 'Potential no-op button';
}

function scanDirectory(dirPath: string): NoOpButton[] {
  const issues: NoOpButton[] = [];
  
  try {
    const entries = readdirSync(dirPath);
    
    entries.forEach(entry => {
      const fullPath = join(dirPath, entry);
      const stat = statSync(fullPath);
      
      if (shouldIgnoreFile(fullPath)) {
        return;
      }
      
      if (stat.isDirectory()) {
        issues.push(...scanDirectory(fullPath));
      } else if (stat.isFile()) {
        const ext = extname(fullPath);
        if (['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
          issues.push(...scanFile(fullPath));
        }
      }
    });
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dirPath}:`, error);
  }
  
  return issues;
}

function main() {
  const args = process.argv.slice(2);
  const targetPath = args[0] || '.';
  
  console.log('🔍 Scanning for no-op buttons...\n');
  
  const issues = scanDirectory(targetPath);
  
  if (issues.length === 0) {
    console.log('✅ No no-op buttons found!');
    process.exit(0);
  }
  
  console.log(`❌ Found ${issues.length} potential no-op button(s):\n`);
  
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.file}:${issue.line}`);
    console.log(`   Reason: ${issue.reason}`);
    console.log(`   Code: ${issue.code}`);
    console.log('');
  });
  
  console.log('💡 Fix these issues before deploying to production.');
  process.exit(1);
}

if (require.main === module) {
  main();
}

export { scanDirectory, scanFile };
