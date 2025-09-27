'use client';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body style={{ padding: 16, fontFamily: 'ui-sans-serif, system-ui' }}>
        <h1>App error</h1>
        <pre>{error.message}</pre>
      </body>
    </html>
  );
}
