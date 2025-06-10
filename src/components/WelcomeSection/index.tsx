import { usePopupContext } from '@/contexts/PopupContext';
import { useCallback } from 'react';

export default function WelcomeSection() {
  const { openPopup } = usePopupContext();

  const onLoadFileClick = useCallback(() => {
    openPopup('fileLoader');
  }, [openPopup]);

  return (
    <div className="mb-6 rounded-lg border bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">Welcome to CLC Parallel Corpus Tool</h2>
      <p className="mx-auto mb-6 max-w-2xl text-gray-600">
        A comprehensive bilingual corpus analysis platform for Vietnamese-Chinese language research,
        teaching, and vocabulary comparison. Extract, analyze, and compare linguistic data with
        advanced search and statistical tools.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={onLoadFileClick}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          📁 Load Corpus File(s)
        </button>
      </div>
    </div>
  );
}
