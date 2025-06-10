export default function ErrorDialog({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
      <div className="flex items-center">
        <svg
          className="mr-2 h-5 w-5 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm text-red-700">{errorMessage}</span>
      </div>
    </div>
  );
}
