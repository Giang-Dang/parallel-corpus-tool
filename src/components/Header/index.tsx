'use client';

import { useAppContext } from '@/contexts/AppContext';
import Image from 'next/image';

export default function Header() {
  const { setIsEditMode, isEditMode } = useAppContext();

  const handleToggle = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/hcmus_logo.svg"
              alt="HCMUS Logo"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Parallel Corpus Tool</h1>
              <p className="text-sm text-gray-600">Bilingual Data Extraction & Analysis Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Edit Mode:</span>
              <button
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isEditMode ? 'bg-blue-500' : 'bg-blue-200'
                }`}
                title={`${isEditMode ? 'Disable' : 'Enable'} edit mode`}
                aria-label={`${isEditMode ? 'Disable' : 'Enable'} edit mode`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEditMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
