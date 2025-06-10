import { useState } from 'react';
import LanguageSelector from './molecules/LanguageSelector';
import TableHeader from './molecules/TableHeader';
import TableBody from './molecules/TableBody';
import Pagination from './molecules/Pagination';
import LoadingIndicator from './molecules/LoadingIndicator';
import EditModeIndicator from './molecules/EditModeIndicator';
import { useTableState } from './hooks/useTableState';
import { useProcessedData } from './hooks/useProcessedData';

export default function DataTable() {
  const [isLoading] = useState(false);
  const { state, updateFilter, clearFilter, setLanguage, setPage, setItemsPerPage } =
    useTableState();

  const { entries, totalEntries, totalPages } = useProcessedData(state);

  return (
    <div className="flex h-full max-w-full flex-col">
      {/* Edit Mode Indicator */}
      <EditModeIndicator />

      {/* Main Table Container */}
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {/* Language Selector */}
        <LanguageSelector
          selectedLanguage={state.selectedLanguage}
          onLanguageChange={setLanguage}
        />

        {/* Table Container */}
        <div className="relative flex-1 overflow-hidden">
          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 h-full overflow-x-auto overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <TableHeader
                filters={state.filters}
                sortColumn={state.sortColumn}
                sortDirection={state.sortDirection}
                onFilterChange={updateFilter}
                onFilterClear={clearFilter}
                onSort={() => {}}
              />

              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan={10}>
                      <LoadingIndicator />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <TableBody entries={entries} />
              )}
            </table>
          </div>

          {/* Subtle gradient overlay for scroll indication */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={state.currentPage}
          totalPages={totalPages}
          itemsPerPage={state.itemsPerPage}
          totalItems={totalEntries}
          onPageChange={setPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}
