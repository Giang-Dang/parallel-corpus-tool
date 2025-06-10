import { CorpusEntry } from '@/types/data.types';
import { CORPUS_COLUMNS } from '../utils/columnConfig';
import SmartTableCell from './SmartTableCell';

interface TableBodyProps {
  entries: CorpusEntry[];
}

export default function TableBody({ entries }: TableBodyProps) {
  if (entries.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={CORPUS_COLUMNS.length} className="px-6 py-16 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="mb-1 text-lg font-medium text-gray-900">No entries found</h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your filters or language selection to see results.
                </p>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-gray-100 bg-white">
      {entries.map((entry, index) => (
        <tr
          key={`${entry.entryId}-${index}`}
          className={`group transition-all duration-200 hover:bg-blue-50/30 hover:shadow-sm ${
            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
          }`}
        >
          {CORPUS_COLUMNS.map((column, colIndex) => {
            const value = entry[column.key];
            const isFirstColumn = colIndex === 0;
            const isImportantColumn = ['word', 'lemma', 'pos'].includes(column.key);

            return (
              <SmartTableCell
                key={column.key}
                value={value}
                rowId={entry.entryId}
                column={column.key}
                isEditable={column.editable}
                className={`px-6 py-4 text-sm transition-colors duration-200 group-hover:text-gray-900 ${
                  isFirstColumn
                    ? 'font-semibold text-gray-900'
                    : isImportantColumn
                      ? 'font-medium text-gray-800'
                      : 'text-gray-600'
                } `}
              />
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
