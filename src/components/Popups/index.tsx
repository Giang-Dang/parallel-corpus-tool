'use client';

import { usePopupContext } from '@/contexts/PopupContext';
import FileLoader from '../FileLoader';
import ChangesPreview from '../DataTable/molecules/ChangesPreview';
import { PopupType } from '../../types/popup.types';

export default function Popups() {
  const { isOpenPopup, currentPopup } = usePopupContext();

  if (!isOpenPopup) return null;

  return (
    <>
      {currentPopup === PopupType.FileLoader && <FileLoader />}
      {currentPopup === PopupType.ChangesPreview && <ChangesPreview />}
    </>
  );
}
