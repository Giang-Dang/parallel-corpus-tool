'use client';

import MultipleFilesConfirmationDialog from './components/LanguageConfirmationDialog';
import useFileLoaderAction from './hooks/useFileLoaderAction';

export default function FileLoader() {
  const {
    isLoading,
    error,
    handleFileSelection,
    onClose,
    showLanguageConfirmation,
    setShowLanguageConfirmation,
    processFiles,
    progressedLines,
    totalLines,
  } = useFileLoaderAction();

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="m-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Load your file(s)</h2>
          {/* Close button */}
          <button type="button" onClick={onClose} aria-label="Close">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <MultipleFilesConfirmationDialog onConfirm={processFiles} />
        {error && <ErrorDialog errorMessage={error} />}
        {isLoading ? (
          <ProgressDisplay
            totalFiles={totalFiles}
            processedFiles={processedFiles}
            onCancel={handleCancel}
          />
        ) : (
          <FileDropZone onFileDrop={handleFileDrop} />
        )}

        {/* File input */}
        <input
          className="hidden"
          title="Select corpus files (max 2)"
          aria-label="Select corpus files (max 2)"
          type="file"
          accept=".txt,.csv"
          multiple
          onChange={handleFileSelection}
        />
      </div>
    </div>
  );
}
