import { useAppContext } from '@/contexts/AppContext';

interface ProgressDisplayProps {
  totalLines: number;
  progressedLines: number;
}

export default function ProgressDisplay({ totalLines, progressedLines }: ProgressDisplayProps) {
  const { selectedFileGroup } = useAppContext();

  const progressPercentage =
    totalLines && totalLines > 0 ? Math.min((progressedLines / totalLines) * 100, 100) : 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4 h-16 w-16">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

        {/* Progress circle */}
        <div className="absolute inset-0">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
            <path
              className="text-blue-600"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={`${progressPercentage}, 100`}
              strokeLinecap="round"
              d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          {/* Progress percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-700">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>

      <p className="mb-2 font-medium text-gray-900">Processing {selectedFileGroup.baseName}</p>

      <p className="mb-4 text-sm text-gray-600">
        {progressedLines > 0
          ? totalLines
            ? `${progressedLines.toLocaleString()} of ${totalLines.toLocaleString()} rows (${Math.round(
                progressPercentage,
              )}%)`
            : `Processed ${progressedLines.toLocaleString()} rows`
          : 'Starting...'}
      </p>
    </div>
  );
}
