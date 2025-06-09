interface FileDropZoneProps {
  isDragOver: boolean;
  onDragOver: (event: React.DragEvent) => void;
  onDragLeave: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  onBrowseClick: () => void;
}

export const FileDropZone = ({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onBrowseClick,
}: FileDropZoneProps) => {
  return (
    <div
      className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        <svg
          className="h-6 w-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">
        {isDragOver ? 'Drop your file here' : 'Upload Corpus File'}
      </h3>
      <p className="mb-4 text-gray-600">Drag and drop your file here or click to browse</p>
      <div className="mb-4 rounded-lg bg-gray-50 p-3">
        <p className="text-xs text-gray-600">
          <strong>Multi-language support:</strong> For bilingual analysis, use files with pattern:
          name_language.txt (e.g., dic1_en.txt, dic1_vn.txt). Drop two language files together to
          enable bilingual features.
        </p>
      </div>
      <button
        onClick={onBrowseClick}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Browse Files
      </button>
    </div>
  );
};
