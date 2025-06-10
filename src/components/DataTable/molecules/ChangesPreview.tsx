import React, { useCallback, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { CORPUS_COLUMNS } from '../utils/columnConfig';
import { usePopupContext } from '@/contexts/PopupContext';
import { useValidationSync } from '@/hooks/useValidationSync';

import { PopupType } from '@/types/popup.types';

interface ChangeDetail {
  rowId: string;
  column: string;
  originalValue: string | number | Set<number>;
  newValue: string | number | Set<number>;
  timestamp: Date;
}

const ChangesPreview: React.FC = () => {
  const { cellChanges, revertCellChange, canSaveChanges } = useAppContext();
  const { setIsOpenPopup, openPopup } = usePopupContext();
  const { validationIssues, hasCriticalIssues, getChangeIssues } = useValidationSync();

  // Group changes by row for better organization
  const changesByRow = useMemo(() => {
    const grouped: Record<string, ChangeDetail[]> = {};

    cellChanges.forEach((change) => {
      const rowId = change.rowId;
      if (!grouped[rowId]) {
        grouped[rowId] = [];
      }
      grouped[rowId].push({
        rowId: change.rowId,
        column: change.column,
        originalValue: change.originalValue,
        newValue: change.newValue,
        timestamp: change.timestamp,
      });
    });

    // Sort changes within each row by column order
    Object.keys(grouped).forEach((rowId) => {
      grouped[rowId].sort((a, b) => {
        const columnOrder = CORPUS_COLUMNS.map((col) => col.key as string);
        return columnOrder.indexOf(a.column) - columnOrder.indexOf(b.column);
      });
    });

    return grouped;
  }, [cellChanges]);

  // Format display value
  const formatValue = useCallback((value: string | number | Set<number>): string => {
    if (value instanceof Set) {
      return Array.from(value).join(', ');
    }
    return String(value || '');
  }, []);

  // Get column label
  const getColumnLabel = useCallback((columnKey: string): string => {
    const column = CORPUS_COLUMNS.find((col) => col.key === columnKey);
    return column?.label || columnKey;
  }, []);

  const hasChanges = useMemo(() => Object.keys(changesByRow).length > 0, [changesByRow]);

  const onClose = useCallback(() => {
    setIsOpenPopup(false);
  }, [setIsOpenPopup]);

  // Save functionality with validation
  const handleSave = useCallback(() => {
    if (!canSaveChanges) {
      return; // Prevent save when there are critical issues or no changes
    }

    // TODO: Implement save functionality
    console.log('Save changes:', cellChanges);
    onClose();
  }, [canSaveChanges, cellChanges, onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl transform rounded-2xl bg-white shadow-2xl transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Changes Preview</h2>
                <p className="text-sm text-gray-600">
                  {hasChanges
                    ? `${cellChanges.size} changes across ${Object.keys(changesByRow).length} rows`
                    : 'No changes to preview'}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <button
                  onClick={() => openPopup(PopupType.ClearAllConfirmation)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors duration-150 hover:border-red-300 hover:bg-red-100"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close changes preview"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Validation Issues Alert */}
          {validationIssues.length > 0 && (
            <div className="border-b border-red-200 bg-red-50 px-6 py-4">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">Data Integrity Issues Found</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc space-y-1 pl-5">
                      {validationIssues.map((issue, index) => (
                        <li key={index}>
                          <span className="font-medium">Entry {issue.rowId}:</span> {issue.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-2 text-xs text-red-600">
                    ⚠️ Please resolve these conflicts before saving. Changes with issues are
                    highlighted below.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!hasChanges ? (
              // Empty state
              <div className="flex flex-col items-center justify-center px-6 py-16">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">No Changes Yet</h3>
                <p className="max-w-md text-center text-sm text-gray-500">
                  Enter edit mode and modify some cells to see a preview of your changes here.
                </p>
              </div>
            ) : (
              // Changes list
              <div className="space-y-6 p-6">
                {Object.entries(changesByRow).map(([rowId, changes]) => {
                  const rowHasIssues = validationIssues.some((issue) => issue.rowId === rowId);

                  return (
                    <div
                      key={rowId}
                      className={`rounded-xl border p-4 ${
                        rowHasIssues ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      {/* Row header */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded text-xs font-medium ${
                              rowHasIssues ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {rowHasIssues ? '!' : '#'}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            Entry ID: <span className="font-mono">{rowId}</span>
                          </span>
                          <span className="text-xs text-gray-500">
                            {changes.length} {changes.length === 1 ? 'change' : 'changes'}
                          </span>
                          {rowHasIssues && (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                              Needs Attention
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          Last modified: {changes[0]?.timestamp.toLocaleTimeString()}
                        </div>
                      </div>

                      {/* Changes for this row */}
                      <div className="grid gap-3">
                        {changes.map((change) => {
                          const changeIssues = getChangeIssues(change.rowId, change.column);
                          const hasIssues = changeIssues.length > 0;

                          return (
                            <div
                              key={change.column}
                              className={`rounded-lg border p-4 ${
                                hasIssues
                                  ? 'border-red-300 bg-white ring-1 ring-red-300'
                                  : 'border-gray-200 bg-white'
                              }`}
                            >
                              <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    {getColumnLabel(change.column)}
                                  </span>
                                  {hasIssues && (
                                    <svg
                                      className="h-4 w-4 text-red-500"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <button
                                  onClick={() => revertCellChange(change.rowId, change.column)}
                                  className="rounded px-2 py-1 text-xs text-red-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-700"
                                >
                                  Revert
                                </button>
                              </div>

                              {/* Issue alerts */}
                              {hasIssues && (
                                <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3">
                                  {changeIssues.map((issue, index) => (
                                    <div key={index} className="text-sm text-red-800">
                                      <strong>⚠️ Conflict:</strong> {issue.message}
                                      {issue.conflictsWith && issue.conflictsWith.length > 0 && (
                                        <div className="mt-1 text-xs text-red-600">
                                          Conflicts with: {issue.conflictsWith.join(', ')}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Value comparison */}
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {/* Original value */}
                                <div className="space-y-1">
                                  <div className="text-xs font-medium tracking-wide text-red-700 uppercase">
                                    Original
                                  </div>
                                  <div className="rounded-md border border-red-200 bg-red-50 p-3">
                                    <span className="font-mono text-sm text-red-900">
                                      {formatValue(change.originalValue) || (
                                        <span className="text-red-400 italic">Empty</span>
                                      )}
                                    </span>
                                  </div>
                                </div>

                                {/* New value */}
                                <div className="space-y-1">
                                  <div className="text-xs font-medium tracking-wide text-green-700 uppercase">
                                    New
                                  </div>
                                  <div
                                    className={`rounded-md border p-3 ${
                                      hasIssues
                                        ? 'border-orange-300 bg-orange-50'
                                        : 'border-green-200 bg-green-50'
                                    }`}
                                  >
                                    <span
                                      className={`font-mono text-sm ${
                                        hasIssues ? 'text-orange-900' : 'text-green-900'
                                      }`}
                                    >
                                      {formatValue(change.newValue) || (
                                        <span
                                          className={`italic ${hasIssues ? 'text-orange-400' : 'text-green-400'}`}
                                        >
                                          Empty
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {hasChanges && (
            <div className="rounded-b-2xl border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-gray-500">
                    💡 Tip: Click &ldquo;Revert&rdquo; next to any change to undo it individually
                  </div>
                  <div className="text-xs text-gray-600">
                    {canSaveChanges
                      ? `Ready to save ${cellChanges.size} ${cellChanges.size === 1 ? 'change' : 'changes'}`
                      : hasCriticalIssues
                        ? 'Resolve validation issues before saving'
                        : 'Review changes above'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-150 hover:bg-gray-50"
                  >
                    Close
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={!canSaveChanges}
                    className={`flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition-all duration-150 ${
                      !canSaveChanges
                        ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400'
                        : 'transform border-blue-600 bg-blue-600 text-white shadow-md hover:scale-[1.02] hover:bg-blue-700 hover:shadow-lg'
                    }`}
                    title={
                      !canSaveChanges
                        ? 'Resolve validation issues before saving'
                        : 'Save all changes to file'
                    }
                  >
                    {hasCriticalIssues ? (
                      <>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Cannot Save</span>
                      </>
                    ) : !hasChanges ? (
                      <>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>No Changes</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span>Save Changes ({cellChanges.size})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangesPreview;
