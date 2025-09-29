// Mock environment check for testing
const testServerEnv = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
};

export interface EnvCheckResult {
  variable: string;
  present: boolean;
  usedIn: string[];
  clientServer: 'client' | 'server' | 'both';
  required: boolean;
}

export function checkEnvironmentVariables(): EnvCheckResult[] {
  const results: EnvCheckResult[] = [];
  
  // Required server variables
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];
  
  // Optional but important variables
  const optionalVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'EMAIL_SERVER_HOST',
    'EMAIL_SERVER_PORT',
    'EMAIL_SERVER_USER',
    'EMAIL_SERVER_PASSWORD',
    'EMAIL_FROM',
    'STRIPE_PUBLIC_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName];
    results.push({
      variable: varName,
      present: !!value,
      usedIn: ['lib/env/server.ts'],
      clientServer: 'server',
      required: true
    });
  }
  
  // Check optional variables
  for (const varName of optionalVars) {
    const value = process.env[varName];
    results.push({
      variable: varName,
      present: !!value,
      usedIn: ['lib/env/server.ts'],
      clientServer: varName.startsWith('NEXT_PUBLIC_') ? 'client' : 'server',
      required: false
    });
  }
  
  return results;
}

export function printEnvMatrix(results: EnvCheckResult[]): void {
  console.log('\n🔧 Environment Variables Matrix:');
  console.log('=====================================');
  
  for (const result of results) {
    const status = result.present ? '✅' : '❌';
    const required = result.required ? '(REQUIRED)' : '(OPTIONAL)';
    const scope = result.clientServer === 'client' ? 'CLIENT' : 
                  result.clientServer === 'server' ? 'SERVER' : 'BOTH';
    
    console.log(`${status} ${result.variable} ${required} [${scope}]`);
  }
  
  console.log('\n📊 Summary:');
  const present = results.filter(r => r.present).length;
  const required = results.filter(r => r.required).length;
  const requiredPresent = results.filter(r => r.required && r.present).length;
  
  console.log(`- Total variables: ${results.length}`);
  console.log(`- Present: ${present}/${results.length}`);
  console.log(`- Required present: ${requiredPresent}/${required}`);
  
  if (requiredPresent < required) {
    console.log('❌ Missing required variables!');
  } else {
    console.log('✅ All required variables present');
  }
}

export function checkGoogleOAuthConfig(): boolean {
  return !!(testServerEnv.GOOGLE_CLIENT_ID && testServerEnv.GOOGLE_CLIENT_SECRET);
}

export function checkEmailConfig(): boolean {
  return !!(process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_PORT);
}
