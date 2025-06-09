import { usePopupContext } from '@/contexts/PopupContext';
import FileLoader from '../../features/corpus/FileLoader';

export default function Popups() {
  const { isOpen, currentPopup } = usePopupContext();

  if (!isOpen) return null;

  return <>{currentPopup === 'fileLoader' && <FileLoader />}</>;
}
