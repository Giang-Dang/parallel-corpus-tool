'use client';

import Image from 'next/image';

export default function Header() {
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
        </div>
      </div>
    </header>
  );
}
