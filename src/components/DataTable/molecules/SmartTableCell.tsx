import React, { useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import ReadOnlyCell from './ReadOnlyCell';
import EditableCell from './EditableCell';

interface SmartTableCellProps {
  value: string | number | Set<number>;
  rowId: string;
  column: string;
  isEditable: boolean;
  className?: string;
}

const SmartTableCell = React.memo<SmartTableCellProps>(
  ({ value, rowId, column, isEditable, className = '' }) => {
    const {
      isEditMode,
      activeEditingCell,
      setActiveEditingCell,
      cellChanges,
      getCellDisplayValue,
    } = useAppContext();

    const cellKey = `${rowId}-${column}`;
    const isCurrentlyEditing = activeEditingCell === cellKey;
    const hasChanges = cellChanges.has(cellKey);
    const displayValue = getCellDisplayValue(rowId, column, value);

    // Handle cell activation (click to edit)
    const handleCellClick = useCallback(() => {
      if (isEditMode && isEditable && !isCurrentlyEditing) {
        // Close any other editing cell and activate this one
        setActiveEditingCell(cellKey);
      }
    }, [isEditMode, isEditable, isCurrentlyEditing, cellKey, setActiveEditingCell]);

    // Handle cell deactivation
    const handleDeactivate = useCallback(() => {
      setActiveEditingCell(null);
    }, [setActiveEditingCell]);

    // 🔥 KEY OPTIMIZATION: Only render EditableCell when actively editing
    if (isCurrentlyEditing) {
      return (
        <td className={`border-r border-gray-100 last:border-r-0 ${className}`}>
          <EditableCell
            value={value}
            rowId={rowId}
            column={column}
            onDeactivate={handleDeactivate}
            autoFocus={true}
          />
        </td>
      );
    }

    // Render lightweight read-only cell with edit affordance
    return (
      <td className={`border-r border-gray-100 last:border-r-0 ${className}`}>
        <ReadOnlyCell
          value={displayValue}
          hasChanges={hasChanges}
          isEditable={isEditMode && isEditable}
          onClick={handleCellClick}
        />
      </td>
    );
  },
);

SmartTableCell.displayName = 'SmartTableCell';

export default SmartTableCell;
