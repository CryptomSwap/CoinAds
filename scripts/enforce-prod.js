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

// Check for debug/test pages
const debugPages = [
  'app/debug/page.tsx',
  'app/test-auth/page.tsx',
];

debugPages.forEach(page => {
  if (fs.existsSync(path.join(process.cwd(), page))) {
    errors.push(`❌ Debug/test page found: ${page} - Remove before production`);
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
  if (content.includes('DEMO_MODE') && !content.includes('NODE_ENV !== \'production\'')) {
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
