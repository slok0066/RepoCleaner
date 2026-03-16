'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { validateToken } from '@/lib/github';

interface TokenInputProps {
  onSubmit: (token: string) => void;
  isLoading?: boolean;
}

export default function TokenInput({ onSubmit, isLoading = false }: TokenInputProps) {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateToken(token);
    if (!validation.valid) {
      setError(validation.error || 'Invalid token');
      return;
    }

    setError('');
    onSubmit(token);
  };

  const handleGetToken = () => {
    window.open(
      'https://github.com/settings/tokens/new?scopes=delete_repo',
      '_blank'
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="token"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          GitHub Token
        </label>
        <div className="relative">
          <input
            id="token"
            type={showToken ? 'text' : 'password'}
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setError('');
            }}
            placeholder="Paste your PAT"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="absolute right-2.5 top-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            disabled={isLoading}
          >
            {showToken ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading || !token}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Loading...' : 'Load Repos'}
        </button>
        <button
          type="button"
          onClick={handleGetToken}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Get Token
        </button>
      </div>
    </form>
  );
}
