import { useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useDatabaseInMemoryContext } from '@/contexts/DatabaseInMemoryContext';

export interface ValidationIssue {
  type: 'duplicate_entry_id' | 'invalid_format';
  rowId: string;
  column: string;
  newValue: string | number | Set<number>;
  conflictsWith?: string[];
  message: string;
}

export const useChangeValidation = () => {
  const { cellChanges } = useAppContext();
  const { corpusIdsByLanguage, corpusEntries } = useDatabaseInMemoryContext();

  // Advanced validation logic
  const validationIssues = useMemo(() => {
    const issues: ValidationIssue[] = [];
    const entryIdChanges = new Map<string, string>(); // originalId -> newId
    const newEntryIds = new Set<string>();

    // Collect all entry ID changes
    cellChanges.forEach((change) => {
      if (change.column === 'entryId') {
        const newId = String(change.newValue);
        entryIdChanges.set(change.rowId, newId);
        newEntryIds.add(newId);
      }
    });

    // Create a set of original IDs that are being changed (for swapping detection)
    const originalIdsBeingChanged = new Set(entryIdChanges.keys());

    // Check for duplicates among new entry IDs
    const newIdCounts = new Map<string, string[]>();
    entryIdChanges.forEach((newId, originalId) => {
      if (!newIdCounts.has(newId)) {
        newIdCounts.set(newId, []);
      }
      newIdCounts.get(newId)!.push(originalId);
    });

    // Find duplicates within changes
    newIdCounts.forEach((originalIds, newId) => {
      if (originalIds.length > 1) {
        originalIds.forEach((originalId) => {
          issues.push({
            type: 'duplicate_entry_id',
            rowId: originalId,
            column: 'entryId',
            newValue: newId,
            conflictsWith: originalIds.filter((id) => id !== originalId),
            message: `Entry ID "${newId}" conflicts with ${originalIds.length - 1} other changed entries`,
          });
        });
      }
    });

    // Check for conflicts with existing database entries
    // CRITICAL FIX: Handle ID swapping scenarios correctly
    entryIdChanges.forEach((newId, originalId) => {
      // Get the language of the current entry
      const currentEntry = corpusEntries.find((entry) => entry.entryId === originalId);
      const language = currentEntry?.language;

      if (language && corpusIdsByLanguage.has(language)) {
        const existingIds = corpusIdsByLanguage.get(language)!;

        // FIXED LOGIC: Only flag as conflict if:
        // 1. The new ID exists in database, AND
        // 2. The new ID is different from original ID, AND
        // 3. The existing ID is NOT being changed (to handle swapping)
        if (existingIds.has(newId) && newId !== originalId && !originalIdsBeingChanged.has(newId)) {
          issues.push({
            type: 'duplicate_entry_id',
            rowId: originalId,
            column: 'entryId',
            newValue: newId,
            message: `Entry ID "${newId}" already exists in language "${language}" and is not being changed`,
          });
        }
      }
    });

    return issues;
  }, [cellChanges, corpusIdsByLanguage, corpusEntries]);

  // Check if save should be disabled
  const hasCriticalIssues = useMemo(() => {
    return validationIssues.length > 0;
  }, [validationIssues]);

  // Check if a specific change has validation issues
  const getChangeIssues = (rowId: string, column: string): ValidationIssue[] => {
    return validationIssues.filter((issue) => issue.rowId === rowId && issue.column === column);
  };

  return {
    validationIssues,
    hasCriticalIssues,
    getChangeIssues,
  };
};
