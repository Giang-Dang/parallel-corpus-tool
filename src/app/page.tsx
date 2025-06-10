'use client';

import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import Popups from '@/components/Popups';
import RibbonMenu from '@/components/RibbonMenu';
import WelcomeSection from '@/components/WelcomeSection';
import { AppProvider } from '@/contexts/AppContext';
import { DatabaseInMemoryProvider } from '@/contexts/DatabaseInMemoryContext';
import { PopupContextProvider } from '@/contexts/PopupContext';

export default function Home() {
  return (
    <DatabaseInMemoryProvider>
      <AppProvider>
        <PopupContextProvider>
          <div className="flex h-screen flex-col overflow-hidden">
            <Header />
            <RibbonMenu />
            <WelcomeSection />
            <div className="flex-1 overflow-hidden p-4">
              <DataTable />
            </div>
            <Popups />
          </div>
        </PopupContextProvider>
      </AppProvider>
    </DatabaseInMemoryProvider>
  );
}
