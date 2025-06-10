'use client';

import { FileGroup } from '@/types/data.types';
import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';

// Cell change tracking interface
interface CellChange {
  rowId: string;
  column: string;
  originalValue: string | number | Set<number>;
  newValue: string | number | Set<number>;
  timestamp: Date;
}

interface AppContextType {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  hasChangesInDataTable: boolean;
  setHasChangesInDataTable: (value: boolean) => void;
  changesCount: number;
  setChangesCount: (value: number) => void;
  selectedFileGroup: FileGroup;
  setSelectedFileGroup: (value: FileGroup) => void;

  // Enhanced edit mode functionality
  activeEditingCell: string | null;
  setActiveEditingCell: (cellKey: string | null) => void;
  cellChanges: Map<string, CellChange>;
  setCellChanges: (changes: Map<string, CellChange>) => void;
  updateCellValue: (
    rowId: string,
    column: string,
    originalValue: string | number | Set<number>,
    newValue: string | number | Set<number>,
  ) => void;
  revertCellChange: (rowId: string, column: string) => void;
  clearAllChanges: () => void;
  getCellDisplayValue: (
    rowId: string,
    column: string,
    originalValue: string | number | Set<number>,
  ) => string | number | Set<number>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('file');
  const [hasChangesInDataTable, setHasChangesInDataTable] = useState(false);
  const [changesCount, setChangesCount] = useState(0);
  const [selectedFileGroup, setSelectedFileGroup] = useState<FileGroup>({
    baseName: '',
    files: [],
  });

  // Enhanced edit mode state
  const [activeEditingCell, setActiveEditingCell] = useState<string | null>(null);
  const [cellChanges, setCellChanges] = useState<Map<string, CellChange>>(new Map());

  // Auto-cleanup: when edit mode is disabled, clear active cell
  useEffect(() => {
    if (!isEditMode) {
      setActiveEditingCell(null);
    }
  }, [isEditMode]);

  // Memoized update function to prevent unnecessary re-renders
  const updateCellValue = useCallback(
    (
      rowId: string,
      column: string,
      originalValue: string | number | Set<number>,
      newValue: string | number | Set<number>,
    ) => {
      const changeKey = `${rowId}-${column}`;

      setCellChanges((prev) => {
        const newChanges = new Map(prev);

        if (newValue === originalValue) {
          // Remove change if value reverted to original
          newChanges.delete(changeKey);
        } else {
          // Add or update change
          newChanges.set(changeKey, {
            rowId,
            column,
            originalValue,
            newValue,
            timestamp: new Date(),
          });
        }

        // Update counts immediately
        const newCount = newChanges.size;
        setChangesCount(newCount);
        setHasChangesInDataTable(newCount > 0);

        return newChanges;
      });
    },
    [],
  );

  // Memoized revert function
  const revertCellChange = useCallback((rowId: string, column: string) => {
    const changeKey = `${rowId}-${column}`;
    setCellChanges((prev) => {
      const newChanges = new Map(prev);
      newChanges.delete(changeKey);

      const newCount = newChanges.size;
      setChangesCount(newCount);
      setHasChangesInDataTable(newCount > 0);

      return newChanges;
    });
  }, []);

  // Memoized clear function
  const clearAllChanges = useCallback(() => {
    setCellChanges(new Map());
    setChangesCount(0);
    setHasChangesInDataTable(false);
    setActiveEditingCell(null);
  }, []);

  // Helper function to get the display value for a cell
  const getCellDisplayValue = useCallback(
    (rowId: string, column: string, originalValue: string | number | Set<number>) => {
      const changeKey = `${rowId}-${column}`;
      const change = cellChanges.get(changeKey);
      return change ? change.newValue : originalValue;
    },
    [cellChanges],
  );

  // Memoize context value to prevent unnecessary re-renders
  const value: AppContextType = useMemo(
    () => ({
      isEditMode,
      setIsEditMode,
      activeTab,
      setActiveTab,
      hasChangesInDataTable,
      setHasChangesInDataTable,
      changesCount,
      setChangesCount,
      selectedFileGroup,
      setSelectedFileGroup,
      activeEditingCell,
      setActiveEditingCell,
      cellChanges,
      setCellChanges,
      updateCellValue,
      revertCellChange,
      clearAllChanges,
      getCellDisplayValue,
    }),
    [
      isEditMode,
      activeTab,
      hasChangesInDataTable,
      changesCount,
      selectedFileGroup,
      activeEditingCell,
      cellChanges,
      updateCellValue,
      revertCellChange,
      clearAllChanges,
      getCellDisplayValue,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
