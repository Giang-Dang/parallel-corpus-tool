import { useState, useRef, useEffect } from 'react';
import { FilterType, ColumnFilter as ColumnFilterType } from '../types';

interface ColumnFilterProps {
  column: string;
  filter?: ColumnFilterType;
  onFilterChange: (column: string, filter: Partial<ColumnFilterType>) => void;
  onFilterClear: (column: string) => void;
  hasActiveFilter?: boolean;
  columnIndex?: number;
}

export default function ColumnFilter({
  column,
  filter,
  onFilterChange,
  onFilterClear,
  hasActiveFilter,
  columnIndex = 0,
}: ColumnFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(filter?.value || '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterType = filter?.type || FilterType.CONTAIN;
  const matchCase = filter?.matchCase || false;
  const isFiltered = hasActiveFilter || (filter && filter.value);

  const isLeftmostColumn = columnIndex <= 2;
  const positioningClass = isLeftmostColumn ? 'left-0' : 'right-0';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (tempValue !== filter?.value) {
          setTempValue(filter?.value || '');
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, tempValue, filter?.value]);

  const handleApplyFilter = () => {
    if (tempValue.trim()) {
      onFilterChange(column, {
        value: tempValue.trim(),
        type: filterType,
        matchCase,
      });
    } else {
      onFilterClear(column);
    }
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    setTempValue('');
    onFilterClear(column);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative rounded-lg p-2 transition-all duration-200 hover:bg-white/80 hover:shadow-md ${
          isFiltered
            ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-200'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        title="Filter column"
      >
        <svg
          className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isFiltered ? 2.5 : 2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
          />
        </svg>
        {isFiltered && (
          <div className="absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute top-full ${positioningClass} z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 backdrop-blur-sm`}
        >
          <div className="space-y-4 p-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-semibold text-gray-900">Filter Options</h3>
              <div className="rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-500">{column}</div>
            </div>

            {/* Filter Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Filter Type</label>
              <select
                value={filterType}
                onChange={(e) => onFilterChange(column, { type: e.target.value as FilterType })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                title="Select filter type"
              >
                <option value={FilterType.CONTAIN}>Contains</option>
                <option value={FilterType.EXACT}>Exact match</option>
                <option value={FilterType.STARTS_WITH}>Starts with</option>
                <option value={FilterType.ENDS_WITH}>Ends with</option>
              </select>
            </div>

            {/* Search Value */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Search Value</label>
              <div className="relative">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  placeholder="Enter search term..."
                  autoFocus
                />
                {tempValue && (
                  <button
                    onClick={() => setTempValue('')}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
                    title="Clear search value"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Match Case */}
            <div className="flex items-center space-x-3">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={matchCase}
                  onChange={(e) => onFilterChange(column, { matchCase: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">Match case</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={handleApplyFilter}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                Apply Filter
              </button>
              <button
                onClick={handleClearFilter}
                className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
