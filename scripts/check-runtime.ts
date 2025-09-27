#!/usr/bin/env tsx

import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface RuntimeCheck {
  url: string;
  status: number;
  responseTime: number;
  contentType?: string;
  contentSample?: string;
  error?: string;
  redirect?: string;
}

interface RuntimeResult {
  checks: RuntimeCheck[];
  summary: {
    total: number;
    success: number;
    failed: number;
    averageResponseTime: number;
  };
  serverInfo: {
    port: number;
    pid: number;
    startTime: number;
  };
}

async function checkRuntime(): Promise<RuntimeResult> {
  console.log('🚀 Starting runtime checks...');
  
  const port = 3000; // Assume dev server is running on default port
  const checks: RuntimeCheck[] = [];
  
  // Define endpoints to check
  const endpoints = [
    '/',
    '/about',
    '/ad-formats',
    '/advertisers',
    '/publishers',
    '/contact',
    '/auth/signin',
    '/auth/signup',
    '/app',
    '/app/admin/overview',
    '/app/advertiser/overview',
    '/app/publisher/overview',
    '/api/health',
    '/api/reports/advertiser',
    '/api/reports/advertiser.csv',
    '/api/auth/providers',
    '/api/delivery',
    '/api/track/imp',
    '/api/track/click',
    '/api/track/conversion'
  ];
  
  console.log(`🔍 Checking ${endpoints.length} endpoints...`);
  
  // Check each endpoint
  for (const endpoint of endpoints) {
    const check = await checkEndpoint(`http://localhost:${port}${endpoint}`);
    checks.push(check);
    
    const status = check.status >= 200 && check.status < 400 ? '✅' : '❌';
    console.log(`${status} ${endpoint} - ${check.status} (${check.responseTime}ms)`);
    
    if (check.error) {
      console.log(`   Error: ${check.error}`);
    }
    if (check.redirect) {
      console.log(`   Redirect: ${check.redirect}`);
    }
  }
  
  const summary = {
    total: checks.length,
    success: checks.filter(c => c.status >= 200 && c.status < 400).length,
    failed: checks.filter(c => c.status >= 400 || c.error).length,
    averageResponseTime: checks.reduce((sum, c) => sum + c.responseTime, 0) / checks.length
  };
  
  const result: RuntimeResult = {
    checks,
    summary,
    serverInfo: {
      port,
      pid: 0,
      startTime: Date.now()
    }
  };
  
  // Write results
  writeFileSync('scripts/.runtime.json', JSON.stringify(result, null, 2));
  
  console.log('✅ Runtime checks complete');
  console.log(`📊 ${summary.success}/${summary.total} endpoints successful`);
  console.log(`⏱️  Average response time: ${summary.averageResponseTime.toFixed(2)}ms`);
  
  return result;
}

async function startDevServer(port: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === 'win32';
    const command = isWindows ? 'npm.cmd' : 'npm';
    const server = spawn(command, ['run', 'dev'], {
      env: { ...process.env, PORT: port.toString() },
      stdio: 'pipe'
    });
    
    let resolved = false;
    
    server.stdout?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Ready') && !resolved) {
        resolved = true;
        resolve(server);
      }
    });
    
    server.stderr?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('error') && !resolved) {
        resolved = true;
        reject(new Error(`Server failed to start: ${output}`));
      }
    });
    
    server.on('error', (error) => {
      if (!resolved) {
        resolved = true;
        reject(error);
      }
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        reject(new Error('Server start timeout'));
      }
    }, 30000);
  });
}

async function waitForServer(port: number, timeout: number): Promise<void> {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(`http://localhost:${port}/api/health`);
      if (response.ok) {
        return;
      }
    } catch (error) {
      // Server not ready yet
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error(`Server not ready after ${timeout}ms`);
}

async function checkEndpoint(url: string): Promise<RuntimeCheck> {
  const start = Date.now();
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Platform-Audit/1.0'
      },
      redirect: 'manual'
    });
    
    const responseTime = Date.now() - start;
    const contentType = response.headers.get('content-type') || undefined;
    
    let contentSample: string | undefined;
    try {
      const text = await response.text();
      contentSample = text.slice(0, 200);
    } catch (error) {
      // Ignore content reading errors
    }
    
    const check: RuntimeCheck = {
      url,
      status: response.status,
      responseTime,
      contentType,
      contentSample
    };
    
    // Check for redirects
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        check.redirect = location;
      }
    }
    
    return check;
    
  } catch (error) {
    return {
      url,
      status: 0,
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function main() {
  try {
    await checkRuntime();
  } catch (error) {
    console.error('❌ Runtime check failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
