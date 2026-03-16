'use client';

import { Repository } from '@/lib/github';
import { Loader } from 'lucide-react';
import clsx from 'clsx';

interface RepoTableProps {
  repositories: Repository[];
  selectedRepos: Set<number>;
  onSelectRepo: (id: number) => void;
  onSelectAll: () => void;
  onUnselectAll: () => void;
  onDelete: () => void;
  isLoading?: boolean;
  deletingRepos?: Set<string>;
  failedRepos?: Map<string, string>;
  successfulRepos?: Set<string>;
}

export default function RepoTable({
  repositories,
  selectedRepos,
  onSelectRepo,
  onSelectAll,
  onUnselectAll,
  onDelete,
  isLoading = false,
  deletingRepos = new Set(),
  failedRepos = new Map(),
  successfulRepos = new Set(),
}: RepoTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRowStatus = (repoName: string) => {
    if (successfulRepos.has(repoName)) return 'success';
    if (failedRepos.has(repoName)) return 'error';
    if (deletingRepos.has(repoName)) return 'deleting';
    return 'idle';
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex gap-2">
        <button
          onClick={onSelectAll}
          disabled={isLoading}
          className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Select All
        </button>
        <button
          onClick={onUnselectAll}
          disabled={isLoading}
          className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Unselect All
        </button>
        <button
          onClick={onDelete}
          disabled={selectedRepos.size === 0 || isLoading}
          className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Delete ({selectedRepos.size})
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
              <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-white w-12">
                <input
                  type="checkbox"
                  checked={selectedRepos.size === repositories.length && repositories.length > 0}
                  onChange={selectedRepos.size === repositories.length ? onUnselectAll : onSelectAll}
                  disabled={isLoading || repositories.length === 0}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                Repository
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-white w-20">
                Visibility
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-white w-24">
                Created
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-white w-20">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {repositories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                  No repositories found
                </td>
              </tr>
            ) : (
              repositories.map((repo) => {
                const status = getRowStatus(repo.full_name);
                const isSelected = selectedRepos.has(repo.id);

                return (
                  <tr
                    key={repo.id}
                    className={clsx(
                      'border-b border-gray-200 dark:border-gray-700',
                      status === 'success' && 'bg-green-50 dark:bg-green-950',
                      status === 'error' && 'bg-red-50 dark:bg-red-950',
                      status === 'deleting' && 'bg-yellow-50 dark:bg-yellow-950'
                    )}
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRepo(repo.id)}
                        disabled={isLoading || status !== 'idle'}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white font-medium">
                      {repo.name}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={clsx(
                          'px-2 py-1 rounded text-xs font-medium',
                          repo.private
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        )}
                      >
                        {repo.private ? 'Private' : 'Public'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400 text-xs">
                      {formatDate(repo.created_at)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1">
                        {status === 'deleting' && (
                          <>
                            <Loader size={14} className="animate-spin text-yellow-600" />
                            <span className="text-xs text-yellow-600 dark:text-yellow-400">
                              Deleting...
                            </span>
                          </>
                        )}
                        {status === 'success' && (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">
                            ✓ Deleted
                          </span>
                        )}
                        {status === 'error' && (
                          <div className="text-xs">
                            <span className="font-medium text-red-600 dark:text-red-400">
                              ✗ Error
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
