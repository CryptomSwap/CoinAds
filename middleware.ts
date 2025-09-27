import { NextResponse, type NextRequest } from 'next/server';

// Protect only the internal app section; public marketing pages remain public.
export const config = {
  matcher: ['/app/:path*'],
};

export default function middleware(_req: NextRequest) {
  // IMPORTANT: do not use request headers, cookies, or any dynamic checks that force dynamic rendering.
  // Auth gating is handled in the client with RequireAuth (see below).
  try {
    return NextResponse.next();
  } catch {
    // Fail-open to avoid blanking the app on unexpected runtime errors.
    return NextResponse.next();
  }
}
