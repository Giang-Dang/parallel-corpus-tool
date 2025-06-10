export default function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-2 text-gray-600">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <span className="text-sm">Loading entries...</span>
      </div>
    </div>
  );
}
