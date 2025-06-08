'use client';

import { createContext, useContext, useMemo, useState } from 'react';

interface PopupContextType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  currentPopup: string;
  setCurrentPopup: (value: string) => void;
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
  const [isOpen, setIsOpen] = useState(false);
  const [currentPopup, setCurrentPopup] = useState('');

  const value: PopupContextType = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      currentPopup,
      setCurrentPopup,
    }),
    [isOpen, currentPopup],
  );

  return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>;
};
