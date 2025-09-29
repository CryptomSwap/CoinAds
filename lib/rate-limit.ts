import { NextRequest, NextResponse } from 'next/server';

// Rate limiting configuration
const RATE_LIMITS = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per window
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  },
  track: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 1000, // 1000 tracking requests per minute
  },
};

// In-memory store for development (use Redis in production)
const store = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  store.forEach((value, key) => {
    if (now > value.resetTime) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => store.delete(key));
}, 5 * 60 * 1000); // Clean up every 5 minutes

function getClientId(request: NextRequest): string {
  // Use IP address as client identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || 'unknown';
  return ip;
}

// Upstash Redis rate limiting
async function checkRateLimitUpstash(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: boolean; remaining: number; reset: number; limit: number }> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    throw new Error('Upstash Redis credentials not found');
  }

  const now = Date.now();
  const windowStart = now - windowMs;

  try {
    // Use Upstash REST API with pipeline
    const pipeline = [
      ['ZREMRANGEBYSCORE', key, '0', windowStart.toString()],
      ['ZCARD', key],
      ['ZADD', key, now.toString(), `${now}-${Math.random()}`],
      ['PEXPIRE', key, windowMs.toString()]
    ];

    const response = await fetch(`${redisUrl}/pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pipeline),
    });

    if (!response.ok) {
      throw new Error(`Upstash API error: ${response.status}`);
    }

    const results = await response.json();
    const currentCount = results[1] as number;
    
    const ok = currentCount < limit;
    const remaining = Math.max(0, limit - currentCount - 1);
    const reset = Math.ceil((now + windowMs) / 1000);

    return { ok, remaining, reset, limit };
  } catch (error) {
    console.warn('Upstash Redis rate limiting failed:', error);
    throw error;
  }
}

// In-memory rate limiting
function checkRateLimitMemory(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; reset: number; limit: number } {
  const now = Date.now();
  
  // Get or create rate limit entry
  let entry = store.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
  }
  
  // Check if limit exceeded
  if (entry.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      reset: Math.ceil(entry.resetTime / 1000),
      limit,
    };
  }
  
  // Increment count and update store
  entry.count++;
  store.set(key, entry);
  
  return {
    ok: true,
    remaining: limit - entry.count,
    reset: Math.ceil(entry.resetTime / 1000),
    limit,
  };
}

// Main rate limit function
export async function rateLimit(
  request: NextRequest,
  opts: { key: string; limit: number; windowMs: number }
): Promise<{ ok: boolean; remaining: number; reset: number; limit: number }> {
  const clientId = getClientId(request);
  const storageKey = `${opts.key}:${clientId}`;

  // Try Upstash Redis first if credentials are available
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      return await checkRateLimitUpstash(storageKey, opts.limit, opts.windowMs);
    } catch (error) {
      console.warn('Falling back to in-memory rate limiting:', error);
    }
  }

  // Fall back to in-memory rate limiting
  return checkRateLimitMemory(storageKey, opts.limit, opts.windowMs);
}

// Create rate limit headers
export function createRateLimitHeaders(args: { 
  remaining: number; 
  limit: number; 
  reset: number 
}): HeadersInit {
  return {
    'x-ratelimit-limit': args.limit.toString(),
    'x-ratelimit-remaining': args.remaining.toString(),
    'x-ratelimit-reset': args.reset.toString(),
  };
}

// Create rate limit response
export function createRateLimitResponse(args: { 
  remaining: number; 
  limit: number; 
  reset: number; 
  body?: any; 
  status?: number 
}): NextResponse {
  const headers = createRateLimitHeaders(args);
  const body = args.body || { error: 'Too Many Requests' };
  const status = args.status || 429;

  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

// Legacy exports for backward compatibility
export function checkRateLimit(
  request: NextRequest,
  type: keyof typeof RATE_LIMITS = 'api'
): { allowed: boolean; remaining: number; resetTime: number } {
  const config = RATE_LIMITS[type];
  const clientId = getClientId(request);
  const key = `${type}:${clientId}`;
  const now = Date.now();
  
  // Get or create rate limit entry
  let entry = store.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }
  
  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }
  
  // Increment count and update store
  entry.count++;
  store.set(key, entry);
  
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

export function getRateLimitHeaders(
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
    'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
  };
}