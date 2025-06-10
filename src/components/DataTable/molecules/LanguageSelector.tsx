import { useMemo } from 'react';
import { useDatabaseInMemoryContext } from '@/contexts/DatabaseInMemoryContext';
import { getLanguageName } from '@/utils/languageHelper';
import { LanguageCode } from '@/constants/languages';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const { fileEntries, corpusEntries } = useDatabaseInMemoryContext();

  console.log('corpusEntries.length', corpusEntries.length);
  const availableLanguages = useMemo(() => {
    return fileEntries.map((file) => ({
      code: file.language,
      name: getLanguageName(file.language as LanguageCode),
    }));
  }, [fileEntries]);

  return (
    <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Language Selection */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              <label className="text-sm font-medium text-gray-700">Language</label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {availableLanguages.map((language) => {
                const count = corpusEntries.filter(
                  (entry) => entry.language === language.code,
                ).length;
                return (
                  <label
                    key={language.code}
                    className="group flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 has-[:checked]:border-blue-200 has-[:checked]:bg-blue-50"
                  >
                    <input
                      type="radio"
                      name="language-filter"
                      value={language.code}
                      checked={selectedLanguage === language.code}
                      onChange={(e) => onLanguageChange(e.target.value)}
                      className="h-3.5 w-3.5 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-700">{language.name}</span>
                    <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Display */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>
              {corpusEntries.length.toLocaleString()}{' '}
              {corpusEntries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          <div className="h-4 w-px bg-gray-300"></div>

          <div className="flex items-center gap-2 text-gray-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            <span>{availableLanguages.length} languages</span>
          </div>
        </div>
      </div>
    </div>
  );
}
