#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Only run in production builds
if (process.env.NODE_ENV !== 'production') {
  console.log('✅ Skipping production enforcement (not in production mode)');
  process.exit(0);
}

console.log('🔍 Enforcing production build requirements...');

const errors = [];

// Test/demo data detection patterns
const testPatterns = [
  '__mocks__',
  '/mocks/',
  '/fixtures/',
  'testData',
  'tempData',
  'lipsum',
  "console.log('TODO')",
  "alert('TODO')",
  '// mock',
  '/* mock */',
  'placeholder',
  'TODO:',
  'FIXME:',
  'HACK:'
];

// Directories to scan (excluding tests and dev scripts)
const scanDirs = [
  'app',
  'components',
  'lib',
  'contexts',
  'types'
];

// Files to exclude from mock detection
const excludePatterns = [
  'tests/',
  '__tests__/',
  'test-results/',
  'scripts/',
  'tools/',
  'node_modules/',
  '.next/',
  'coverage/',
  'docs/',
  'reports/'
];

function shouldExcludeFile(filePath) {
  return excludePatterns.some(pattern => filePath.includes(pattern));
}

function scanDirectory(dirPath) {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    
    if (shouldExcludeFile(fullPath)) {
      continue;
    }
    
    if (item.isDirectory()) {
      scanDirectory(fullPath);
    } else if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.tsx') || item.name.endsWith('.js') || item.name.endsWith('.jsx'))) {
      checkFileForMocks(fullPath);
    }
  }
}

function checkFileForMocks(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    for (const pattern of testPatterns) {
      if (content.includes(pattern)) {
        errors.push(`❌ Mock/demo data found in ${filePath}: "${pattern}"`);
      }
    }
    
    // Check for placeholder arrays in UI components
    if (filePath.includes('components/') || filePath.includes('app/')) {
      const arrayMatches = content.match(/const\s+\w+\s*=\s*\[[^\]]*\]/g);
      if (arrayMatches) {
        for (const match of arrayMatches) {
          if (match.includes('placeholder') || match.includes('demo') || match.includes('sample') || match.includes('mock')) {
            errors.push(`❌ Placeholder array found in ${filePath}: ${match.substring(0, 50)}...`);
          }
        }
      }
    }
  } catch (error) {
    // Skip files that can't be read
  }
}

// Scan for mock/demo data
console.log('🔍 Scanning for mock/demo data...');
for (const dir of scanDirs) {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    scanDirectory(dirPath);
  }
}

// Check for debug/test pages and API routes
const debugPages = [
  'app/debug/page.tsx',
  'app/test-auth/page.tsx',
];

const debugApiRoutes = [
  'app/api/debug/email/route.ts',
  'app/api/dev/seed-admin/route.ts',
];

debugPages.forEach(page => {
  if (fs.existsSync(path.join(process.cwd(), page))) {
    errors.push(`❌ Debug/test page found: ${page} - Remove before production`);
  }
});

// Check debug API routes for production guards
debugApiRoutes.forEach(route => {
  const filePath = path.join(process.cwd(), route);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes("process.env.NODE_ENV === 'production'")) {
      errors.push(`❌ Debug API route ${route} missing production guard`);
    }
  }
});

// Check for client auth bypass references
const filesToCheck = [
  'components/RequireAuth.tsx',
  'components/DebugOverlay.tsx',
];

filesToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('NEXT_PUBLIC_DISABLE_CLIENT_AUTH') && !content.includes('NODE_ENV !== \'production\'')) {
      errors.push(`❌ Client auth bypass found in ${file} - Must be guarded with NODE_ENV check`);
    }
  }
});

// Check for demo mode bypasses
const authFile = path.join(process.cwd(), 'lib/auth.ts');
if (fs.existsSync(authFile)) {
  const content = fs.readFileSync(authFile, 'utf8');
    if (content.includes('TEST_MODE') && !content.includes('NODE_ENV !== \'production\'')) {
    errors.push(`❌ Demo mode bypass found in lib/auth.ts - Must be guarded with NODE_ENV check`);
  }
}

// Check for CORS wildcard
const corsFile = path.join(process.cwd(), 'lib/cors.ts');
if (fs.existsSync(corsFile)) {
  const content = fs.readFileSync(corsFile, 'utf8');
  if (content.includes("allowedOrigins: ['*']") && !content.includes('ALLOWED_ORIGINS')) {
    errors.push(`❌ CORS wildcard found in lib/cors.ts - Must use ALLOWED_ORIGINS env var`);
  }
}

if (errors.length > 0) {
  console.error('\n🚨 Production build failed due to security issues:');
  errors.forEach(error => console.error(error));
  console.error('\n💡 Fix these issues before deploying to production.');
  process.exit(1);
}

console.log('✅ Production build requirements satisfied');
