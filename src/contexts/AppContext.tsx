'use client';

import { createContext, useContext, useMemo, useState } from 'react';

interface AppContextType {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  hasChangesInDataTable: boolean;
  setHasChangesInDataTable: (value: boolean) => void;
  changesCount: number;
  setChangesCount: (value: number) => void;
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
    }),
    [isEditMode, activeTab, hasChangesInDataTable, changesCount],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
