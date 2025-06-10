'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface PopupContextType {
  isOpenPopup: boolean;
  setIsOpenPopup: Dispatch<SetStateAction<boolean>>;
  currentPopup: string;
  setCurrentPopup: Dispatch<SetStateAction<string>>;
  closePopup: () => void;
  openPopup: (popup: string) => void;
}

const PopupContext = createContext<PopupContextType | null>(null);

export const usePopupContext = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopupContext must be used within a PopupContextProvider');
  }
  return context;
};

export const PopupContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState('');

  const closePopup = useCallback(() => {
    setIsOpenPopup(false);
    setCurrentPopup('');
  }, []);

  const openPopup = useCallback((popup: string) => {
    setIsOpenPopup(true);
    setCurrentPopup(popup);
  }, []);

  const value: PopupContextType = useMemo(
    () => ({
      isOpenPopup,
      setIsOpenPopup,
      currentPopup,
      setCurrentPopup,
      closePopup,
      openPopup,
    }),
    [isOpenPopup, currentPopup, closePopup, openPopup],
  );

  return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>;
};
