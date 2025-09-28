#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface RouteInfo {
  path: string;
  type: 'page' | 'api';
  isDynamic: boolean;
  isAuthGated: boolean;
  filePath: string;
}

interface RouteInventory {
  pages: RouteInfo[];
  apis: RouteInfo[];
}

function discoverRoutes(dir: string, basePath: string = '', isAuthGated: boolean = false): RouteInventory {
  const result: RouteInventory = { pages: [], apis: [] };
  
  if (!fs.existsSync(dir)) {
    return result;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const itemPath = path.join(dir, item.name);
    const routePath = path.join(basePath, item.name);
    
    if (item.isDirectory()) {
      // Check if this is a dynamic route
      const isDynamic = item.name.startsWith('[') && item.name.endsWith(']');
      
      // Check if this directory contains a page.tsx or route.ts
      const hasPage = fs.existsSync(path.join(itemPath, 'page.tsx'));
      const hasRoute = fs.existsSync(path.join(itemPath, 'route.ts'));
      
      if (hasPage) {
        result.pages.push({
          path: routePath,
          type: 'page',
          isDynamic,
          isAuthGated: isAuthGated || routePath.startsWith('/app/'),
          filePath: path.join(itemPath, 'page.tsx')
        });
      }
      
      if (hasRoute) {
        result.apis.push({
          path: routePath,
          type: 'api',
          isDynamic,
          isAuthGated: isAuthGated || routePath.startsWith('/app/'),
          filePath: path.join(itemPath, 'route.ts')
        });
      }
      
      // Recursively search subdirectories
      const subResult = discoverRoutes(itemPath, routePath, isAuthGated || routePath.startsWith('/app/'));
      result.pages.push(...subResult.pages);
      result.apis.push(...subResult.apis);
    }
  }
  
  return result;
}

function main() {
  console.log('🔍 Discovering routes...');
  
  const appDir = path.join(process.cwd(), 'app');
  const routes = discoverRoutes(appDir);
  
  // Sort routes for consistent output
  routes.pages.sort((a, b) => a.path.localeCompare(b.path));
  routes.apis.sort((a, b) => a.path.localeCompare(b.path));
  
  // Create audit-artifacts directory if it doesn't exist
  const artifactsDir = path.join(process.cwd(), 'audit-artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }
  
  // Write routes.json
  const routesFile = path.join(artifactsDir, 'routes.json');
  fs.writeFileSync(routesFile, JSON.stringify(routes, null, 2));
  
  console.log(`📄 Found ${routes.pages.length} pages and ${routes.apis.length} API routes`);
  console.log(`📝 Routes saved to: ${routesFile}`);
  
  // Print summary
  console.log('\n📋 Pages:');
  routes.pages.forEach(route => {
    const flags = [];
    if (route.isDynamic) flags.push('dynamic');
    if (route.isAuthGated) flags.push('auth-gated');
    const flagStr = flags.length ? ` (${flags.join(', ')})` : '';
    console.log(`  ${route.path}${flagStr}`);
  });
  
  console.log('\n🔌 API Routes:');
  routes.apis.forEach(route => {
    const flags = [];
    if (route.isDynamic) flags.push('dynamic');
    if (route.isAuthGated) flags.push('auth-gated');
    const flagStr = flags.length ? ` (${flags.join(', ')})` : '';
    console.log(`  ${route.path}${flagStr}`);
  });
}

if (require.main === module) {
  main();
}
