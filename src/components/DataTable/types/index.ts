export enum FilterType {
  CONTAIN = 'contain',
  EXACT = 'exact',
  STARTS_WITH = 'startswith',
  ENDS_WITH = 'endswith',
}

export interface ColumnFilter {
  value: string;
  type: FilterType;
  matchCase: boolean;
}

export interface TableState {
  currentPage: number;
  itemsPerPage: number;
  selectedLanguage: string;
  filters: Record<string, ColumnFilter>;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
}

export interface Column {
  key: keyof import('@/types/data.types').CorpusEntry;
  label: string;
  sortable: boolean;
  filterable: boolean;
}
