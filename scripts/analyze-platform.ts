#!/usr/bin/env tsx

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

interface RouteInfo {
  path: string;
  file: string;
  type: 'page' | 'api' | 'layout' | 'error' | 'loading' | 'not-found';
  dynamic: boolean;
  methods?: string[];
  usesHeaders?: boolean;
  usesCookies?: boolean;
  hasDynamic?: boolean;
  hasRevalidate?: boolean;
  hasFetchCache?: boolean;
  hasRuntime?: boolean;
  authGated?: boolean;
  params?: string[];
}

interface AnalysisResult {
  routes: RouteInfo[];
  envVars: {
    [key: string]: {
      present: boolean;
      usedIn: string[];
      clientServer: 'client' | 'server' | 'both';
    };
  };
  buildWarnings: string[];
  summary: {
    totalRoutes: number;
    dynamicRoutes: number;
    apiRoutes: number;
    pages: number;
    authGated: number;
  };
}

function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    try {
      const items = readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = join(currentDir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (stat.isFile()) {
          const ext = extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Ignore permission errors
    }
  }
  
  traverse(dir);
  return files;
}

async function analyzePlatform(): Promise<AnalysisResult> {
  console.log('🔍 Analyzing platform...');
  
  const routes: RouteInfo[] = [];
  const envVars: { [key: string]: { present: boolean; usedIn: string[]; clientServer: 'client' | 'server' | 'both' } } = {};
  const buildWarnings: string[] = [];

  // Scan for all route files
  const routeFiles = getAllFiles('app', ['.tsx', '.ts']).filter(file => 
    file.includes('\\page.tsx') || 
    file.includes('\\layout.tsx') || 
    file.includes('\\error.tsx') || 
    file.includes('\\loading.tsx') || 
    file.includes('\\not-found.tsx') || 
    file.includes('\\route.ts')
  );

  console.log(`📁 Found ${routeFiles.length} route files`);

  for (const file of routeFiles) {
    try {
      const content = readFileSync(file, 'utf-8');
      const routeInfo = analyzeRoute(file, content);
      routes.push(routeInfo);
    } catch (error) {
      console.error(`❌ Error analyzing ${file}:`, error);
    }
  }

  // Analyze environment variables
  const envFiles = getAllFiles('.', ['.env', '.ts']).filter(file => 
    file.includes('.env') || file.includes('lib/env')
  );
  
  for (const file of envFiles) {
    try {
      const content = readFileSync(file, 'utf-8');
      analyzeEnvVars(file, content, envVars);
    } catch (error) {
      console.error(`❌ Error analyzing env file ${file}:`, error);
    }
  }

  // Check for common build warnings
  checkBuildWarnings(routes, buildWarnings);

  const summary = {
    totalRoutes: routes.length,
    dynamicRoutes: routes.filter(r => r.dynamic).length,
    apiRoutes: routes.filter(r => r.type === 'api').length,
    pages: routes.filter(r => r.type === 'page').length,
    authGated: routes.filter(r => r.authGated).length,
  };

  return { routes, envVars, buildWarnings, summary };
}

function analyzeRoute(file: string, content: string): RouteInfo {
  const path = file.replace(/^app[\\\/]/, '').replace(/[\\\/]page\.tsx$/, '').replace(/[\\\/]layout\.tsx$/, '').replace(/[\\\/]route\.ts$/, '').replace(/\\/g, '/');
  const type = getRouteType(file);
  
  const routeInfo: RouteInfo = {
    path: `/${path}`,
    file,
    type,
    dynamic: false,
    usesHeaders: false,
    usesCookies: false,
    hasDynamic: false,
    hasRevalidate: false,
    hasFetchCache: false,
    hasRuntime: false,
    authGated: false,
    params: []
  };

  // Check for dynamic parameters
  const dynamicParams = path.match(/\[([^\]]+)\]/g);
  if (dynamicParams) {
    routeInfo.params = dynamicParams.map(p => p.slice(1, -1));
    routeInfo.dynamic = true;
  }

  // Check for API route methods
  if (type === 'api') {
    const methods = [];
    if (content.includes('export async function GET')) methods.push('GET');
    if (content.includes('export async function POST')) methods.push('POST');
    if (content.includes('export async function PUT')) methods.push('PUT');
    if (content.includes('export async function DELETE')) methods.push('DELETE');
    if (content.includes('export async function PATCH')) methods.push('PATCH');
    routeInfo.methods = methods;
  }

  // Check for dynamic server usage
  if (content.includes('headers()') || content.includes('cookies()') || content.includes('next/headers')) {
    routeInfo.usesHeaders = true;
    routeInfo.dynamic = true;
  }

  if (content.includes('cookies()') || content.includes('next/headers')) {
    routeInfo.usesCookies = true;
  }

  // Check for export const declarations
  if (content.includes('export const dynamic')) {
    routeInfo.hasDynamic = true;
    if (content.includes("export const dynamic = 'force-dynamic'")) {
      routeInfo.dynamic = true;
    }
  }

  if (content.includes('export const revalidate')) {
    routeInfo.hasRevalidate = true;
  }

  if (content.includes('export const fetchCache')) {
    routeInfo.hasFetchCache = true;
  }

  if (content.includes('export const runtime')) {
    routeInfo.hasRuntime = true;
  }

  // Check for auth gating
  if (content.includes('RequireAuth') || content.includes('getServerSession') || content.includes('useSession')) {
    routeInfo.authGated = true;
  }

  return routeInfo;
}

