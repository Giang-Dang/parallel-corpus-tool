'use client';

import Main from '@/components/Main';
import { AppProvider } from '@/contexts/AppContext';
import { PopupContextProvider } from '@/contexts/PopupContext';

export default function Home() {
  return (
    <AppProvider>
      <PopupContextProvider>
        <Main />
      </PopupContextProvider>
    </AppProvider>
  );
}
