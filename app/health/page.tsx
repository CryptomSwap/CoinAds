import { NextResponse } from "next/server";

export const metadata = {
  title: "Health Check - CoinAds",
  description: "Application health status",
};

async function getHealthStatus() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/health`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return { healthy: response.ok && data.ok, data };
  } catch (error) {
    return { healthy: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export default async function HealthPage() {
  const { healthy, data, error } = await getHealthStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded bg-gradient-to-r from-[#02C8B9] to-[#0194D9] flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Health Check
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6">
          <div className="text-center">
            {healthy ? (
              <div className="text-green-600 dark:text-green-400">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-xl font-semibold mb-2">Healthy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Application is running normally
                </p>
              </div>
            ) : (
              <div className="text-red-600 dark:text-red-400">
                <div className="text-4xl mb-2">❌</div>
                <h3 className="text-xl font-semibold mb-2">Unhealthy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {error || 'Application is experiencing issues'}
                </p>
              </div>
            )}
          </div>

          {data && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
              <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
