'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RepoTable from '@/components/RepoTable';
import DeleteModal from '@/components/DeleteModal';
import { Repository, fetchUserRepositories, deleteRepository } from '@/lib/github';
import { ArrowLeft } from 'lucide-react';

export default function ReposPage() {
  const router = useRouter();
  const [token, setToken] = useState<string>('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [deletingRepos, setDeletingRepos] = useState<Set<string>>(new Set());
  const [failedRepos, setFailedRepos] = useState<Map<string, string>>(new Map());
  const [successfulRepos, setSuccessfulRepos] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState('');

  // Load token from session storage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem('github_token');
    if (!storedToken) {
      router.push('/');
      return;
    }

    setToken(storedToken);
    loadRepositories(storedToken);
  }, [router]);

  const loadRepositories = async (tokenToUse: string) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await fetchUserRepositories(tokenToUse);

      if (result.error) {
        setError(result.error);
        setRepositories([]);
      } else {
        setRepositories(result.repos);
      }
    } catch (err) {
      setError('Failed to load repositories');
      setRepositories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRepo = (id: number) => {
    const newSelected = new Set(selectedRepos);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRepos(newSelected);
  };

  const handleSelectAll = () => {
    const allIds = new Set(repositories.map((repo) => repo.id));
    setSelectedRepos(allIds);
  };

  const handleUnselectAll = () => {
    setSelectedRepos(new Set());
  };

  const handleDeleteClick = () => {
    if (selectedRepos.size === 0) return;
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    
    const selectedRepoData = repositories.filter((repo) => selectedRepos.has(repo.id));
    const failed = new Map<string, string>();
    const successful = new Set<string>();

    for (const repo of selectedRepoData) {
      setDeletingRepos((prev) => new Set([...prev, repo.full_name]));

      try {
        const result = await deleteRepository(token, repo.owner.login, repo.name);

        if (result.success) {
          successful.add(repo.full_name);
        } else {
          failed.set(repo.full_name, result.error || 'Unknown error');
        }
      } catch (err) {
        failed.set(repo.full_name, 'Failed to delete repository');
      }

      setDeletingRepos((prev) => {
        const updated = new Set(prev);
        updated.delete(repo.full_name);
        return updated;
      });
    }

    setFailedRepos(failed);
    setSuccessfulRepos(successful);

    // Remove deleted repos from the list
    setRepositories(
      repositories.filter((repo) => !successful.has(repo.full_name))
    );

    // Clear selection
    setSelectedRepos(new Set());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('github_token');
    router.push('/');
  };

  const handleRefresh = () => {
    if (token) {
      setSuccessfulRepos(new Set());
      setFailedRepos(new Map());
      loadRepositories(token);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="Go back"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Repositories
              </h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-10">
              {repositories.length} {repositories.length === 1 ? 'repository' : 'repositories'} found
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-3 mb-6">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Repository Table */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow">
          {repositories.length === 0 && !error ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {isLoading ? 'Loading repositories...' : 'No repositories found'}
              </p>
            </div>
          ) : (
            <RepoTable
              repositories={repositories}
              selectedRepos={selectedRepos}
              onSelectRepo={handleSelectRepo}
              onSelectAll={handleSelectAll}
              onUnselectAll={handleUnselectAll}
              onDelete={handleDeleteClick}
              isLoading={isLoading}
              deletingRepos={deletingRepos}
              failedRepos={failedRepos}
              successfulRepos={successfulRepos}
            />
          )}
        </div>

        {/* Status Messages */}
        {(successfulRepos.size > 0 || failedRepos.size > 0) && (
          <div className="mt-6 space-y-3">
            {successfulRepos.size > 0 && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded p-3">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✓ {successfulRepos.size} repositories deleted successfully
                </p>
              </div>
            )}
            {failedRepos.size > 0 && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-3">
                <p className="text-sm text-red-800 dark:text-red-200">
                  ✗ {failedRepos.size} repositories failed to delete
                </p>
              </div>
            )}
          </div>
        )}

        {/* Delete Modal */}
        <DeleteModal
          isOpen={showDeleteModal}
          repoCount={selectedRepos.size}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={deletingRepos.size > 0}
        />
      </div>
    </main>
  );
}
