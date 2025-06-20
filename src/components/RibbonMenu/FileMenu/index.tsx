import { useAppContext } from '@/contexts/AppContext';
import useFileMenu from './hooks/useFileMenu';
import { usePopupContext } from '@/contexts/PopupContext';
import { PopupType } from '@/types/popup.types';

export default function FileMenu() {
  const { handleOpenClick } = useFileMenu();

  const { isEditMode, setIsEditMode, changesCount, hasChangesInDataTable, canSaveChanges } =
    useAppContext();
  const { openPopup } = usePopupContext();

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        {/* Primary Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {/* Open Button */}
          <button
            onClick={handleOpenClick}
            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 transition-all duration-200 hover:scale-[1.02] hover:border-blue-300 hover:shadow-lg sm:px-4 sm:py-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-200 group-hover:from-blue-600 group-hover:to-blue-700 sm:h-10 sm:w-10">
              <svg
                className="h-4 w-4 text-white sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900 sm:text-base">Open</div>
              <div className="text-xs text-gray-500">Load corpus file</div>
            </div>
          </button>

          {/* Edit Mode Toggle Button */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg sm:px-4 sm:py-3 ${
              isEditMode
                ? 'border-orange-300 bg-orange-50 hover:border-orange-400'
                : 'border-gray-200 bg-white hover:border-green-300'
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 sm:h-10 sm:w-10 ${
                isEditMode
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700'
                  : 'bg-gradient-to-r from-green-500 to-green-600 group-hover:from-green-600 group-hover:to-green-700'
              }`}
            >
              <svg
                className="h-4 w-4 text-white sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isEditMode ? (
                  // Exit edit mode icon
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  // Enter edit mode icon
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                )}
              </svg>
            </div>
            <div className="text-left">
              <div
                className={`text-sm font-medium sm:text-base ${isEditMode ? 'text-orange-900' : 'text-gray-900'}`}
              >
                {isEditMode ? 'Exit Edit' : 'Edit Mode'}
              </div>
              <div className={`text-xs ${isEditMode ? 'text-orange-600' : 'text-gray-500'}`}>
                {isEditMode ? `${changesCount} changes` : 'Click cells to edit'}
              </div>
            </div>
          </button>

          {/* Combined Preview Changes & Save Button */}
          {isEditMode && hasChangesInDataTable && (
            <button
              onClick={() => {
                openPopup(PopupType.ChangesPreview);
              }}
              className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg sm:px-4 sm:py-3 ${
                canSaveChanges
                  ? 'border-purple-300 bg-purple-50 hover:border-purple-400'
                  : 'border-amber-300 bg-amber-50 hover:border-amber-400'
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 sm:h-10 sm:w-10 ${
                  canSaveChanges
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-600 group-hover:to-amber-700'
                }`}
              >
                <svg
                  className="h-4 w-4 text-white sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7H9l3 3 3-3h-3V9"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div
                  className={`text-sm font-medium sm:text-base ${canSaveChanges ? 'text-purple-900' : 'text-amber-900'}`}
                >
                  Preview Changes & Save
                </div>
                <div className={`text-xs ${canSaveChanges ? 'text-purple-600' : 'text-amber-600'}`}>
                  {canSaveChanges
                    ? `Review ${changesCount} changes & save`
                    : `${changesCount} changes - resolve issues first`}
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
