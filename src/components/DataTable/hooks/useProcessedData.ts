import { useMemo } from 'react';
import { useDatabaseInMemoryContext } from '@/contexts/DatabaseInMemoryContext';
import { filterEntries, sortEntries, paginateEntries } from '../utils/filterUtils';
import { TableState } from '../types';

export const useProcessedData = (state: TableState) => {
  const { corpusEntries } = useDatabaseInMemoryContext();

  const processedData = useMemo(() => {
    // Apply filters and language selection
    const filteredEntries = filterEntries(corpusEntries, state.filters, state.selectedLanguage);

    // Apply sorting
    const sortedEntries = sortEntries(filteredEntries, state.sortColumn, state.sortDirection);

    // Apply pagination
    const { paginatedEntries, totalPages } = paginateEntries(
      sortedEntries,
      state.currentPage,
      state.itemsPerPage,
    );

    return {
      entries: paginatedEntries,
      totalEntries: sortedEntries.length,
      totalPages,
      filteredCount: filteredEntries.length,
    };
  }, [corpusEntries, state]);

  return processedData;
};
