import { NextRequest } from 'next/server';

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
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

function getClientId(request: NextRequest): string {
  // Use IP address as client identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  return ip;
}

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

// Redis-based rate limiting (if REDIS_URL is available)
let redisClient: any = null;

if (process.env.REDIS_URL) {
  try {
    // Dynamic import to avoid errors if Redis is not available
    import('redis').then(({ createClient }) => {
      redisClient = createClient({
        url: process.env.REDIS_URL,
      });
      redisClient.connect().catch((err: any) => {
        console.warn('Redis connection failed, falling back to in-memory rate limiting:', err);
        redisClient = null;
      });
    }).catch(() => {
      console.warn('Redis package not available, using in-memory rate limiting');
    });
  } catch (error) {
    console.warn('Redis setup failed, using in-memory rate limiting:', error);
  }
}

export async function checkRateLimitRedis(
  request: NextRequest,
  type: keyof typeof RATE_LIMITS = 'api'
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  // Fall back to in-memory if Redis is not available
  if (!redisClient) {
    return checkRateLimit(request, type);
  }

  try {
    const config = RATE_LIMITS[type];
    const clientId = getClientId(request);
    const key = `ratelimit:${type}:${clientId}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Use Redis sorted set to track requests in time window
    const pipeline = redisClient.multi();
    
    // Remove old entries
    pipeline.zremrangebyscore(key, 0, windowStart);
    
    // Count current entries
    pipeline.zcard(key);
    
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    
    // Set expiration
    pipeline.expire(key, Math.ceil(config.windowMs / 1000));
    
    const results = await pipeline.exec();
    const currentCount = results[1][1] as number;
    
    const allowed = currentCount < config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - currentCount - 1);
    const resetTime = now + config.windowMs;
    
    return { allowed, remaining, resetTime };
  } catch (error) {
    console.warn('Redis rate limiting failed, falling back to in-memory:', error);
    return checkRateLimit(request, type);
  }
}