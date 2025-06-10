import { useAppContext } from '@/contexts/AppContext';
import { usePopupContext } from '@/contexts/PopupContext';
import { PopupType } from '@/types/popup.types';
import { useCallback } from 'react';

export default function ClearAllConfirmationModal() {
  const { cellChanges, clearAllChanges } = useAppContext();
  const { openPopup, closePopup } = usePopupContext();

  const changeCount = cellChanges.size;

  const handleConfirm = useCallback(() => {
    clearAllChanges();
    closePopup();
  }, [clearAllChanges, closePopup]);

  const handleCancel = useCallback(() => {
    openPopup(PopupType.ChangesPreview);
  }, [openPopup]);

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    },
    [handleCancel],
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onKeyDown={handleKeyDown} tabIndex={-1}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity duration-300"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-2xl bg-white shadow-2xl transition-all duration-300">
          {/* Header with warning icon */}
          <div className="flex items-center gap-4 border-b border-gray-200 px-6 py-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Clear All Changes?</h3>
              <p className="mt-1 text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-gray-700">
                You are about to permanently delete{' '}
                <span className="font-semibold text-red-700">
                  {changeCount} {changeCount === 1 ? 'change' : 'changes'}
                </span>{' '}
                from your current editing session.
              </p>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">This will:</p>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
                      <li>Remove all unsaved changes</li>
                      <li>Restore original values in all edited cells</li>
                      <li>Cannot be undone after confirmation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with actions */}
          <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
              autoFocus
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex transform items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-red-700 hover:shadow-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Clear All ({changeCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
