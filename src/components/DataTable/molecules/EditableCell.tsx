import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';

interface EditableCellProps {
  value: string | number | Set<number>;
  rowId: string;
  column: string;
  onDeactivate: () => void;
  autoFocus?: boolean;
  className?: string;
}

const EditableCell = React.memo<EditableCellProps>(
  ({ value, rowId, column, onDeactivate, autoFocus = true, className = '' }) => {
    const { updateCellValue, getCellDisplayValue } = useAppContext();
    const inputRef = useRef<HTMLInputElement>(null);

    // Get the current display value (might be changed value)
    const currentDisplayValue = getCellDisplayValue(rowId, column, value);

    // Convert display value to string for editing
    const getEditableValue = (val: string | number | Set<number>): string => {
      if (val instanceof Set) {
        return Array.from(val).join(', ');
      }
      return String(val || '');
    };

    const [editValue, setEditValue] = useState(getEditableValue(currentDisplayValue));

    // Auto-focus and select all text when component mounts
    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [autoFocus]);

    // Convert edit string back to appropriate type
    const parseEditValue = useCallback(
      (editStr: string): string | number | Set<number> => {
        // Handle Set<number> case (for links column)
        if (column === 'links') {
          const numbers = editStr
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s !== '')
            .map(Number)
            .filter((n) => !isNaN(n));
          return new Set(numbers);
        }

        // Handle numeric columns
        if (['sentenceIndex', 'wordIndex'].includes(column)) {
          const num = Number(editStr);
          return isNaN(num) ? editStr : num;
        }

        // Default to string
        return editStr;
      },
      [column],
    );

    // Handle save
    const handleSave = useCallback(() => {
      const parsedValue = parseEditValue(editValue);
      if (parsedValue !== currentDisplayValue) {
        updateCellValue(rowId, column, value, parsedValue);
      }
      onDeactivate();
    }, [
      editValue,
      currentDisplayValue,
      rowId,
      column,
      updateCellValue,
      onDeactivate,
      parseEditValue,
      value,
    ]);

    // Handle cancel
    const handleCancel = useCallback(() => {
      setEditValue(getEditableValue(currentDisplayValue));
      onDeactivate();
    }, [currentDisplayValue, onDeactivate]);

    // Keyboard event handlers
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Prevent event bubbling to avoid table navigation conflicts
        e.stopPropagation();

        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            handleSave();
            break;
          case 'Escape':
            e.preventDefault();
            handleCancel();
            break;
          case 'Tab':
            // Let Tab work naturally for navigation, but save first
            handleSave();
            break;
        }
      },
      [handleSave, handleCancel],
    );

    // Handle blur (click outside)
    const handleBlur = useCallback(() => {
      // Small delay to allow for potential focus changes within the same cell
      setTimeout(() => {
        if (!inputRef.current?.matches(':focus')) {
          handleSave();
        }
      }, 100);
    }, [handleSave]);

    // Handle input change
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setEditValue(e.target.value);
    }, []);

    return (
      <div className={`relative ${className}`}>
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border-2 border-blue-500 bg-white px-3 py-2 text-sm shadow-md transition-all duration-150 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          placeholder="Enter value..."
        />

        {/* Visual indicators */}
        <div className="absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-blue-500 shadow-sm" />

        {/* Subtle help text */}
        <div className="absolute -bottom-6 left-0 hidden text-xs text-gray-500 group-hover:block">
          Press Enter to save, Esc to cancel
        </div>
      </div>
    );
  },
);

EditableCell.displayName = 'EditableCell';

export default EditableCell;