function getRouteType(file: string): RouteInfo['type'] {
  if (file.includes('\\route.ts') || file.includes('/route.ts')) return 'api';
  if (file.includes('\\layout.tsx') || file.includes('/layout.tsx')) return 'layout';
  if (file.includes('\\error.tsx') || file.includes('/error.tsx')) return 'error';
  if (file.includes('\\loading.tsx') || file.includes('/loading.tsx')) return 'loading';
  if (file.includes('\\not-found.tsx') || file.includes('/not-found.tsx')) return 'not-found';
  return 'page';
}

function analyzeEnvVars(file: string, content: string, envVars: any) {
  // Extract environment variable references
  const envMatches = content.match(/(?:process\.env\.|serverEnv\.|clientEnv\.)([A-Z_]+)/g);
  if (envMatches) {
    for (const match of envMatches) {
      const varName = match.replace(/^(?:process\.env\.|serverEnv\.|clientEnv\.)/, '');
      if (!envVars[varName]) {
        envVars[varName] = { present: false, usedIn: [], clientServer: 'server' };
      }
      envVars[varName].usedIn.push(file);
      
      // Determine if it's client or server usage
      if (file.includes('client.ts') || content.includes('NEXT_PUBLIC_')) {
        envVars[varName].clientServer = 'client';
      } else if (file.includes('server.ts') || content.includes('server-only')) {
        envVars[varName].clientServer = 'server';
      } else {
        envVars[varName].clientServer = 'both';
      }
    }
  }
}

function checkBuildWarnings(routes: RouteInfo[], warnings: string[]) {
  // Check for routes using headers() without dynamic export
  const dynamicRoutes = routes.filter(r => r.usesHeaders && !r.hasDynamic);
  for (const route of dynamicRoutes) {
    warnings.push(`Route ${route.path} uses headers() but doesn't export dynamic = 'force-dynamic'`);
  }

  // Check for client-side server env usage
  const clientServerEnv = routes.filter(r => 
    r.file.includes('page.tsx') && 
    (r.file.includes('serverEnv') || r.file.includes('process.env'))
  );
  for (const route of clientServerEnv) {
    warnings.push(`Potential client-side server env usage in ${route.path}`);
  }
}

async function main() {
  try {
    const result = await analyzePlatform();
    
    // Write analysis to JSON file
    writeFileSync('scripts/.analysis.json', JSON.stringify(result, null, 2));
    
    // Generate markdown table
    const markdown = generateMarkdownTable(result);
    writeFileSync('scripts/.analysis.md', markdown);
    
    console.log('✅ Analysis complete');
    console.log(`📊 Found ${result.summary.totalRoutes} routes (${result.summary.dynamicRoutes} dynamic, ${result.summary.apiRoutes} API)`);
    console.log(`🔧 ${result.buildWarnings.length} build warnings`);
    console.log(`📝 Results saved to scripts/.analysis.json and scripts/.analysis.md`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

function generateMarkdownTable(result: AnalysisResult): string {
  let markdown = '# Platform Analysis Results\n\n';
  
  // Summary
  markdown += '## Summary\n\n';
  markdown += `- **Total Routes**: ${result.summary.totalRoutes}\n`;
  markdown += `- **Dynamic Routes**: ${result.summary.dynamicRoutes}\n`;
  markdown += `- **API Routes**: ${result.summary.apiRoutes}\n`;
  markdown += `- **Pages**: ${result.summary.pages}\n`;
  markdown += `- **Auth Gated**: ${result.summary.authGated}\n\n`;
  
  // Routes table
  markdown += '## Routes\n\n';
  markdown += '| Path | File | Type | Dynamic | Methods | Auth Gated | Notes |\n';
  markdown += '|------|------|------|---------|---------|------------|-------|\n';
  
  for (const route of result.routes) {
    const methods = route.methods ? route.methods.join(', ') : '-';
    const notes = [];
    if (route.usesHeaders) notes.push('uses headers()');
    if (route.hasDynamic) notes.push('has dynamic export');
    if (route.hasRevalidate) notes.push('has revalidate');
    if (route.hasFetchCache) notes.push('has fetchCache');
    if (route.hasRuntime) notes.push('has runtime');
    
    markdown += `| ${route.path} | ${route.file} | ${route.type} | ${route.dynamic ? '✅' : '❌'} | ${methods} | ${route.authGated ? '✅' : '❌'} | ${notes.join(', ') || '-'} |\n`;
  }
  
  // Environment variables
  markdown += '\n## Environment Variables\n\n';
  markdown += '| Variable | Present | Used In | Client/Server |\n';
  markdown += '|----------|---------|---------|---------------|\n';
  
  for (const [varName, info] of Object.entries(result.envVars)) {
    const usedIn = info.usedIn.slice(0, 3).join(', ') + (info.usedIn.length > 3 ? '...' : '');
    markdown += `| ${varName} | ${info.present ? '✅' : '❌'} | ${usedIn} | ${info.clientServer} |\n`;
  }
  
  // Build warnings
  if (result.buildWarnings.length > 0) {
    markdown += '\n## Build Warnings\n\n';
    for (const warning of result.buildWarnings) {
      markdown += `- ⚠️ ${warning}\n`;
    }
  }
  
  return markdown;
}

if (require.main === module) {
  main();
}
