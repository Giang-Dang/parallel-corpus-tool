'use client';

import DataTable from '@/components/features/corpus/DataTable';
import { AppProvider } from '@/contexts/AppContext';
import { PopupContextProvider } from '@/contexts/PopupContext';

export default function Home() {
  return (
    <AppProvider>
      <PopupContextProvider>
        <DataTable />
      </PopupContextProvider>
    </AppProvider>
  );
}
