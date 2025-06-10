import { createContext, useContext, useMemo, useState } from 'react';
import { CorpusEntry, FileEntry } from '@/types/data.types';

interface DatabaseInMemoryContextType {
  corpusEntries: CorpusEntry[];
  fileEntries: FileEntry[];
  setCorpusEntries: (entries: CorpusEntry[] | ((prev: CorpusEntry[]) => CorpusEntry[])) => void;
  setFileEntries: (entries: FileEntry[] | ((prev: FileEntry[]) => FileEntry[])) => void;
}

const DatabaseInMemoryContext = createContext<DatabaseInMemoryContextType | null>(null);

export const useDatabaseInMemoryContext = () => {
  const context = useContext(DatabaseInMemoryContext);
  if (!context) {
    throw new Error('useDatabaseInMemoryContext must be used within an DatabaseInMemoryProvider');
  }
  return context;
};

export const DatabaseInMemoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [corpusEntries, setCorpusEntries] = useState<CorpusEntry[]>([]);
  const [fileEntries, setFileEntries] = useState<FileEntry[]>([]);

  const value: DatabaseInMemoryContextType = useMemo(
    () => ({
      corpusEntries,
      fileEntries,
      setCorpusEntries,
      setFileEntries,
    }),
    [corpusEntries, fileEntries],
  );

  return (
    <DatabaseInMemoryContext.Provider value={value}>{children}</DatabaseInMemoryContext.Provider>
  );
};
