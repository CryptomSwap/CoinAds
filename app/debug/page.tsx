'use client';
import { useSession } from 'next-auth/react';

export default function DebugPage() {
  const { status, data } = useSession();
  const env = {
    NEXT_PUBLIC_DEBUG_OVERLAY: process.env.NEXT_PUBLIC_DEBUG_OVERLAY,
    NEXT_PUBLIC_DISABLE_CLIENT_AUTH: process.env.NEXT_PUBLIC_DISABLE_CLIENT_AUTH,
  };
  return (
    <div style={{ padding: 16, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Debug</h1>
      <h2>Session</h2>
      <pre>{JSON.stringify({ status, user: data?.user }, null, 2)}</pre>
      <h2>Public env</h2>
      <pre>{JSON.stringify(env, null, 2)}</pre>
    </div>
  );
}
