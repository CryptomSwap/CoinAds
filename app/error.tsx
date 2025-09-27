'use client';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <div style={{ padding: 16, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Unexpected error</h1>
      <pre>{error.message}</pre>
      {error.stack && (
        <details>
          <summary>stack</summary>
          <pre>{error.stack}</pre>
        </details>
      )}
    </div>
  );
}