import ColumnFilter from './ColumnFilter';
import { CORPUS_COLUMNS } from '../utils/columnConfig';
import { ColumnFilter as ColumnFilterType } from '../types';

interface TableHeaderProps {
  filters: Record<string, ColumnFilterType>;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  onFilterChange: (column: string, filter: Partial<ColumnFilterType>) => void;
  onFilterClear: (column: string) => void;
  onSort: (column: string) => void;
}

export default function TableHeader({ filters, onFilterChange, onFilterClear }: TableHeaderProps) {
  return (
    <thead className="sticky top-0 z-10 border-b border-blue-400 bg-gray-200">
      <tr>
        {CORPUS_COLUMNS.map((column) => {
          const hasFilter = filters[column.key]?.value;

          return (
            <th key={column.key} className="group relative px-6 py-4 text-left last:border-r-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center">
                  <span className="text-m font-semibold tracking-wide text-gray-700 uppercase">
                    {column.label}
                  </span>
                </div>

                {column.filterable && (
                  <div className="flex-shrink-0">
                    <ColumnFilter
                      column={column.key}
                      filter={filters[column.key]}
                      onFilterChange={onFilterChange}
                      onFilterClear={onFilterClear}
                      hasActiveFilter={!!hasFilter}
                    />
                  </div>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
