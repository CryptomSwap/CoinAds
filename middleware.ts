import { NextResponse, type NextRequest } from 'next/server';

// Protect only the internal app section; public marketing pages remain public.
export const config = {
  matcher: ['/app/:path*', '/api/:path*'],
};

export default function middleware(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;
  
  const host = req.headers.get("host") || "";
  const isProdApex = host === "coinads.com" || host === "www.coinads.com";
  const isProdApp  = host === "app.coinads.com";
  
  // Split-domain redirect: redirect /app/* from root domain to app subdomain
  // Only in production when on the apex domain
  if (isProdApex && pathname.startsWith('/app')) {
    const appUrl = new URL(req.url);
    appUrl.hostname = 'app.coinads.com';
    return NextResponse.redirect(appUrl, 308);
  }
  
  // In previews (host ends with .vercel.app) do nothing special; allow /app/* locally
  
  // IMPORTANT: do not use request headers, cookies, or any dynamic checks that force dynamic rendering.
  // Auth gating is handled in the client with RequireAuth (see below).
  
  try {
    const response = NextResponse.next();
    
    // Add security headers to all responses
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Add HSTS in production
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    
    // CSP is now handled by next.config.js headers()
    
    return response;
  } catch {
    // Fail-open to avoid blanking the app on unexpected runtime errors.
    return NextResponse.next();
  }
}
