'use client';

import { SaveButtonState } from '@/types/ui.types';
import { useAppContext } from '@/contexts/AppContext';
import { useCallback, useMemo } from 'react';
import { usePopupContext } from '@/contexts/PopupContext';
import { PopupType } from '@/types/popup.types';

// Extend SaveButtonState to include validation error
type ExtendedSaveButtonState = SaveButtonState | 'validation_error';

export default function useFileMenu() {
  const { isEditMode, hasChangesInDataTable, changesCount, canSaveChanges, hasValidationIssues } =
    useAppContext();
  const { openPopup } = usePopupContext();

  const saveButtonState: ExtendedSaveButtonState = useMemo(() => {
    if (!isEditMode || !hasChangesInDataTable) return SaveButtonState.disabled;
    if (hasChangesInDataTable && hasValidationIssues) return 'validation_error';
    if (hasChangesInDataTable) return SaveButtonState.unsaved;
    return SaveButtonState.exported;
  }, [isEditMode, hasChangesInDataTable, hasValidationIssues]);

  const saveIcon = useMemo(() => {
    if (saveButtonState === SaveButtonState.exported) {
      return (
        <svg
          className="h-4 w-4 text-white sm:h-5 sm:w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }

    if (saveButtonState === 'validation_error') {
      return (
        <svg className="h-4 w-4 text-white sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return (
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
          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    );
  }, [saveButtonState]);

  const saveButtonText = useMemo(
    () => ({
      disabled: {
        title: 'Save',
        subtitle: !isEditMode ? 'Enable edit mode to save' : 'No changes to save',
      },
      unsaved: {
        title: `Save (${changesCount})`,
        subtitle: 'Export changes to file',
      },
      exported: {
        title: 'Saved',
        subtitle: 'Changes exported',
      },
      validation_error: {
        title: 'Cannot Save',
        subtitle: 'Resolve conflicts first',
      },
    }),
    [isEditMode, changesCount],
  );

  const currentStyles = useMemo(() => {
    const styles = {
      [SaveButtonState.disabled]: {
        container: 'bg-gray-100 border border-gray-200 cursor-not-allowed opacity-60',
        icon: 'bg-gradient-to-r from-gray-400 to-gray-500',
        title: 'text-gray-500',
        subtitle: 'text-gray-400',
      },
      [SaveButtonState.unsaved]: {
        container: 'bg-white border border-amber-300 hover:border-amber-400 hover:shadow-lg',
        icon: 'bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-600 group-hover:to-amber-700',
        title: 'text-gray-900',
        subtitle: 'text-amber-600',
      },
      [SaveButtonState.exported]: {
        container: 'bg-white border border-emerald-300 hover:border-emerald-400 hover:shadow-lg',
        icon: 'bg-gradient-to-r from-emerald-500 to-emerald-600 group-hover:from-emerald-600 group-hover:to-emerald-700',
        title: 'text-gray-900',
        subtitle: 'text-emerald-600',
      },
      validation_error: {
        container: 'bg-red-50 border border-red-300 cursor-not-allowed opacity-80',
        icon: 'bg-gradient-to-r from-red-500 to-red-600',
        title: 'text-red-900',
        subtitle: 'text-red-600',
      },
    };
    return styles[saveButtonState];
  }, [saveButtonState]);

  const currentText = useMemo(
    () => saveButtonText[saveButtonState],
    [saveButtonText, saveButtonState],
  );

  const handleOpenClick = useCallback(() => {
    openPopup(PopupType.FileLoader);
  }, [openPopup]);

  const handleSaveClick = useCallback(() => {
    if (!canSaveChanges) {
      // Optionally show a notification or open changes preview to show issues
      if (hasValidationIssues) {
        openPopup(PopupType.ChangesPreview);
      }
      return;
    }
    // TODO: Implement actual save functionality
    console.log('Save changes triggered');
  }, [canSaveChanges, hasValidationIssues, openPopup]);

  return {
    saveButtonState,
    saveIcon,
    saveButtonText,
    currentStyles,
    currentText,
    handleOpenClick,
    handleSaveClick,
  };
}
