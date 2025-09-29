#!/usr/bin/env tsx

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

// Banned patterns that indicate mock/demo data
const BANNED_PATTERNS = [
  /MOCK_/i,
  /DEMO_/i,
  /SAMPLE_/i,
  /FAKE_/i,
  /DUMMY_/i,
  /PLACEHOLDER_/i,
  /EXAMPLE_/i,
  /mock[A-Z]/,
  /demo[A-Z]/,
  /sample[A-Z]/,
  /fake[A-Z]/,
  /dummy[A-Z]/,
  /placeholder[A-Z]/,
  /example[A-Z]/,
];

// Allowed patterns (test files, documentation, etc.)
const ALLOWED_PATTERNS = [
  /tests\//,
  /__tests__\//,
  /\.spec\./,
  /\.test\./,
  /docs\//,
  /README/,
  /CHANGELOG/,
  /\.md$/,
  /mock-removal/,
  /check-no-mocks/,
];

// File extensions to check
const CHECK_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

interface Violation {
  file: string;
  line: number;
  content: string;
  pattern: string;
}

function isAllowedFile(filePath: string): boolean {
  return ALLOWED_PATTERNS.some(pattern => pattern.test(filePath));
}

function hasBannedPattern(content: string): { pattern: string; line: number }[] {
  const violations: { pattern: string; line: number }[] = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    BANNED_PATTERNS.forEach(pattern => {
      if (pattern.test(line)) {
        violations.push({
          pattern: pattern.source,
          line: index + 1
        });
      }
    });
  });
  
  return violations;
}

function scanDirectory(dirPath: string, violations: Violation[] = []): Violation[] {
  try {
    const items = readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and other build directories
        if (['node_modules', '.next', 'dist', 'build', '.git'].includes(item)) {
          continue;
        }
        scanDirectory(fullPath, violations);
      } else if (stat.isFile()) {
        const ext = extname(fullPath);
        
        if (CHECK_EXTENSIONS.includes(ext) && !isAllowedFile(fullPath)) {
          try {
            const content = readFileSync(fullPath, 'utf-8');
            const bannedPatterns = hasBannedPattern(content);
            
            bannedPatterns.forEach(({ pattern, line }) => {
              const lines = content.split('\n');
              violations.push({
                file: fullPath,
                line,
                content: lines[line - 1]?.trim() || '',
                pattern
              });
            });
          } catch (error) {
            console.warn(`Warning: Could not read file ${fullPath}: ${error}`);
          }
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dirPath}: ${error}`);
  }
  
  return violations;
}

function main() {
  console.log('🔍 Scanning for mock/demo data patterns...\n');
  
  const violations = scanDirectory(process.cwd());
  
  if (violations.length === 0) {
    console.log('✅ No mock/demo patterns found!');
    console.log('🎉 Codebase is clean of mock data.');
    process.exit(0);
  }
  
  console.log(`❌ Found ${violations.length} violations:\n`);
  
  violations.forEach((violation, index) => {
    console.log(`${index + 1}. ${violation.file}:${violation.line}`);
    console.log(`   Pattern: ${violation.pattern}`);
    console.log(`   Content: ${violation.content}`);
    console.log('');
  });
  
  console.log('💡 To fix these violations:');
  console.log('   - Remove mock/demo data and replace with real database queries');
  console.log('   - Use proper empty states instead of fake data');
  console.log('   - Move test-only mocks to test files');
  console.log('   - Update environment variables to remove demo flags');
  
  process.exit(1);
}

if (require.main === module) {
  main();
}
