import React from 'react';

interface ReadOnlyCellProps {
  value: string | number | Set<number>;
  hasChanges: boolean;
  isEditable: boolean;
  onDoubleClick?: () => void;
  className?: string;
}

const ReadOnlyCell = React.memo<ReadOnlyCellProps>(
  ({ value, hasChanges, isEditable, onDoubleClick, className = '' }) => {
    // Handle display value formatting
    const getDisplayValue = (): string => {
      if (value instanceof Set) {
        return Array.from(value).join(', ');
      }
      return String(value || '');
    };

    const displayValue = getDisplayValue();

    return (
      <div
        onDoubleClick={isEditable ? onDoubleClick : undefined}
        className={`group relative px-3 py-2 text-sm transition-all duration-150 ${isEditable ? 'cursor-pointer hover:bg-blue-50/70 hover:ring-1 hover:ring-blue-200/50' : 'cursor-default'} ${hasChanges ? 'border-r-3 border-l-3 border-yellow-400 bg-yellow-200/80 font-medium text-yellow-900' : ''} ${className} `}
        title={isEditable ? 'Click to edit' : displayValue}
      >
        <div className="flex items-center justify-between">
          <span className="max-w-full truncate">
            {displayValue || <span className="text-xs font-normal text-gray-400 italic">—</span>}
          </span>

          {/* Edit indicator - only show on hover when editable */}
          {isEditable && (
            <span className="ml-2 flex-shrink-0 text-xs text-blue-400 opacity-0 transition-opacity duration-150 group-hover:opacity-70">
              ✏️
            </span>
          )}

          {/* Change indicator */}
          {hasChanges && (
            <span className="ml-2 flex-shrink-0 text-xs text-yellow-600" title="Modified">
              ●
            </span>
          )}
        </div>
      </div>
    );
  },
);

ReadOnlyCell.displayName = 'ReadOnlyCell';

export default ReadOnlyCell;
