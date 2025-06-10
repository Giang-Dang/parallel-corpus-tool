'use client';

import DataTable from '@/components/features/corpus/DataTable';
import Header from '@/components/ui/Header';
import Popups from '@/components/ui/Popups';
import RibbonMenu from '@/components/ui/RibbonMenu';
import WelcomeSection from '@/components/ui/WelcomeSection';
import { AppProvider } from '@/contexts/AppContext';
import { DatabaseInMemoryProvider } from '@/contexts/DatabaseInMemoryContext';
import { PopupContextProvider } from '@/contexts/PopupContext';

export default function Home() {
  return (
    <DatabaseInMemoryProvider>
      <AppProvider>
        <PopupContextProvider>
          <Header />
          <RibbonMenu />
          <WelcomeSection />
          <DataTable />
          <Popups />
        </PopupContextProvider>
      </AppProvider>
    </DatabaseInMemoryProvider>
  );
}
