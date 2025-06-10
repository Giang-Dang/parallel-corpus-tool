'use client';

import { FileDropZone } from '@/components/FileLoader/molecules/FileDropZone';
import MultipleFilesConfirmationDialog from './molecules/MultipleFilesConfirmationDialog';
import useFileLoaderAction from './hooks/useFileLoaderAction';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import ErrorDialog from '@/components/FileLoader/molecules/ErrorDialog';
import { useAppContext } from '@/contexts/AppContext';
import ProgressDisplay from '@/components/FileLoader/molecules/ProgressDisplay';

export default function FileLoader() {
  const {
    isLoading,
    error,
    onClose,
    processFiles,
    progressedLines,
    totalLines,
    handleFileDrop,
    handleBrowseClick,
    fileInputRef,
    handleFileSelect,
    showLanguageConfirmation,
  } = useFileLoaderAction();

  const { selectedFileGroup } = useAppContext();

  const { isDragOver, handleDragOver, handleDragLeave } = useDragAndDrop();

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
        {showLanguageConfirmation && (
          <MultipleFilesConfirmationDialog
            selectedFileGroup={selectedFileGroup}
            onConfirm={processFiles}
          />
        )}
        {error && <ErrorDialog errorMessage={error} />}
        {isLoading ? (
          <ProgressDisplay totalLines={totalLines} progressedLines={progressedLines} />
        ) : (
          <FileDropZone
            isDragOver={isDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleFileDrop}
            onBrowseClick={handleBrowseClick}
          />
        )}

        {/* File input */}
        <input
          ref={fileInputRef}
          className="hidden"
          title="Select corpus files (max 2)"
          aria-label="Select corpus files (max 2)"
          type="file"
          accept=".txt,.csv"
          multiple
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}
