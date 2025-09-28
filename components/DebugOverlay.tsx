'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function DebugOverlay() {
  // Block in production - debug overlay should never be shown
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  const on = process.env.NEXT_PUBLIC_DEBUG_OVERLAY === '1';
  const pathname = usePathname();
  const [errors, setErrors] = useState<string[]>([]);
  const installed = useRef(false);

  useEffect(() => {
    if (!on || installed.current) return;
    installed.current = true;

    const onError = (e: ErrorEvent) => {
      setErrors(prev => [...prev, `Error: ${e.message}`].slice(-5));
      // Paint a minimal visible banner so we never see a white screen without context
      console.error('[Overlay Error]', e.error || e.message);
    };
    const onUnhandled = (e: PromiseRejectionEvent) => {
      const msg = `Unhandled rejection: ${e.reason?.message || String(e.reason)}`;
      setErrors(prev => [...prev, msg].slice(-5));
      console.error('[Overlay Rejection]', e.reason);
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandled);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandled);
    };
  }, [on]);

  if (!on) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
      padding: 8, zIndex: 999999
    }}>
      <div style={{
        pointerEvents: 'auto',
        fontFamily: 'ui-sans-serif, system-ui',
        background: 'rgba(0,0,0,0.75)', color: 'white', padding: '8px 12px',
        borderRadius: 8, maxWidth: 480
      }}>
        <div><b>Path:</b> {pathname}</div>
        <div><b>Auth disabled:</b> {process.env.NEXT_PUBLIC_DISABLE_CLIENT_AUTH === '1' ? 'yes' : 'no'}</div>
        {errors.length > 0 && (
          <div style={{ marginTop: 6 }}>
            <b>Recent errors:</b>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {errors.map((e, i) => <li key={i} style={{ whiteSpace: 'pre-wrap' }}>{e}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
