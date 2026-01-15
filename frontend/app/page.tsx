'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const data = await api.get<HealthResponse>('/api/v1/health');
        setHealth(data);
        setError(null);
      } catch (err) {
        console.error('Failed to connect to Rails API:', err);
        setError('Failed to connect to Rails API. Make sure Rails is running on port 3001.');
      } finally {
        setLoading(false);
      }
    };

    checkApiHealth();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-2xl p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Food Tracker
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Next.js Frontend + Rails API
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Testing connection between Next.js (port 3000) and Rails API (port 3001)
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              API Health Check
            </h3>

            {loading && (
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                Connecting to Rails API...
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 font-medium">Error:</p>
                <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
                <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                  Run: <code className="bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded">bin/rails server -p 3001</code>
                </p>
              </div>
            )}

            {health && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    Connected Successfully!
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Status:</span> {health.status}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Message:</span> {health.message}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Timestamp:</span> {new Date(health.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p className="font-semibold mb-2">Next Steps:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Create your first model in Rails</li>
              <li>Build React components for your UI</li>
              <li>Add authentication</li>
              <li>Start tracking your food!</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
