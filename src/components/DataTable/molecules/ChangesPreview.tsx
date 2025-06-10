import React, { useCallback, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { CORPUS_COLUMNS } from '../utils/columnConfig';
import { usePopupContext } from '@/contexts/PopupContext';

interface ChangeDetail {
  rowId: string;
  column: string;
  originalValue: string | number | Set<number>;
  newValue: string | number | Set<number>;
  timestamp: Date;
}

const ChangesPreview: React.FC = () => {
  const { cellChanges, revertCellChange, clearAllChanges } = useAppContext();
  const { setIsOpenPopup } = usePopupContext();

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
                  onClick={clearAllChanges}
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

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto">
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
                {Object.entries(changesByRow).map(([rowId, changes]) => (
                  <div key={rowId} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    {/* Row header */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-xs font-medium text-blue-700">
                          #
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          Entry ID: <span className="font-mono">{rowId}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {changes.length} {changes.length === 1 ? 'change' : 'changes'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Last modified: {changes[0]?.timestamp.toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Changes for this row */}
                    <div className="grid gap-3">
                      {changes.map((change) => (
                        <div
                          key={change.column}
                          className="rounded-lg border border-gray-200 bg-white p-4"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {getColumnLabel(change.column)}
                            </span>
                            <button
                              onClick={() => revertCellChange(change.rowId, change.column)}
                              className="rounded px-2 py-1 text-xs text-red-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-700"
                            >
                              Revert
                            </button>
                          </div>

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
                              <div className="rounded-md border border-green-200 bg-green-50 p-3">
                                <span className="font-mono text-sm text-green-900">
                                  {formatValue(change.newValue) || (
                                    <span className="text-green-400 italic">Empty</span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {hasChanges && (
            <div className="rounded-b-2xl border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  💡 Tip: Click &ldquo;Revert&rdquo; next to any change to undo it individually
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    className="rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700"
                    onClick={() => {
                      // TODO: Implement save functionality
                      console.log('Save changes:', cellChanges);
                      onClose();
                    }}
                  >
                    Save Changes
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
