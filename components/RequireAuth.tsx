'use client';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  // Feature flag: allow disabling client auth to isolate issues (development only)
  if (process.env.NEXT_PUBLIC_DISABLE_CLIENT_AUTH === '1' && process.env.NODE_ENV !== 'production') {
    return <>{children}</>;
  }

  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname() || '/';
  const redirected = useRef(false);

  useEffect(() => {
    // Never redirect from sign-in pages, or we can loop
   const isAuthScreen = pathname.startsWith('/auth');
    if (status === 'unauthenticated' && !isAuthScreen && !redirected.current) {
      redirected.current = true;
      const url = '/auth/signin?callbackUrl=' + encodeURIComponent(pathname);
      console.log('[RequireAuth] redirect ->', url);
      router.replace(url);
    }
  }, [status, pathname, router]);

  if (status === 'loading') return null;
  if (status === 'unauthenticated') return null;
  return <>{children}</>;
}
