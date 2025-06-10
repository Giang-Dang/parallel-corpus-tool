import React from 'react';
import { useAppContext } from '@/contexts/AppContext';

const EditModeIndicator: React.FC = () => {
  const { isEditMode, changesCount, hasChangesInDataTable, clearAllChanges, activeEditingCell } =
    useAppContext();

  // Don't render if not in edit mode
  if (!isEditMode) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 shadow-sm">
      {/* Edit mode status */}
      <div className="flex items-center space-x-3">
        {/* Edit mode indicator */}
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          <span className="text-sm font-medium text-blue-800">Edit Mode Active</span>
        </div>

        {/* Currently editing indicator */}
        {activeEditingCell && (
          <div className="flex items-center space-x-2 text-xs text-blue-600">
            <span>✏️</span>
            <span>Editing cell</span>
          </div>
        )}

        {/* Changes counter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-blue-700">
            {changesCount} {changesCount === 1 ? 'change' : 'changes'}
          </span>
          {hasChangesInDataTable && (
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" title="Unsaved changes" />
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-3">
        {/* Help text */}
        <span className="hidden text-xs text-blue-600 sm:block">
          Click any cell to edit • Press Enter to save • Esc to cancel
        </span>

        {/* Clear changes button */}
        {hasChangesInDataTable && (
          <button
            onClick={clearAllChanges}
            className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-all duration-150 hover:border-red-300 hover:bg-red-100 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
            title="Clear all changes"
          >
            Clear All ({changesCount})
          </button>
        )}

        {/* Save indicator */}
        {hasChangesInDataTable ? (
          <div className="flex items-center space-x-2 text-xs text-yellow-700">
            <span>●</span>
            <span>Unsaved</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-xs text-green-700">
            <span>✓</span>
            <span>All saved</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditModeIndicator;
