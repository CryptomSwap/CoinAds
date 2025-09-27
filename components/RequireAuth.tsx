'use client';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useSession({ required: true });
  const router = useRouter();
  const pathname = usePathname();

  if (status === 'loading') return null; // could render a spinner if desired
  if (status === 'unauthenticated') {
    router.replace('/auth/signin?callbackUrl=' + encodeURIComponent(pathname || '/'));
    return null;
  }
  return <>{children}</>;
}
