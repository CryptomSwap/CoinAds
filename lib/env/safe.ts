// Safe environment variable access for client-side code
export function safeGet<T>(v: T | undefined, fallback: T): T {
  return typeof window === 'undefined' ? (v ?? fallback) : (v ?? fallback);
}

// Helper to safely access client environment variables
export function getClientEnvVar(key: string, fallback?: string): string | undefined {
  if (typeof window === 'undefined') {
    // Server-side - should not be used
    return fallback;
  }
  
  // Client-side - only access NEXT_PUBLIC_* variables
  if (!key.startsWith('NEXT_PUBLIC_')) {
    console.warn(`Attempted to access non-public environment variable ${key} on client side`);
    return fallback;
  }
  
  return process.env[key] || fallback;
}
