import React from 'react';
import { useAppContext } from '@/contexts/AppContext';

const EditModeIndicator: React.FC = () => {
  const { isEditMode, changesCount, hasChangesInDataTable, activeEditingCell } = useAppContext();

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
          Click any cell to edit • Esc to cancel
        </span>
      </div>
    </div>
  );
};

export default EditModeIndicator;
