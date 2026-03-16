'use client';

import { AlertCircle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  repoCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteModal({
  isOpen,
  repoCount,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded shadow max-w-sm w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-red-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Confirm Deletion
            </h2>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
            ⚠️ You are about to permanently delete <strong>{repoCount}</strong> {repoCount === 1 ? 'repository' : 'repositories'}.
          </p>

          <p className="text-red-600 dark:text-red-400 text-sm font-semibold mb-6">
            This action cannot be undone.
          </p>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
