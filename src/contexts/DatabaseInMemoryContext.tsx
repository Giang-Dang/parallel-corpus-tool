import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { CorpusEntry, FileEntry } from '@/types/data.types';

interface DatabaseInMemoryContextType {
  corpusEntries: CorpusEntry[];
  fileEntries: FileEntry[];
  setCorpusEntries: Dispatch<SetStateAction<CorpusEntry[]>>;
  setFileEntries: Dispatch<SetStateAction<FileEntry[]>>;
  corpusIdsByLanguage: Map<string, Set<string>>;
  setCorpusIdsByLanguage: Dispatch<SetStateAction<Map<string, Set<string>>>>;
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
  const [corpusIdsByLanguage, setCorpusIdsByLanguage] = useState<Map<string, Set<string>>>(
    new Map(),
  );

  const value: DatabaseInMemoryContextType = useMemo(
    () => ({
      corpusEntries,
      fileEntries,
      setCorpusEntries,
      setFileEntries,
      corpusIdsByLanguage,
      setCorpusIdsByLanguage,
    }),
    [corpusEntries, fileEntries, corpusIdsByLanguage, setCorpusIdsByLanguage],
  );

  return (
    <DatabaseInMemoryContext.Provider value={value}>{children}</DatabaseInMemoryContext.Provider>
  );
};
