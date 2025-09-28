import { NextResponse, type NextRequest } from 'next/server';

// Protect only the internal app section; public marketing pages remain public.
export const config = {
  matcher: ['/app/:path*', '/api/:path*'],
};

export default function middleware(req: NextRequest) {
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
    
    // Add basic CSP
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
    );
    
    return response;
  } catch {
    // Fail-open to avoid blanking the app on unexpected runtime errors.
    return NextResponse.next();
  }
}
