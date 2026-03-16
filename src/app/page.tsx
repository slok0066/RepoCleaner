'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import TokenInput from '@/components/TokenInput';
import { fetchUserRepositories } from '@/lib/github';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTokenSubmit = async (token: string) => {
    setIsLoading(true);
    setError('');

    try {
      // Verify token works by fetching repos
      const result = await fetchUserRepositories(token);
      
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Store token in session storage (not localStorage for security)
      sessionStorage.setItem('github_token', token);
      
      // Navigate to repos page
      router.push('/repos');
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/icon.png"
                  alt="RepoCleaner Logo"
                  width={64}
                  height={64}
                  priority
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                RepoCleaner
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Easily bulk delete your old or unwanted GitHub repositories all at once.
              </p>
            </div>

            {/* Token Input Form */}
            <TokenInput onSubmit={handleTokenSubmit} isLoading={isLoading} />

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                🔒 Your token stays in your browser and is never stored or sent to external servers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* How to Get Token */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔑</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Get Your Token
                </h3>
              </div>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">1</span>
                  <span>Visit GitHub <a href="https://github.com/settings/tokens/new?scopes=delete_repo" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Settings</a></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">2</span>
                  <span>Enter a token name</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">3</span>
                  <span>Select <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-mono">delete_repo</span> scope</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">4</span>
                  <span>Generate & copy the token</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">5</span>
                  <span>Paste it above & start deleting!</span>
                </li>
              </ol>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Save your token securely - you won't see it again!</span>
                </p>
              </div>
            </div>

            {/* Creator Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">👨‍💻</span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Made by Shlok
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-2">
                    Get in Touch
                  </p>
                  <div className="space-y-2">
                    <a
                      href="mailto:singhsloks64@gmail.com"
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>📧</span>
                      <span>singhsloks64@gmail.com</span>
                    </a>
                    <a
                      href="https://instagram.com/king_togetherness"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>📱</span>
                      <span>@king_togetherness</span>
                    </a>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Made with <span className="text-red-500">❤️</span> for developers cleaning up their GitHub
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              RepoCleaner © 2024 • Open Source • No data collection
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
