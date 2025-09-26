#!/usr/bin/env tsx

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

interface Violation {
  file: string;
  line: number;
  content: string;
}

function findViolations(dir: string, violations: Violation[] = []): Violation[] {
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other common directories
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
        findViolations(fullPath, violations);
      }
    } else if (stat.isFile() && ['.tsx', '.ts', '.jsx', '.js'].includes(extname(item))) {
      // Only check files in the app directory
      if (fullPath.includes('/app/') || fullPath.includes('\\app\\')) {
        try {
          const content = readFileSync(fullPath, 'utf-8');
          const lines = content.split('\n');
          
          // Check if file has "use client" directive
          const hasUseClient = lines[0]?.trim() === '"use client"' || lines[0]?.trim() === "'use client'";
          
          if (hasUseClient) {
            // Look for metadata exports
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              
              // Check for export const metadata
              if (line.includes('export const metadata') || line.includes('export async function generateMetadata')) {
                violations.push({
                  file: fullPath,
                  line: i + 1,
                  content: line.trim()
                });
              }
            }
          }
        } catch (error) {
          console.warn(`Warning: Could not read file ${fullPath}:`, error);
        }
      }
    }
  }
  
  return violations;
}

function main() {
  const appDir = join(process.cwd(), 'app');
  
  try {
    const violations = findViolations(appDir);
    
    if (violations.length > 0) {
      console.error('❌ Found metadata exports in client components:');
      console.error('');
      
      violations.forEach(violation => {
        console.error(`  ${violation.file}:${violation.line}`);
        console.error(`    ${violation.content}`);
        console.error('');
      });
      
      console.error('💡 Fix: Move metadata exports to server-only layout.tsx files or remove "use client" directive.');
      console.error('');
      
      process.exit(1);
    } else {
      console.log('✅ No metadata exports found in client components.');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error scanning for metadata violations:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
