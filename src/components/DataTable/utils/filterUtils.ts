import { CorpusEntry } from '@/types/data.types';
import { FilterType, ColumnFilter } from '../types';

export const applyFilter = (
  entry: CorpusEntry,
  column: keyof CorpusEntry,
  filter: ColumnFilter,
): boolean => {
  const value = String(entry[column]);
  const searchTerm = filter.matchCase ? filter.value : filter.value.toLowerCase();
  const targetValue = filter.matchCase ? value : value.toLowerCase();

  switch (filter.type) {
    case FilterType.CONTAIN:
      return targetValue.includes(searchTerm);
    case FilterType.EXACT:
      return targetValue === searchTerm;
    case FilterType.STARTS_WITH:
      return targetValue.startsWith(searchTerm);
    case FilterType.ENDS_WITH:
      return targetValue.endsWith(searchTerm);
    default:
      return true;
  }
};

export const filterEntries = (
  entries: CorpusEntry[],
  filters: Record<string, ColumnFilter>,
  selectedLanguage: string,
): CorpusEntry[] => {
  return entries.filter((entry) => {
    // Language filter
    if (selectedLanguage && entry.language !== selectedLanguage) {
      return false;
    }

    // Column filters
    return Object.entries(filters).every(([column, filter]) => {
      if (!filter.value) return true;
      return applyFilter(entry, column as keyof CorpusEntry, filter);
    });
  });
};

export const sortEntries = (
  entries: CorpusEntry[],
  sortColumn: string | null,
  sortDirection: 'asc' | 'desc',
): CorpusEntry[] => {
  if (!sortColumn) return entries;

  return [...entries].sort((a, b) => {
    const aValue = String(a[sortColumn as keyof CorpusEntry]);
    const bValue = String(b[sortColumn as keyof CorpusEntry]);

    const comparison = aValue.localeCompare(bValue, undefined, { numeric: true });
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};

export const paginateEntries = (
  entries: CorpusEntry[],
  currentPage: number,
  itemsPerPage: number,
): { paginatedEntries: CorpusEntry[]; totalPages: number } => {
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntries = entries.slice(startIndex, endIndex);

  return { paginatedEntries, totalPages };
};
