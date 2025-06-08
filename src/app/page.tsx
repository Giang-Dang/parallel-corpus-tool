'use client';

import Main from '@/components/Main';
import { AppProvider } from '@/contexts/AppContext';

export default function Home() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}
