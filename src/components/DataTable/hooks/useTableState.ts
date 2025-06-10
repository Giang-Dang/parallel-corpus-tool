import { useState, useCallback } from 'react';
import { FilterType, ColumnFilter, TableState } from '../types';

const initialState: TableState = {
  currentPage: 1,
  itemsPerPage: 20,
  selectedLanguage: '',
  filters: {},
  sortColumn: null,
  sortDirection: 'asc',
};

export const useTableState = () => {
  const [state, setState] = useState<TableState>(initialState);

  const updateFilter = useCallback((column: string, filter: Partial<ColumnFilter>) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [column]: {
          ...prev.filters[column],
          value: '',
          type: FilterType.CONTAIN,
          matchCase: false,
          ...filter,
        },
      },
      currentPage: 1, // Reset to first page when filtering
    }));
  }, []);

  const clearFilter = useCallback((column: string) => {
    setState((prev) => {
      const newFilters = { ...prev.filters };
      delete newFilters[column];
      return {
        ...prev,
        filters: newFilters,
        currentPage: 1,
      };
    });
  }, []);

  const setLanguage = useCallback((language: string) => {
    setState((prev) => ({
      ...prev,
      selectedLanguage: language,
      currentPage: 1,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const setItemsPerPage = useCallback((itemsPerPage: number) => {
    setState((prev) => ({
      ...prev,
      itemsPerPage,
      currentPage: 1,
    }));
  }, []);

  const setSort = useCallback((column: string) => {
    setState((prev) => ({
      ...prev,
      sortColumn: column,
      sortDirection: prev.sortColumn === column && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: {},
      currentPage: 1,
    }));
  }, []);

  return {
    state,
    updateFilter,
    clearFilter,
    setLanguage,
    setPage,
    setItemsPerPage,
    setSort,
    resetFilters,
  };
};
