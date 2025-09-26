import { NextRequest, NextResponse } from 'next/server';

// Rate limiting configuration
const RATE_LIMITS = {
  DEFAULT: {
    requests: 60,
    windowMs: 60 * 1000, // 1 minute
  },
  TRACK_API: {
    requests: 300,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}, 5 * 60 * 1000);

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return '127.0.0.1'; // fallback
}

// Helper function to check if path is a track API
function isTrackAPI(pathname: string): boolean {
  return pathname.startsWith('/api/track/');
}

// Helper function to check if path should be excluded from rate limiting
function shouldRateLimit(pathname: string): boolean {
  // Exclude static assets and Next.js internals
  const excludedPaths = [
    '/_next/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.json',
    '/sw.js',
    '/workbox-',
    '/static/',
    '/images/',
    '/icons/',
  ];
  
  return !excludedPaths.some(path => pathname.startsWith(path));
}

// Rate limiting function
function checkRateLimit(ip: string, isTrack: boolean): { allowed: boolean; remaining: number; resetTime: number } {
  const limit = isTrack ? RATE_LIMITS.TRACK_API : RATE_LIMITS.DEFAULT;
  const key = `${ip}:${isTrack ? 'track' : 'default'}`;
  const now = Date.now();
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + limit.windowMs,
    });
    
    return {
      allowed: true,
      remaining: limit.requests - 1,
      resetTime: now + limit.windowMs,
    };
  }
  
  if (current.count >= limit.requests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
    };
  }
  
  // Increment counter
  current.count++;
  rateLimitStore.set(key, current);
  
  return {
    allowed: true,
    remaining: limit.requests - current.count,
    resetTime: current.resetTime,
  };
}

// Helper function to check if response is HTML
function isHTMLResponse(response: NextResponse): boolean {
  const contentType = response.headers.get('content-type');
  return contentType?.includes('text/html') || false;
}

// Helper function to add security headers to HTML responses
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Only add security headers to HTML responses
  if (!isHTMLResponse(response)) {
    return response;
  }

  // Strict-Transport-Security (HSTS)
  // Forces HTTPS for 2 years, includes subdomains, and allows preloading
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // X-Frame-Options
  // Prevents the page from being embedded in frames/iframes
  response.headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options
  // Prevents MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy
  // Controls referrer information sent with requests
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy (formerly Feature-Policy)
  // Disables interest-based advertising (FLoC)
  response.headers.set('Permissions-Policy', 'interest-cohort=()');

  // Content-Security-Policy
  // Comprehensive protection against XSS and other attacks
  // 
  // CSP Configuration:
  // - default-src 'self' blob: data: https: - Default policy for all resources
  // - img-src 'self' blob: data: https: - Images from same origin, blobs, data URIs, and HTTPS
  // - script-src 'self' 'unsafe-inline' 'unsafe-eval' https: - Scripts with inline and eval allowed
  // - style-src 'self' 'unsafe-inline' https: - Styles with inline styles allowed
  // - connect-src 'self' https: - Network connections to same origin and HTTPS
  // - frame-ancestors 'none' - Prevents embedding in frames
  //
  // To relax CSP for third-party tools, you can:
  // 1. Add specific domains to script-src: script-src 'self' 'unsafe-inline' https://cdn.example.com
  // 2. Allow specific third-party services: connect-src 'self' https: https://api.stripe.com
  // 3. Add nonce or hash for specific inline scripts instead of 'unsafe-inline'
  // 4. Use report-uri to monitor CSP violations: ...; report-uri /api/csp-report
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self' blob: data: https:; img-src 'self' blob: data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; connect-src 'self' https:; frame-ancestors 'none';"
  );

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip rate limiting for static assets and Next.js internals
  if (!shouldRateLimit(pathname)) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }
  
  // Get client IP
  const clientIP = getClientIP(request);
  
  // Check if this is a track API
  const isTrack = isTrackAPI(pathname);
  
  // Check rate limit
  const rateLimitResult = checkRateLimit(clientIP, isTrack);
  
  if (!rateLimitResult.allowed) {
    // Rate limit exceeded
    const response = NextResponse.json(
      { 
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      },
      { status: 429 }
    );
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', isTrack ? '300' : '60');
    response.headers.set('X-RateLimit-Remaining', '0');
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
    response.headers.set('Retry-After', Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString());
    
    return response;
  }
  
  // Request allowed, add rate limit headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', isTrack ? '300' : '60');
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
  
  // Add security headers to HTML responses
  return addSecurityHeaders(response);
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
